// src/lib/ghai/balance.ts
// Ghost AI Chat — Read GHAI SPL token balance from on-chain wallet

import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { GHAI_TOKEN, SOLANA_RPC_URL } from '@/config/constants';

/**
 * Read the GHAI token balance of a Solana wallet address.
 * Returns the human-readable balance (divided by decimals).
 * Returns null if the wallet has no GHAI token account.
 */
export async function getWalletGhaiBalance(walletAddress: string): Promise<number | null> {
  try {
    const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
    const walletPubkey = new PublicKey(walletAddress);
    const ghaiMint = new PublicKey(GHAI_TOKEN.contractAddress);

    // Get the associated token account for GHAI
    const tokenAccountAddress = await getAssociatedTokenAddress(ghaiMint, walletPubkey);

    const tokenAccount = await getAccount(connection, tokenAccountAddress);
    const balance = Number(tokenAccount.amount) / Math.pow(10, GHAI_TOKEN.decimals);

    return balance;
  } catch {
    // Account doesn't exist or other error — wallet has no GHAI
    return null;
  }
}
