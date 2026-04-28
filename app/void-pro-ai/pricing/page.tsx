// app/void-chat/pricing/page.tsx
// Void Chat — Pricing page

'use client';

import { STRIPE_PRO, USD_COSTS } from '@/config/pricing';
import { MODELS } from '@/config/providers';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Void Pro AI Pricing</h1>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Access the world&apos;s best AI models. Subscribe for unlimited access,
          or pay per message with USD.
        </p>

        {/* Pricing tiers */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Stripe Pro */}
          <div className="bg-gray-900 border-2 border-purple-500 rounded-2xl p-8 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-sm px-3 py-1 rounded-full">
              Recommended
            </span>
            <h3 className="text-xl font-semibold mb-2">Pro</h3>
            <p className="text-3xl font-bold mb-1">${STRIPE_PRO.pricePerMonth / 100}</p>
            <p className="text-gray-500 mb-6">per month</p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✓ Unlimited standard models</li>
              <li>✓ Pay with credit card</li>
              <li>✓ No wallet needed</li>
              <li>✓ Access all providers</li>
            </ul>
            <button className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
              Subscribe
            </button>
          </div>

          {/* Token payments coming soon */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-sm px-3 py-1 rounded-full"
              style={{ background: 'rgba(136,136,136,0.2)', color: '#888', border: '1px solid rgba(136,136,136,0.25)' }}>
              Coming Soon
            </span>
            <h3 className="text-xl font-semibold mb-2">GHAI Token Payments</h3>
            <p className="text-3xl font-bold mb-1" style={{ color: '#888' }}>TBA</p>
            <p className="text-gray-500 mb-6">per message</p>
            <ul className="space-y-3 text-gray-500 mb-8">
              <li>GHAI integration coming soon — subject to regulatory approval</li>
              <li>All models including premium</li>
              <li>No subscription required</li>
              <li>Join the waitlist to be first</li>
            </ul>
            <a href="/ghost-ai" className="block w-full py-3 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors text-center">
              Join Waitlist
            </a>
          </div>
        </div>

        {/* Per-model pricing table */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Per-Model Pricing</h2>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-sm">
                  <th className="text-left p-4">Model</th>
                  <th className="text-left p-4">Provider</th>
                  <th className="text-right p-4">USD / message</th>
                  <th className="text-right p-4">Tier</th>
                </tr>
              </thead>
              <tbody>
                {MODELS.map((model) => (
                  <tr key={model.id} className="border-b border-gray-800/50">
                    <td className="p-4 font-medium">{model.displayName}</td>
                    <td className="p-4 text-gray-400">{model.provider}</td>
                    <td className="p-4 text-right">{USD_COSTS[model.id] ?? '$0.01'}</td>
                    <td className="p-4 text-right">
                      {model.isPremium ? (
                        <span className="text-yellow-400 text-sm">Premium</span>
                      ) : (
                        <span className="text-green-400 text-sm">Standard</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transparency notice */}
        <p className="text-center text-gray-500 text-sm mt-12">
          Powered by Claude, ChatGPT, and Gemini — orchestrated by voidexa.
          <br />
          Token payments coming soon. Not financial advice. Not an investment.
        </p>
      </div>
    </div>
  );
}
