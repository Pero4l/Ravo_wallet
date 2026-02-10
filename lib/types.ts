// lib/types.ts
export interface WalletTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  status: "success" | "pending" | "failed";
  type: "sent" | "received";
  timestamp?: number;
  gasPrice?: string;
  gasUsed?: string;
  blockNumber?: number;
  blockNum?: string; 
  metadata?: {
    blockTimestamp?: string;
  };
}
