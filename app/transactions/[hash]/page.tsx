"use client";

import { useContext, useMemo } from "react";
import Link from "next/link";
import React from "react";

import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
  ExternalLink,
} from "lucide-react";
import { WalletContext } from "@/lib/wallet-context";

export default function TransactionDetailPage({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const context = useContext(WalletContext);
  const { hash } = React.use(params);

  // Find the transaction
  const transaction = useMemo(() => {
    return context && context.transactions
      ? context.transactions.find(
          (tx) => tx.hash.toLowerCase() === hash.toLowerCase(),
        )
      : null;
  }, [context, hash]);

  if (!context) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const { currentNetwork } = context;

  if (!context || !transaction) {
    return (
      <main className="min-h-screen bg-background">
        <header className="bg-card border-b border-border sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link href="/transactions">
              <button className="hover:bg-input text-foreground">
                <ArrowLeft size={20} />
              </button>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">
              Transaction Not Found
            </h1>
          </div>
        </header>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-card border-border p-8 text-center">
            <p className="text-muted-foreground">
              This transaction could not be found.
            </p>
            <Link href="/transactions" className="mt-4 inline-block">
              <button className="bg-primary hover:bg-blue-600">
                Back to Transactions
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const statusColor = {
    success: "text-green-600",
    failed: "text-red-600",
    pending: "text-yellow-600",
  };

  const statusBg = {
    success: "bg-green-600/10",
    failed: "bg-red-600/10",
    pending: "bg-yellow-600/10",
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/transactions">
            <button className="hover:bg-input text-foreground">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Transaction Details
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Status Card */}
        <div
          className={`border-border p-8 text-center space-y-4 ${statusBg[transaction.status || "pending"]}`}
        >
          <div className="flex justify-center">
            {transaction.status === "success" && (
              <CheckCircle2 size={48} className={statusColor.success} />
            )}
            {transaction.status === "failed" && (
              <XCircle size={48} className={statusColor.failed} />
            )}
            {transaction.status === "pending" && (
              <Clock
                size={48}
                className={`${statusColor.pending} animate-spin`}
              />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {transaction.status === "success" && "Transaction Confirmed"}
              {transaction.status === "failed" && "Transaction Failed"}
              {transaction.status === "pending" && "Transaction Pending"}
            </h2>
            <p className="text-muted-foreground">
              {transaction.type === "received" ? "You received" : "You sent"}{" "}
              <span className="font-semibold text-foreground">
                {parseFloat(transaction.value).toFixed(4)}{" "}
                {currentNetwork.currency}
              </span>
            </p>
          </div>
        </div>

        {/* Amount Details */}
        <div className="bg-card border-border p-6 space-y-4">
          <h3 className="font-semibold text-foreground mb-4">Amount</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold text-foreground">
                {parseFloat(transaction.value).toFixed(4)}{" "}
                {currentNetwork.currency}
              </span>
            </div>
            {transaction.gasPrice && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Gas Price</span>
                <span className="font-mono text-sm text-foreground">
                  {transaction.gasPrice} Gwei
                </span>
              </div>
            )}
            {transaction.gasUsed && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Gas Used</span>
                <span className="font-mono text-sm text-foreground">
                  {transaction.gasUsed}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Transaction Info */}
        <div className="bg-card border-border p-6 space-y-4">
          <h3 className="font-semibold text-foreground mb-4">
            Transaction Info
          </h3>
          <div className="space-y-4">
            {/* From */}
            <div>
              <p className="text-muted-foreground text-sm mb-2">From</p>
              <div className="flex items-center justify-between bg-input rounded-lg p-3">
                <span className="font-mono text-sm break-all pr-2">
                  {transaction.from}
                </span>
                <Copy
                  size={16}
                  className="text-muted-foreground cursor-pointer hover:text-foreground shrink-0"
                  onClick={() => {
                    navigator.clipboard.writeText(transaction.from);
                  }}
                />
              </div>
            </div>

            {/* To */}
            <div>
              <p className="text-muted-foreground text-sm mb-2">To</p>
              <div className="flex items-center justify-between bg-input rounded-lg p-3">
                <span className="font-mono text-sm break-all pr-2">
                  {transaction.to}
                </span>
                <Copy
                  size={16}
                  className="text-muted-foreground cursor-pointer hover:text-foreground shrink-0"
                  onClick={() => {
                    navigator.clipboard.writeText(transaction.to);
                  }}
                />
              </div>
            </div>

            {/* Hash */}
            <div>
              <p className="text-muted-foreground text-sm mb-2">
                Transaction Hash
              </p>
              <div className="flex items-center justify-between bg-input rounded-lg p-3">
                <span className="font-mono text-sm break-all pr-2">
                  {transaction.hash}
                </span>
                <Copy
                  size={16}
                  className="text-muted-foreground cursor-pointer hover:text-foreground shrink-0"
                  onClick={() => {
                    navigator.clipboard.writeText(transaction.hash);
                  }}
                />
              </div>
            </div>

            {/* Block Number */}
            {transaction.blockNumber && (
              <div>
                <p className="text-muted-foreground text-sm mb-2">
                  Block Number
                </p>
                <p className="font-mono text-foreground">
                  {transaction.blockNumber}
                </p>
              </div>
            )}

            {/* Timestamp */}
            <div>
              <p className="text-muted-foreground text-sm mb-2">Time</p>
              <p className="text-foreground">
                {formatDate(transaction.timestamp)}
              </p>
            </div>
          </div>
        </div>

        {/* View on Explorer */}
        <Link
          href={`${currentNetwork.explorerUrl}/tx/${transaction.hash}`}
          target="_blank"
          className="block"
        >
          <button className="w-full bg-primary hover:bg-blue-600 text-primary-foreground flex items-center justify-center gap-2">
            View on {currentNetwork.name} Explorer
            <ExternalLink size={16} />
          </button>
        </Link>

        {/* Back Button */}
        <Link href="/transactions" className="block">
          <button className="w-full border-border ">
            Back to Transactions
          </button>
        </Link>

        <Link href="/dashboard" className="block">
          <button className="w-full border-border ">
            Back to Dashboard
          </button>
        </Link>
      </div>
    </main>
  );
}
