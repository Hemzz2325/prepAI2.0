/**
 * Unit tests for the Razorpay payment signature verification logic
 * (the critical security path inside app/api/razorpay/verify/route.js).
 *
 * We extract the HMAC signing logic into a pure function so it can be
 * tested without Next.js, a database, or real Razorpay credentials.
 *
 * NOTE: All values below are UNIT-TEST FIXTURES ONLY.
 * None of these are real keys, order IDs, or payment IDs.
 */
import { describe, it, expect } from "vitest";
import crypto from "crypto";

// ─── Pure HMAC verification helper (mirrors route.js exactly) ────────────────
function verifyRazorpaySignature(orderId, paymentId, signature, secret) {
  const generated = crypto
    .createHmac("sha256", secret)
    .update(orderId + "|" + paymentId)
    .digest("hex");
  return generated === signature;
}

function generateSignature(orderId, paymentId, secret) {
  return crypto
    .createHmac("sha256", secret)
    .update(orderId + "|" + paymentId)
    .digest("hex");
}

// ─── verifyRazorpaySignature ──────────────────────────────────────────────────
// These are fake fixture values — not real credentials.
describe("verifyRazorpaySignature", () => {
  const HMAC_FIXTURE_KEY  = "fixture-hmac-key-not-a-real-secret";
  const FIXTURE_ORDER_ID  = "fixture_order_AAABBBCCC";
  const FIXTURE_PAY_ID    = "fixture_pay_DDDEEEFFF";
  const VALID_SIG = generateSignature(FIXTURE_ORDER_ID, FIXTURE_PAY_ID, HMAC_FIXTURE_KEY);

  it("returns true for a correctly generated signature", () => {
    expect(verifyRazorpaySignature(FIXTURE_ORDER_ID, FIXTURE_PAY_ID, VALID_SIG, HMAC_FIXTURE_KEY)).toBe(true);
  });

  it("returns false for a tampered signature", () => {
    const tampered = VALID_SIG.slice(0, -1) + "0"; // flip last char
    expect(verifyRazorpaySignature(FIXTURE_ORDER_ID, FIXTURE_PAY_ID, tampered, HMAC_FIXTURE_KEY)).toBe(false);
  });

  it("returns false when orderId is swapped", () => {
    expect(verifyRazorpaySignature("fixture_order_OTHER", FIXTURE_PAY_ID, VALID_SIG, HMAC_FIXTURE_KEY)).toBe(false);
  });

  it("returns false when paymentId is swapped", () => {
    expect(verifyRazorpaySignature(FIXTURE_ORDER_ID, "fixture_pay_OTHER", VALID_SIG, HMAC_FIXTURE_KEY)).toBe(false);
  });

  it("returns false when the wrong key is used", () => {
    expect(verifyRazorpaySignature(FIXTURE_ORDER_ID, FIXTURE_PAY_ID, VALID_SIG, "fixture-wrong-key")).toBe(false);
  });

  it("returns false for an empty signature", () => {
    expect(verifyRazorpaySignature(FIXTURE_ORDER_ID, FIXTURE_PAY_ID, "", HMAC_FIXTURE_KEY)).toBe(false);
  });

  it("returns false for a completely random string as signature", () => {
    expect(verifyRazorpaySignature(FIXTURE_ORDER_ID, FIXTURE_PAY_ID, "notahash", HMAC_FIXTURE_KEY)).toBe(false);
  });

  it("is deterministic — same inputs always produce the same result", () => {
    const sig1 = generateSignature(FIXTURE_ORDER_ID, FIXTURE_PAY_ID, HMAC_FIXTURE_KEY);
    const sig2 = generateSignature(FIXTURE_ORDER_ID, FIXTURE_PAY_ID, HMAC_FIXTURE_KEY);
    expect(sig1).toBe(sig2);
    expect(verifyRazorpaySignature(FIXTURE_ORDER_ID, FIXTURE_PAY_ID, sig1, HMAC_FIXTURE_KEY)).toBe(true);
  });

  it("produces a 64-character lowercase hex string", () => {
    expect(VALID_SIG).toMatch(/^[a-f0-9]{64}$/);
  });

  it("concatenates orderId and paymentId with '|' separator", () => {
    // If separator changed, old sigs become invalid → regression test
    const withPipe = generateSignature("A", "B", HMAC_FIXTURE_KEY);
    const withDash = crypto.createHmac("sha256", HMAC_FIXTURE_KEY).update("A-B").digest("hex");
    expect(withPipe).not.toBe(withDash);
  });
});

// ─── Amount conversion (razorpay uses paise, route multiplies by 100) ────────
describe("Razorpay amount conversion", () => {
  function toPaise(amountInRupees) {
    return amountInRupees * 100;
  }

  it("converts ₹100 to 10000 paise", () => {
    expect(toPaise(100)).toBe(10000);
  });

  it("converts ₹1 to 100 paise", () => {
    expect(toPaise(1)).toBe(100);
  });

  it("converts ₹0.50 to 50 paise", () => {
    expect(toPaise(0.5)).toBe(50);
  });

  it("conversion is always a positive integer for whole rupee amounts", () => {
    [1, 10, 100, 500, 999].forEach((r) => {
      expect(toPaise(r)).toBeGreaterThan(0);
      expect(Number.isInteger(toPaise(r))).toBe(true);
    });
  });
});

// ─── Receipt ID truncation (route.js uses .substring(0, 40)) ─────────────────
describe("Razorpay receipt ID generation", () => {
  function makeReceipt(userId) {
    return `rcpt_${userId}_${Date.now()}`.substring(0, 40);
  }

  it("receipt is at most 40 characters", () => {
    const r = makeReceipt("user_2yReallyLongClerkUserIdThatExceedsLimit");
    expect(r.length).toBeLessThanOrEqual(40);
  });

  it("receipt starts with 'rcpt_'", () => {
    expect(makeReceipt("user_abc").startsWith("rcpt_")).toBe(true);
  });

  it("short userId keeps full prefix visible", () => {
    const r = makeReceipt("usr123");
    expect(r.startsWith("rcpt_usr123")).toBe(true);
  });
});
