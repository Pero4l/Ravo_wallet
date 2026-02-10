"use client";

import React, { useState, useEffect, useCallback } from "react";
import { WalletContext, WalletContextType } from "./wallet-context";
import { ethers } from "ethers";
import { Network, NETWORKS, DEFAULT_NETWORK } from "@/lib/networks";
import type { WalletTransaction } from "@/lib/types";

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [tempMnemonic, setTempMnemonic] = useState<string | null>(null);
  const [currentNetwork, setCurrentNetwork] =
    useState<Network>(DEFAULT_NETWORK);
  const [availableNetworks] = useState<Network[]>(Object.values(NETWORKS));
  const [balance, setBalance] = useState<string>("0");
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [transactions, setTransactions] = useState<
    WalletContextType["transactions"]
  >([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  const initializeWalletCreation = async (): Promise<string> => {
    try {
      const wallet = ethers.Wallet.createRandom();
      const generatedMnemonic = wallet.mnemonic?.phrase;
      if (!generatedMnemonic) {
        throw new Error("Failed to generate mnemonic");
      }
      setTempMnemonic(generatedMnemonic);
      return generatedMnemonic;
    } catch (error) {
      console.error("Error generating wallet:", error);
      throw error;
    }
  };

  const createWallet: WalletContextType["createWallet"] = async (
    _password: string,
  ) => {
    if (!tempMnemonic) {
      throw new Error(
        "No mnemonic available. Call initializeWalletCreation first.",
      );
    }
    try {
      const wallet = ethers.Wallet.fromPhrase(tempMnemonic.trim());
      setAddress(wallet.address);
      setPrivateKey(wallet.privateKey);
      setMnemonic(tempMnemonic);
      setIsConnected(true);
      setTempMnemonic(null); // Clear temp mnemonic after wallet creation
    } catch (error) {
      console.error("Error creating wallet:", error);
      throw error;
    }
  };

  const importWallet: WalletContextType["importWallet"] = async (
    input,
    _password,
  ) => {
    try {
      const trimmedInput = input.trim();

      // Check if input is a private key (starts with 0x) or recovery phrase
      if (trimmedInput.startsWith("0x")) {
        // Private key import
        const wallet = new ethers.Wallet(trimmedInput);
        setAddress(wallet.address);
        setPrivateKey(wallet.privateKey);
        setMnemonic(null); // No mnemonic for private key imports
        setIsConnected(true);
      } else {
        // Recovery phrase import
        const hdWallet = ethers.Wallet.fromPhrase(trimmedInput);
        setAddress(hdWallet.address);
        setPrivateKey(hdWallet.privateKey);
        setMnemonic(trimmedInput);
        setIsConnected(true);
      }
    } catch (error) {
      console.error("Error importing wallet:", error);
      throw error;
    }
  };

  const changeNetwork = (networkId: string) => {
    const network = NETWORKS[networkId as keyof typeof NETWORKS];
    if (network) {
      setCurrentNetwork(network);
    }
  };
const refreshBalance = useCallback(async () => {
  if (!address) return;

  try {
    setBalanceLoading(true);

    const res = await fetch("/api/balance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address,
        rpcUrl: currentNetwork.rpcUrl,
      }),
    });

    const data = await res.json();
    setBalance(data.balance);
  } catch (error) {
    console.error("Error fetching balance:", error);
  } finally {
    setBalanceLoading(false);
  }
}, [address, currentNetwork]);


  const refreshTransactions = useCallback(async () => {
  if (!address) return;

  try {
    setTransactionsLoading(true);

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address,
        rpcUrl: currentNetwork.rpcUrl,
      }),
    });

    const data = await res.json();
    const transfers = data.result?.transfers || [];

    const formatted: WalletContextType["transactions"] = transfers.map(
      (tx: WalletTransaction) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value || "0",
        gasUsed: undefined,
        gasPrice: undefined,
       blockNumber: tx.blockNum ? parseInt(tx.blockNum, 16) : null,
        timestamp: tx.metadata?.blockTimestamp
          ? Math.floor(new Date(tx.metadata.blockTimestamp).getTime() / 1000)
          : undefined,
        status: "success",
        type:
          tx.from?.toLowerCase() === address.toLowerCase()
            ? "sent"
            : "received",
      }),
    );

    setTransactions(formatted);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    setTransactions([]);
  } finally {
    setTransactionsLoading(false);
  }
}, [address, currentNetwork]);


  // Auto-refresh balance every 30 seconds when wallet is connected
  useEffect(() => {
    if (!isConnected || !address) return;

    refreshBalance();
    const interval = setInterval(refreshBalance, 30000);
    return () => clearInterval(interval);
  }, [isConnected, address, currentNetwork, refreshBalance]);

  // Refresh transactions when network changes
  useEffect(() => {
    if (isConnected && address) {
      refreshTransactions();
    }
  }, [isConnected, address, currentNetwork, refreshTransactions]);

  // Create signer when privateKey or network changes
  useEffect(() => {
    if (privateKey && isConnected) {
      try {
        const provider = new ethers.JsonRpcProvider(currentNetwork.rpcUrl);
        const newSigner = new ethers.Wallet(privateKey, provider);
        setSigner(newSigner);
      } catch (error) {
        console.error("Error creating signer:", error);
        setSigner(null);
      }
    } else {
      setSigner(null);
    }
  }, [privateKey, isConnected, currentNetwork]);

  const value: WalletContextType = {
    address,
    privateKey,
    mnemonic,
    isConnected,
    signer,

    currentNetwork,
    availableNetworks,
    changeNetwork,

    balance,
    balanceLoading,

    transactions,
    transactionsLoading,

    createWallet,
    importWallet,
    initializeWalletCreation,
    logout: () => {},
    refreshBalance,
    refreshTransactions,

    settings: {
      autoLock: false,
      lockTimeout: 0,
      currencyDisplay: "ETH",
      theme: "dark",
    },
    updateSettings: () => {},
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
