// types/providers.ts
// Void Chat — Provider Type Definitions

export interface ProviderResponse {
  content: string;
  tokensInput: number;
  tokensOutput: number;
  model: string;
  finishReason: string;
}

export interface ProviderStreamCallbacks {
  onToken: (token: string) => void;
  onDone: (response: ProviderResponse) => void;
  onError: (error: Error) => void;
}

export interface ProviderMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ProviderCallOptions {
  model: string;         // API model string (e.g. 'claude-sonnet-4-20250514')
  messages: ProviderMessage[];
  maxTokens?: number;
  stream: boolean;
}
