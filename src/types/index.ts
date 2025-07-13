export interface ChatTier {
  key: string;
  label: string;
  limit: number;
  password: string | null;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp?: number;
}

export interface ChatCounts {
  [key: string]: number;
}

export interface ChatHistory {
  [key: string]: ChatMessage[];
}

export interface AppState {
  currentTier: string;
  email: string | null;
  counts: ChatCounts;
  history: ChatHistory;
  isPasswordModalOpen: boolean;
  isBuyModalOpen: boolean;
  isStripeModalOpen: boolean;
  passwordError: string;
}