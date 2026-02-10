"use client";

import { useState, useContext } from "react";
import Link from "next/link";

import { ArrowLeft, Copy } from "lucide-react";
import { WalletContext } from "@/lib/wallet-context";

export default function ReceivePage() {
  const [copied, setCopied] = useState(false);
  const context = useContext(WalletContext);

  const { address } = context || {};

  const handleCopy = () => {
    navigator.clipboard.writeText(address || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <button
             
              className="hover:bg-input text-foreground"
            >
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Receive</h1>
            <p className="text-muted-foreground text-sm">
              Share your wallet address
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#161b22] border border-gray-500 rounded-lg p-8 shadow-lg">
          {/* QR Code Placeholder */}
          <div className="mb-8">
            <div className="bg-background border-2 border-dashed border-gray-500 rounded-lg p-8 flex items-center justify-center aspect-square">
              <div className="text-center">
                <div className="text-5xl mb-2">█ █ █</div>
                <div className="text-5xl mb-2">█ █ █</div>
                <div className="text-5xl mb-2">█ █ █</div>
                <p className="text-xs text-muted-foreground mt-4">
                  QR Code Placeholder
                </p>
                <p className="text-xs text-muted-foreground">
                  Soon, a QR code would be generated here
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Others can scan this QR code to send you funds
            </p>
          </div>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-500" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-[#161b22] text-muted-foreground">or</span>
            </div>
          </div>

          {/* Address Display */}
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Your Address
            </label>
            <div className="bg-[#161b22] border border-gray-500 rounded-lg p-4 font-mono text-sm text-foreground break-all">
              {address}
            </div>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-6 bg-blue-500 hover:bg-blue-700 text-primary-foreground rounded-lg font-medium transition"
          >
            <Copy size={18} />
            <span>{copied ? "Address Copied!" : "Copy Address"}</span>
          </button>

          {/* Network Warning */}
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-xs  leading-relaxed">
              <strong>Network:</strong> Make sure the sender is using the
              Ethereum Mainnet. Tokens sent from other networks may be lost.
            </p>
          </div>

          {/* Footer Link */}
          <Link href="/dashboard" className="block mt-8">
            <button
              
              className="w-full border-border text-foreground hover:bg-input bg-transparent"
            >
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
