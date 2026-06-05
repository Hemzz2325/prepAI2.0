import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth } from "@clerk/nextjs/server";
import { applyRateLimit } from "@/lib/ratelimit";

export async function POST(req) {
  const rateLimitResponse = await applyRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const amount = body.amount;
  if (!amount || typeof amount !== "number" || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json({ error: "Razorpay keys not configured" }, { status: 500 });
  }

  const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const options = {
      amount: amount * 100, // Razorpay amount is in subunits (paise)
      currency: "INR",
      receipt: `rcpt_${userId}_${Date.now()}`.substring(0, 40),
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json({ orderId: order.id, amount: order.amount }, { status: 200 });
  } catch (err) {
    console.error("Razorpay create-order error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
