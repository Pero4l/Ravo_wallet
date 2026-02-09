'use client'

import { useEffect, useState, useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { WalletHeader } from '@/components/wallet-header'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Send,
  TrendingUp,
  TrendingDown,
  Copy,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'
import { WalletContext } from '@/lib/wallet-context'

export default function DashboardPage() {
  const router = useRouter()
  const context = useContext(WalletContext)
  const [copied, setCopied] = useState(false)
  const [balanceUSD, setBalanceUSD] = useState('0')

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

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push('/')
    }
  }, [isConnected, router])

  // Mock ETH to USD conversion (replace with real API in production)
  useEffect(() => {
    const ethPrice = 2450
    setBalanceUSD((parseFloat(balance || '0') * ethPrice).toFixed(2))
  }, [balance])

  if (!isConnected || !address || !currentNetwork) {
    return null
  }

  const shortenedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`
  const recentTransactions = transactions?.slice(0, 5) ?? []

  const handleCopy = () => {
    if (address) {
      try {
        navigator.clipboard.writeText(address)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy address:', err)
      }
    }
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
          <Select
            value={currentNetwork.id}
            onValueChange={(id) => changeNetwork(id)}
          >
            <SelectTrigger className="bg-card border-border text-foreground">
              <SelectValue placeholder="Select Network" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-foreground">
              {availableNetworks?.map((net) => (
                <SelectItem key={net.id} value={net.id}>
                  {net.icon || null} {net.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
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
          </Button>
        </div>

        {/* Balance Display */}
        <Card className="bg-gradient-to-br from-card to-card/50 border-border p-8">
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
              {/* <p className="text-muted-foreground text-sm mt-2">
                ≈ ${balanceUSD}
              </p> */}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Link href="/send">
                <Button className="w-full bg-primary hover:bg-blue-600 text-primary-foreground">
                  <Send size={16} className="mr-2" />
                  Send
                </Button>
              </Link>
              <Link href="/receive">
                <Button
                  variant="outline"
                  className="w-full border-border text-foreground hover:bg-card bg-transparent"
                >
                  Receive
                </Button>
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
        </Card>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
            <Link href="/transactions">
              <Button variant="ghost" size="sm" className="text-accent">
                View All
              </Button>
            </Link>
          </div>

          {transactionsLoading ? (
            <Card className="bg-card border-border p-4">
              <p className="text-muted-foreground text-center py-8">
                Loading transactions...
              </p>
            </Card>
          ) : recentTransactions.length === 0 ? (
            <Card className="bg-card border-border p-4">
              <p className="text-muted-foreground text-center py-8">
                No transactions yet
              </p>
            </Card>
          ) : (
            <div className="space-y-2">
              {recentTransactions.map((tx) => (
                <Link key={tx.hash} href={`/transactions/${tx.hash}`}>
                  <Card className="bg-card border-border p-4 hover:border-primary transition cursor-pointer">
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
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
