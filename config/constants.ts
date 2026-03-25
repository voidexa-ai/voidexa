// config/constants.ts
// Void Chat — Platform Constants

// GHAI Token
export const GHAI_TOKEN = {
  contractAddress: 'Ch8Ek9PTbzSGdL4EWHC2pQfPq2vTseiCPjeZsAZLx5gK',
  chain: 'solana',
  symbol: 'GHAI',
  decimals: 6,
  totalSupply: 1_000_000_000,
} as const;

// voidexa receiver wallet for GHAI deposits
// Users send GHAI here, platform credits their balance
export const VOIDEXA_RECEIVER_WALLET = process.env.GHAI_RECEIVER_WALLET || '';

// Solana RPC
export const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

// Platform
export const PLATFORM = {
  name: 'Void Chat',
  tagline: 'Multi-AI Chat powered by voidexa',
  transparencyLine: 'Powered by {provider} — orchestrated by voidexa',
  supportEmail: 'contact@voidexa.com',
  maxConversationsPerUser: 100,
  maxMessagesPerConversation: 500,
  messageMaxLength: 10000, // characters
} as const;

// Admin
export const ADMIN_EMAILS = ['ceo@voidexa.com'] as const;
