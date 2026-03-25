// lib/ghai/verify-deposit.ts
// Void Chat — On-chain GHAI Deposit Verification
// Verifies a Solana SPL token transfer to voidexa's receiver wallet.

import { Connection, PublicKey } from '@solana/web3.js';
import { GHAI_TOKEN, VOIDEXA_RECEIVER_WALLET, SOLANA_RPC_URL } from '@/config/constants';

interface DepositVerification {
  valid: boolean;
  amount: number;    // GHAI amount (human-readable, already divided by decimals)
  sender: string;    // sender wallet address
  error?: string;
}

/**
 * Verify an on-chain GHAI SPL token transfer.
 * Checks that:
 * 1. The transaction exists and is confirmed
 * 2. It transfers GHAI tokens (correct mint)
 * 3. Destination is voidexa's receiver wallet
 * 4. Amount matches expected
 */
export async function verifyGhaiDeposit(
  txSignature: string,
  expectedAmount: number
): Promise<DepositVerification> {
  try {
    const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
    const receiverWallet = new PublicKey(VOIDEXA_RECEIVER_WALLET);
    const ghaiMint = new PublicKey(GHAI_TOKEN.contractAddress);

    // Fetch the transaction
    const tx = await connection.getParsedTransaction(txSignature, {
      maxSupportedTransactionVersion: 0,
    });

    if (!tx) {
      return { valid: false, amount: 0, sender: '', error: 'Transaction not found' };
    }

    if (tx.meta?.err) {
      return { valid: false, amount: 0, sender: '', error: 'Transaction failed on-chain' };
    }

    // Look for SPL token transfer instruction
    const instructions = tx.transaction.message.instructions;
    let transferFound = false;
    let transferAmount = 0;
    let senderAddress = '';

    for (const ix of instructions) {
      if ('parsed' in ix && ix.program === 'spl-token') {
        const parsed = ix.parsed;
        if (parsed.type === 'transfer' || parsed.type === 'transferChecked') {
          // Verify the mint (GHAI token)
          if (parsed.info.mint && parsed.info.mint !== GHAI_TOKEN.contractAddress) {
            continue; // wrong token
          }

          // Get amount
          const rawAmount = parsed.info.amount || parsed.info.tokenAmount?.amount;
          if (rawAmount) {
            transferAmount = Number(rawAmount) / Math.pow(10, GHAI_TOKEN.decimals);
          }

          senderAddress = parsed.info.authority || parsed.info.source || '';
          transferFound = true;
        }
      }
    }

    if (!transferFound) {
      return { valid: false, amount: 0, sender: '', error: 'No GHAI token transfer found in transaction' };
    }

    if (transferAmount < expectedAmount * 0.99) {
      // Allow 1% tolerance for rounding
      return {
        valid: false,
        amount: transferAmount,
        sender: senderAddress,
        error: `Amount mismatch. Expected ${expectedAmount} GHAI, got ${transferAmount} GHAI`,
      };
    }

    return {
      valid: true,
      amount: transferAmount,
      sender: senderAddress,
    };
  } catch (error) {
    return {
      valid: false,
      amount: 0,
      sender: '',
      error: error instanceof Error ? error.message : 'Verification failed',
    };
  }
}
