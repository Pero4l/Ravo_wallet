"use client";

import React, { useState, useEffect, useCallback } from "react";
import { WalletContext, WalletContextType } from "./wallet-context";
import { ethers } from "ethers";
import { Network, NETWORKS, DEFAULT_NETWORK } from "@/lib/networks";

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
      const provider = new ethers.JsonRpcProvider(currentNetwork.rpcUrl);
      const balanceWei = await provider.getBalance(address);
      const balanceEth = ethers.formatEther(balanceWei);
      setBalance(balanceEth);
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
      // Placeholder: In production, fetch from Etherscan API or similar
      // For now, just set empty transactions
      setTransactions([]);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setTransactionsLoading(false);
    }
  }, [address]);

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

  const value: WalletContextType = {
    address,
    privateKey,
    mnemonic,
    isConnected,
    signer: null,

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
