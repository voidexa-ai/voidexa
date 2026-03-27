// src/components/ghost-ai/DepositModal.tsx
// GHAI deposit flow: user sends GHAI to voidexa wallet, enters tx signature for verification

'use client';

import { useState } from 'react';
import { GHAI_TOKEN, VOIDEXA_RECEIVER_WALLET } from '@/config/constants';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (amount: number) => void;
}

export function DepositModal({ isOpen, onClose, onSuccess }: DepositModalProps) {
  const [amount, setAmount] = useState('');
  const [txSignature, setTxSignature] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  async function handleVerify() {
    if (!txSignature || !amount || !walletAddress) {
      setMessage('Please fill in all fields');
      setStatus('error');
      return;
    }

    setStatus('verifying');
    setMessage('Verifying on-chain transaction...');

    try {
      const res = await fetch('/api/ghai/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txSignature,
          walletAddress,
          expectedAmount: parseFloat(amount),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || `${data.amount} GHAI credited!`);
        onSuccess?.(data.amount);
      } else {
        setStatus('error');
        setMessage(data.reason || data.error || 'Verification failed');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Deposit GHAI</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">×</button>
        </div>

        <div className="space-y-4">
          {/* Instructions */}
          <div className="bg-gray-800 rounded-lg p-3 text-sm text-gray-300">
            <p className="mb-2">1. Send GHAI tokens to this wallet:</p>
            <code className="block bg-gray-950 p-2 rounded text-sm text-purple-400 break-all select-all">
              {VOIDEXA_RECEIVER_WALLET || 'Receiver wallet not configured'}
            </code>
            <p className="mt-2">2. Copy the transaction signature below.</p>
            <p>3. Click Verify to credit your account.</p>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Amount (GHAI)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 100"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Wallet address */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Your wallet address</label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Your Solana wallet address"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Transaction signature */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Transaction signature</label>
            <input
              type="text"
              value={txSignature}
              onChange={(e) => setTxSignature(e.target.value)}
              placeholder="Paste your Solana tx signature"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Status message */}
          {message && (
            <p className={`text-sm ${
              status === 'success' ? 'text-green-400' :
              status === 'error' ? 'text-red-400' :
              'text-gray-400'
            }`}>
              {message}
            </p>
          )}

          {/* Verify button */}
          <button
            onClick={handleVerify}
            disabled={status === 'verifying'}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 rounded-lg font-medium transition-colors"
          >
            {status === 'verifying' ? 'Verifying...' : 'Verify & Credit'}
          </button>
        </div>
      </div>
    </div>
  );
}
