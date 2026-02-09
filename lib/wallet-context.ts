import { createContext } from "react";
import { Signer } from "ethers";
import { Network } from "@/lib/networks";

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed?: string;
  gasPrice?: string;
  blockNumber?: number;
  timestamp?: number;
  status?: "success" | "failed" | "pending";
  type?: "sent" | "received";
}

export interface WalletContextType {
  // Wallet State
  address: string | null;
  privateKey: string | null;
  mnemonic: string | null;
  isConnected: boolean;
  signer: Signer | null;

  // Network State
  currentNetwork: Network;
  availableNetworks: Network[];
  changeNetwork: (networkId: string) => void;

  // Balance State
  balance: string;
  balanceLoading: boolean;

  // Transaction State
  transactions: Transaction[];
  transactionsLoading: boolean;

  // Methods
  createWallet: (password: string) => Promise<void>;
  importWallet: (input: string, password: string) => Promise<void>;
  logout: () => void;
  refreshBalance: () => Promise<void>;
  refreshTransactions: () => Promise<void>;

  // Settings
  settings: {
    autoLock: boolean;
    lockTimeout: number;
    currencyDisplay: "USD" | "ETH";
    theme: "dark" | "light";
  };
  updateSettings: (settings: Partial<WalletContextType["settings"]>) => void;
}

export const WalletContext = createContext<WalletContextType | undefined>(
  undefined,
);
