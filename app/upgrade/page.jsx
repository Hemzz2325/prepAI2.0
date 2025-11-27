'use client'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Crown, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import Script from "next/script";

export default function Upgrade() {
  const { user } = useUser();

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder", // Enter the Key ID generated from the Dashboard
      amount: 99900, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "PrepAi Pro",
      description: "Upgrade to Pro Plan",
      image: "/logo.svg",
      // order_id: "order_9A33XWu170g87H", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: function (response) {
        alert("Payment Successful: " + response.razorpay_payment_id);
        // You can call an API here to save the payment details
      },
      prefill: {
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        contact: "9999999999",
      },
      notes: {
        address: "PrepAi Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <Image src="/logo.svg" alt="PrepAi Logo" width={60} height={80} />
          </Link>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="ghost">How It Works</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Upgrade Your Plan</h1>
          <p className="text-lg opacity-90">Unlock premium features and accelerate your interview preparation</p>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Free Plan */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 
    transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-gray-300">
            <h3 className="text-xl font-bold mb-1">Free</h3>
            <p className="text-gray-600 mb-4 text-sm">Perfect for getting started</p>

            <div className="text-2xl font-bold text-green-600 mb-6">
              $0 <span className="text-sm text-gray-600">/month</span>
            </div>

            <ul className="space-y-3 mb-6 text-sm">
              <li className="flex gap-2"><CheckCircle className="text-green-600 w-4 h-4" />3 interviews per month</li>
              <li className="flex gap-2"><CheckCircle className="text-green-600 w-4 h-4" />5 questions per interview</li>
              <li className="flex gap-2"><CheckCircle className="text-green-600 w-4 h-4" />Basic AI feedback</li>
              <li className="flex gap-2"><CheckCircle className="text-green-600 w-4 h-4" />Privacy protected</li>
            </ul>

            <Link href="/dashboard">
              <Button className="w-full bg-gray-700 hover:bg-gray-800 text-sm py-2">Get Started</Button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-600 relative 
    transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-blue-700">

            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                POPULAR
              </span>
            </div>

            <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
              <Zap className="text-blue-600 w-5 h-5" /> Pro
            </h3>
            <p className="text-gray-600 mb-4 text-sm">For serious job seekers</p>

            <div className="text-2xl font-bold text-blue-600 mb-6">
              $9.99 <span className="text-sm text-gray-600">/month</span>
            </div>

            <ul className="space-y-3 mb-6 text-sm">
              <li className="flex gap-2"><CheckCircle className="text-blue-600 w-4 h-4" />Unlimited interviews</li>
              <li className="flex gap-2"><CheckCircle className="text-blue-600 w-4 h-4" />10 questions per interview</li>
              <li className="flex gap-2"><CheckCircle className="text-blue-600 w-4 h-4" />Advanced AI feedback</li>
              <li className="flex gap-2"><CheckCircle className="text-blue-600 w-4 h-4" />Performance analytics</li>
              <li className="flex gap-2"><CheckCircle className="text-blue-600 w-4 h-4" />Interview templates</li>
              <li className="flex gap-2"><CheckCircle className="text-blue-600 w-4 h-4" />Priority support</li>
            </ul>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-sm py-2"
              onClick={handlePayment}
            >
              Upgrade to Pro
            </Button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-purple-300
    transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-purple-400">
            <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
              <Crown className="text-purple-600 w-5 h-5" /> Enterprise
            </h3>
            <p className="text-gray-600 mb-4 text-sm">For teams and organizations</p>

            <div className="text-2xl font-bold text-purple-600 mb-6">
              Custom <span className="text-sm text-gray-600">/month</span>
            </div>

            <ul className="space-y-3 mb-6 text-sm">
              <li className="flex gap-2"><CheckCircle className="text-purple-600 w-4 h-4" />Everything in Pro</li>
              <li className="flex gap-2"><CheckCircle className="text-purple-600 w-4 h-4" />Team collaboration</li>
              <li className="flex gap-2"><CheckCircle className="text-purple-600 w-4 h-4" />Custom question sets</li>
              <li className="flex gap-2"><CheckCircle className="text-purple-600 w-4 h-4" />Dedicated support</li>
              <li className="flex gap-2"><CheckCircle className="text-purple-600 w-4 h-4" />API access</li>
              <li className="flex gap-2"><CheckCircle className="text-purple-600 w-4 h-4" />SLA guarantee</li>
            </ul>

            <Link href="/contact">
              <Button variant="outline" className="w-full text-sm py-2">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Comparison Table + Animation */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Feature Comparison</h2>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="overflow-x-auto"
          >
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-4 px-4">Feature</th>
                  <th className="text-center py-4 px-4">Free</th>
                  <th className="text-center py-4 px-4">Pro</th>
                  <th className="text-center py-4 px-4">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Interviews per month", "3", "Unlimited", "Unlimited"],
                  ["Questions per interview", "5", "10", "Custom"],
                  ["AI Feedback", "✓", "✓ Advanced", "✓ Custom"],
                  ["Performance Analytics", "-", "✓", "✓"],
                  ["Interview Templates", "-", "✓", "✓"],
                  ["Priority Support", "-", "✓", "✓ Dedicated"],
                ].map((row, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    viewport={{ once: true }}
                    className={index % 2 ? "bg-gray-50 border-b border-gray-200" : "border-b border-gray-200"}
                  >
                    <td className="py-4 px-4">{row[0]}</td>
                    <td className="text-center py-4 px-4">{row[1]}</td>
                    <td className="text-center py-4 px-4">{row[2]}</td>
                    <td className="text-center py-4 px-4">{row[3]}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>

      {/* FAQ + Animations */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-6">
            {[
              ["Can I cancel my subscription anytime?", "Yes! You can cancel your subscription at any time with no penalties. Your access will continue until the end of your billing period."],
              ["Do you offer refunds?", "We offer a 7-day money-back guarantee if you're not satisfied with the Pro plan."],
              ["Can I switch plans?", "Absolutely! You can upgrade or downgrade your plan at any time. Billing will be adjusted accordingly."],
              ["What payment methods do you accept?", "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal."]
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow"
              >
                <h3 className="font-bold text-lg mb-2">{faq[0]}</h3>
                <p className="text-gray-600">{faq[1]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Upgrade?</h2>
          <p className="text-lg mb-8 opacity-90">Start your Pro plan today and unlock unlimited interview practice</p>
          <Button
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
            onClick={handlePayment}
          >
            Upgrade Now
          </Button>
        </div>
      </div>
    </div>
  );
}
