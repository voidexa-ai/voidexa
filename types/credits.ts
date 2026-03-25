// types/credits.ts
// Void Chat — Credit & Billing Type Definitions

export type SubscriptionStatus = 'none' | 'active' | 'cancelled' | 'past_due';

export type CreditTier = 'free' | 'ghai' | 'pro';

export interface UserCredits {
  id: string;
  user_id: string;
  free_messages_used_today: number;
  free_messages_reset_at: string;
  ghai_balance_platform: number;
  total_ghai_deposited: number;
  total_ghai_spent: number;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: SubscriptionStatus;
  subscription_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreditCheck {
  canSend: boolean;
  tier: CreditTier;
  reason?: string; // e.g. "Free tier exhausted", "Insufficient GHAI balance"
  freeRemaining?: number;
  ghaiBalance?: number;
  ghaiCost?: number;
}

export interface GhaiDeposit {
  id: string;
  user_id: string;
  amount: number;
  tx_signature: string;
  wallet_address: string;
  status: 'pending' | 'confirmed' | 'failed';
  confirmed_at: string | null;
  created_at: string;
}

export interface DepositRequest {
  txSignature: string;
  walletAddress: string;
  expectedAmount: number;
}

export interface BalanceResponse {
  platformBalance: number;     // GHAI credited on platform
  walletBalance: number | null; // on-chain GHAI in connected wallet (null if no wallet)
  freeMessagesRemaining: number;
  subscriptionStatus: SubscriptionStatus;
  tier: CreditTier;
}
