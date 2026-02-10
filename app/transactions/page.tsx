'use client'

import { useContext } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react'
import { WalletContext } from '@/lib/wallet-context'

function formatAddress(address?: string) {
  if (!address) return '—'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function formatDate(timestamp?: number) {
  if (!timestamp) return '—'
  return new Date(timestamp * 1000).toLocaleString()
}

export default function TransactionsPage() {
  const context = useContext(WalletContext)

  if (!context) {
    return <div className="p-8 text-center">Loading...</div>
  }

  const {
    transactions,
    transactionsLoading,
    currentNetwork,
  } = context

  console.log("Transactions:", transactions) // Debugging log   
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[#161b22] border-b border-gray-500 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <button className="hover:bg-input text-foreground">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Transaction History</h1>
            <p className="text-muted-foreground text-sm">
              {transactions.length} transactions
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {transactionsLoading ? (
          <div className="bg-[#161b22] border border-gray-500 p-8 text-center text-muted-foreground">
            Loading transactions...
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-[#161b22] border border-gray-500 p-8 text-center text-muted-foreground">
            No transactions found
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <Link key={tx.hash} href={`/transactions/${tx.hash}`}>
                <div className="bg-[#161b22] border border-gray-500 rounded-lg p-4 hover:border-primary transition cursor-pointer">
                  <div className="flex items-center justify-between">
                    {/* Left */}
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          tx.type === 'received'
                            ? ' bg-blue-500/20 text-blue-500'
                            : 'bg-green-500/20 text-green-500'
                        }`}
                      >
                        {tx.type === 'received' ? (
                          <TrendingDown className='text-green-500' size={20} />
                        ) : (
                          <TrendingUp className='text-blue-500' size={20} />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {tx.type === 'received' ? 'Received' : 'Sent'}
                          </p>
                          {tx.status === 'success' && (
                            <CheckCircle2 size={14} className="text-green-500" />
                          )}
                          {tx.status === 'failed' && (
                            <XCircle size={14} className="text-red-500" />
                          )}
                          {tx.status === 'pending' && (
                            <Clock size={14} className="text-yellow-500 animate-spin" />
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {tx.type === 'received'
                            ? formatAddress(tx.from)
                            : formatAddress(tx.to)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(tx.timestamp)}
                        </p>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="text-right">
                      <p className="font-semibold">
                        {tx.type === 'received' ? '+' : '-'}
                        {parseFloat(tx.value).toFixed(4)}{' '}
                        {currentNetwork.currency}
                      </p>
                      <ExternalLink size={14} className="text-muted-foreground mt-1 ml-auto" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
