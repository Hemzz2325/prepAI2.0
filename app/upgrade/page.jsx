'use client'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Crown, Zap } from "lucide-react";

export default function Upgrade() {
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
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Upgrade Your Plan</h1>
          <p className="text-lg opacity-90">Unlock premium features and accelerate your interview preparation</p>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <p className="text-gray-600 mb-6">Perfect for getting started</p>
            <div className="text-3xl font-bold text-green-600 mb-6">$0<span className="text-lg text-gray-600">/month</span></div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3">
                <CheckCircle className="text-green-600 w-5 h-5 shrink-0 mt-0.5" />
                <span>3 interviews per month</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="text-green-600 w-5 h-5 shrink-0 mt-0.5" />
                <span>5 questions per interview</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="text-green-600 w-5 h-5 shrink-0 mt-0.5" />
                <span>Basic AI feedback</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="text-green-600 w-5 h-5 shrink-0 mt-0.5" />
                <span>Privacy protected</span>
              </li>
            </ul>

            <Link href="/dashboard">
              <Button className="w-full bg-gray-600 hover:bg-gray-700">Get Started</Button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-blue-600 relative transform scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">POPULAR</span>
            </div>
            
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Zap className="text-blue-600 w-6 h-6" />
              Pro
            </h3>
            <p className="text-gray-600 mb-6">For serious job seekers</p>
            <div className="text-3xl font-bold text-blue-600 mb-6">$9.99<span className="text-lg text-gray-600">/month</span></div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3">
                <CheckCircle className="text-blue-600 w-5 h-5 shrink-0 mt-0.5" />
                <span>Unlimited interviews</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="text-blue-600 w-5 h-5 shrink-0 mt-0.5" />
                <span>10 questions per interview</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="text-blue-600 w-5 h-5 shrink-0 mt-0.5" />
                <span>Advanced AI feedback</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="text-blue-600 w-5 h-5 shrink-0 mt-0.5" />
                <span>Performance analytics</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="text-blue-600 w-5 h-5 shrink-0 mt-0.5" />
                <span>Interview templates</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="text-blue-600 w-5 h-5 shrink-0 mt-0.5" />
                <span>Priority support</span>
              </li>
            </ul>

            <Button className="w-full bg-blue-600 hover:bg-blue-700">Upgrade to Pro</Button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-lg shadow-lg p-8 border border-purple-200">
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Crown className="text-purple-600 w-6 h-6" />
              Enterprise
            </h3>
            <p className="text-gray-600 mb-6">For teams and organizations</p>
            <div className="text-3xl font-bold text-purple-600 mb-6">Custom<span className="text-lg text-gray-600">/month</span></div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3">
                <CheckCircle className="text-purple-600 w-5 h-5 shrink-0 mt-0.5" />
                <span>Everything in Pro</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="text-purple-600 w-5 h-5 shrink-0 mt-0.5" />
                <span>Team collaboration</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="text-purple-600 w-5 h-5 shrink-0 mt-0.5" />
                <span>Custom question sets</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="text-purple-600 w-5 h-5 shrink-0 mt-0.5" />
                <span>Dedicated support</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="text-purple-600 w-5 h-5 shrink-0 mt-0.5" />
                <span>API access</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="text-purple-600 w-5 h-5 shrink-0 mt-0.5" />
                <span>SLA guarantee</span>
              </li>
            </ul>

            <Button variant="outline" className="w-full">Contact Sales</Button>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Feature Comparison</h2>
          <div className="overflow-x-auto">
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
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-4">Interviews per month</td>
                  <td className="text-center py-4 px-4">3</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="py-4 px-4">Questions per interview</td>
                  <td className="text-center py-4 px-4">5</td>
                  <td className="text-center py-4 px-4">10</td>
                  <td className="text-center py-4 px-4">Custom</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-4">AI Feedback</td>
                  <td className="text-center py-4 px-4">✓</td>
                  <td className="text-center py-4 px-4">✓ Advanced</td>
                  <td className="text-center py-4 px-4">✓ Custom</td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="py-4 px-4">Performance Analytics</td>
                  <td className="text-center py-4 px-4">-</td>
                  <td className="text-center py-4 px-4">✓</td>
                  <td className="text-center py-4 px-4">✓</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-4">Interview Templates</td>
                  <td className="text-center py-4 px-4">-</td>
                  <td className="text-center py-4 px-4">✓</td>
                  <td className="text-center py-4 px-4">✓</td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="py-4 px-4">Priority Support</td>
                  <td className="text-center py-4 px-4">-</td>
                  <td className="text-center py-4 px-4">✓</td>
                  <td className="text-center py-4 px-4">✓ Dedicated</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">Can I cancel my subscription anytime?</h3>
              <p className="text-gray-600">Yes! You can cancel your subscription at any time with no penalties. Your access will continue until the end of your billing period.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">We offer a 7-day money-back guarantee if you're not satisfied with the Pro plan.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">Can I switch plans?</h3>
              <p className="text-gray-600">Absolutely! You can upgrade or downgrade your plan at any time. Billing will be adjusted accordingly.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards (Visa, Mastercard, American Express) and PayPal.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Upgrade?</h2>
          <p className="text-lg mb-8 opacity-90">Start your Pro plan today and unlock unlimited interview practice</p>
          <Button className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
            Upgrade Now
          </Button>
        </div>
      </div>
    </div>
  );
}
