'use client'

import { useEffect, useState, useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Send,
  TrendingUp,
  TrendingDown,
  Copy,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'
import { WalletContext } from '@/lib/wallet-context'
import { WalletHeader } from '@/app/components/wallet-header'

export default function DashboardPage() {
  const router = useRouter()
  const context = useContext(WalletContext)

  const [copied, setCopied] = useState(false)

  // ✅ ALWAYS call hooks first
  useEffect(() => {
    if (!context?.isConnected) {
      router.push('/')
    }
  }, [context?.isConnected, router])

  // ✅ AFTER hooks, it's safe to return early
  if (!context) {
    return <div>Loading...</div>
  }

  const {
    address,
    isConnected,
    currentNetwork,
    balance,
    balanceLoading,
    transactions,
    transactionsLoading,
    changeNetwork,
    refreshBalance,
    refreshTransactions,
    availableNetworks,
  } = context

  if (!isConnected || !address || !currentNetwork) {
    return null
  }

  const shortenedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`
  const recentTransactions = transactions?.slice(0, 5) ?? []

  const handleCopy = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-background">
      <WalletHeader
        walletAddress={address}
        network={currentNetwork.name}
        onNetworkChange={changeNetwork}
      />

      {/* Balance Card */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Network Selector */}
        <div className="flex gap-2">
          <select
          className="border-border text-white px-3 py-1 rounded-lg text-sm"
            value={currentNetwork.id}
            onChange={(e) => changeNetwork(e.target.value)}
          >
            <option value="" disabled>Select Network</option>
            {availableNetworks?.map((net) => (
              <option key={net.id} value={net.id}>
                {net.icon || null} {net.name}
                </option>
              ))}
            </select>
          <button
            
         
            onClick={() => {
              refreshBalance()
              refreshTransactions()
            }}
            disabled={balanceLoading || transactionsLoading}
            className="border-border"
          >
            <RefreshCw
              size={16}
              className={balanceLoading ? 'animate-spin' : ''}
            />
          </button>
        </div>

        {/* Balance Display */}
        <div className="bg-gradient-to-br from-card to-card/50 border-border p-8">
          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground text-sm mb-2">Total Balance</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">
                  {balanceLoading ? '...' : parseFloat(balance || '0').toFixed(4)}
                </span>
                <span className="text-2xl text-muted-foreground">
                  {currentNetwork.currency || 'ETH'}
                </span>
              </div>
              <p className="text-muted-foreground text-sm mt-2">
                ≈ ${(parseFloat(context.balance || '0') * 2450).toFixed(2)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Link href="/send">
                <button className="w-full bg-primary hover:bg-blue-600 text-primary-foreground">
                  <Send size={16} className="mr-2" />
                  Send
                </button>
              </Link>
              <Link href="/receive">
                <button
                  
                  className="w-full border-border text-foreground hover:bg-card bg-transparent"
                >
                  Receive
                </button>
              </Link>
            </div>

            {/* Address Info */}
            <div className="border-t border-border pt-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <p className="text-muted-foreground mb-1">Wallet Address</p>
                  <p className="font-mono text-sm">{shortenedAddress}</p>
                </div>
                <button
                  onClick={handleCopy}
                  className="p-2 hover:bg-card rounded-lg transition"
                  title="Copy address"
                >
                  <Copy size={18} className="text-accent" />
                </button>
              </div>
              {copied && (
                <p className="text-xs text-accent mt-2">Copied!</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
            <Link href="/transactions">
              <button className="text-accent hover:text-accent/80">
                View All
              </button>
            </Link>
          </div>

          {transactionsLoading ? (
            <div className="bg-card border-border p-4">
              <p className="text-muted-foreground text-center py-8">
                Loading transactions...
              </p>
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="bg-card border-border p-4">
              <p className="text-muted-foreground text-center py-8">
                No transactions yet
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTransactions.map((tx) => (
                <Link key={tx.hash} href={`/transactions/${tx.hash}`}>
                  <div className="bg-card border-border p-4 hover:border-primary transition cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            tx.type === 'received'
                              ? 'bg-success/10 text-success'
                              : 'bg-primary/10 text-primary'
                          }`}
                        >
                          {tx.type === 'received' ? (
                            <TrendingDown size={20} />
                          ) : (
                            <TrendingUp size={20} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {tx.type === 'received' ? 'Received' : 'Sent'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {tx.status === 'success' && 'Completed'}
                            {tx.status === 'failed' && 'Failed'}
                            {tx.status === 'pending' && 'Pending'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {tx.type === 'received' ? '+' : '-'}
                          {parseFloat(tx.value || '0').toFixed(4)}{' '}
                          {currentNetwork.currency || 'ETH'}
                        </p>
                        <ExternalLink
                          size={14}
                          className="text-muted-foreground mt-1 ml-auto"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
