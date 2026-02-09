'use client'

import React, { useState } from 'react'
import { WalletContext, WalletContextType } from './wallet-context'
import { ethers } from 'ethers'
import { Network } from '@/lib/networks'

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [privateKey, setPrivateKey] = useState<string | null>(null)
  const [mnemonic, setMnemonic] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const importWallet: WalletContextType['importWallet'] = async (input, password) => {
    // example: mnemonic import
    const wallet = ethers.Wallet.fromPhrase(input.trim())
    setAddress(wallet.address)
    setPrivateKey(wallet.privateKey)
    setMnemonic(input)
    setIsConnected(true)
  }

  const value: WalletContextType = {
    address,
    privateKey,
    mnemonic,
    isConnected,
    signer: null,

    currentNetwork: {} as Network,
    availableNetworks: [],
    changeNetwork: () => {},

    balance: '0',
    balanceLoading: false,

    transactions: [],
    transactionsLoading: false,

    createWallet: async () => {},
    importWallet,
    logout: () => {},
    refreshBalance: async () => {},
    refreshTransactions: async () => {},

    settings: {
      autoLock: false,
      lockTimeout: 0,
      currencyDisplay: 'ETH',
      theme: 'dark',
    },
    updateSettings: () => {},
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}