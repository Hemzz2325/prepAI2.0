import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/utils/db";
import { UserSubscription } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userEmail } = await req.json();

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userEmail) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!secret) {
    return NextResponse.json({ error: "Server misconfiguration: RAZORPAY_KEY_SECRET not set" }, { status: 500 });
  }

  // Verify Razorpay signature securely on the server
  const generated_signature = crypto
    .createHmac("sha256", secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  try {
    // Payment verified, now grant the user PRO access in DB
    const existing = await db
      .select()
      .from(UserSubscription)
      .where(eq(UserSubscription.userEmail, userEmail))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(UserSubscription)
        .set({
          plan: "pro",
          isLifetime: "true",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(UserSubscription.userEmail, userEmail));
    } else {
      await db.insert(UserSubscription).values({
        userEmail,
        plan: "pro",
        isLifetime: "true",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (dbError) {
    console.error("Database error while upgrading user:", dbError);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
