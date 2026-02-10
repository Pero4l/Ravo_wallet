'use client'

import React from 'react'
import { Dot } from 'lucide-react'

interface WalletHeaderProps {
  walletAddress: string
  network: string
  onNetworkChange: (networkId: string) => void
}

export function WalletHeader({
  walletAddress,
  network,
}: WalletHeaderProps) {
  const shortenedAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`

  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* App / Wallet Name */}
        <div>
          <h1 className="text-3xl text-blue-500 font-bold ">Ravo</h1>
          {/* <p className="text-xs text-muted-foreground">
            Secure Web3 Wallet
          </p> */}
        </div>

        {/* Wallet Info */}
        <div className="flex items-center gap-4">
          {/* Network Badge */}
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-input text-sm">
            {/* <span>{network}</span> */}
            
          </div>

          {/* Address */}
          <div className="px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-sm flex items-center gap-1">
          <Dot className='text-green-500' size={30} />
            {shortenedAddress}
          </div>
        </div>
      </div>
    </header>
  )
}
