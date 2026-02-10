"use client";

import { useState, useContext } from "react";
import Link from "next/link";
import Router from "next/router";

import { ArrowLeft, ChevronDown, AlertCircle } from "lucide-react";
import { WalletContext } from "@/lib/wallet-context";
import { ethers } from "ethers";

export default function SendPage() {
  const context = useContext(WalletContext);

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [gasPrice, setGasPrice] = useState<"slow" | "standard" | "fast">(
    "standard",
  );
  const [errors, setErrors] = useState<{ recipient?: string; amount?: string }>(
    {},
  );
  const [sending, setSending] = useState(false);

  const router = Router;

  if (!context) {
    return null;
  }

  const { balance, signer, refreshBalance, refreshTransactions } = context;

  const gasMap = {
    slow: "10",
    standard: "20",
    fast: "30",
  };

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!recipient) {
      newErrors.recipient = "Recipient address is required";
    } else if (!ethers.isAddress(recipient)) {
      newErrors.recipient = "Invalid Ethereum address";
    }

    if (!amount) {
      newErrors.amount = "Amount is required";
    } else if (parseFloat(amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    } else if (parseFloat(amount) > parseFloat(balance)) {
      newErrors.amount = "Insufficient balance";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = async () => {
    if (!validate() || !signer) {
      alert("Wallet not ready. Please ensure you are connected.");
      return;
    }

    try {
      setSending(true);

      // Get provider from signer
      const provider = signer.provider;
      if (!provider) {
        throw new Error("Provider not available");
      }

      // Get fee data from network (EIP-1559)
      const feeData = await provider.getFeeData();

      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount),

        // ✅ EIP-1559 (this is the key fix)
        maxFeePerGas: feeData.maxFeePerGas!,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas!,
      });

      await tx.wait();

      await refreshBalance();
      await refreshTransactions();

      setRecipient("");
      setAmount("");
      alert("Transaction sent successfully!");

    
    } catch (err) {
      console.error("Transaction failed:", err);
      alert("Transaction failed. Check console for details.");
    } finally {
      setSending(false);
      
        setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }
  };

  const isValid =
    recipient.length > 0 &&
    amount.length > 0 &&
    Object.keys(errors).length === 0;

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <button className="hover:bg-input">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Send</h1>
            <p className="text-muted-foreground text-sm">
              Send crypto to another wallet
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#161b22] border border-gray-500 rounded-lg p-8 shadow-lg">
          {/* Recipient */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">
              Recipient Address
            </label>
            <input
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className={`bg-input border border-gray-500 w-full p-2 px-3 rounded-lg ${errors.recipient ? "border-destructive" : ""}`}
            />
            {errors.recipient && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.recipient}
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">
              Amount (ETH)
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.001"
              className={`bg-input border border-gray-500 w-full p-2 px-3 rounded-lg ${errors.amount ? "border-destructive" : ""}`}
            />
            {errors.amount && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.amount}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Balance: <span>{balance} ETH</span>
            </p>
          </div>

          {/* Advanced */}
          <div className="mb-6">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between text-sm font-medium text-blue-500 hover:text-blue-700 transition"
            >
              Advanced Options
              <ChevronDown
                size={16}
                className={`transition ${showAdvanced ? "rotate-180" : ""}`}
              />
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-2">
                {(["slow", "standard", "fast"] as const).map((speed) => (
                  <label key={speed} className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={gasPrice === speed}
                      onChange={() => setGasPrice(speed)}
                      className="accent-primary"
                    />
                    <span className="capitalize">
                      {speed} ({gasMap[speed]} Gwei)
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Send */}
          <button
            className="w-full bg-blue-600/50 hover:bg-blue-700 p-2 rounded-lg text-primary-foreground mb-3"
            disabled={!isValid || sending}
            onClick={handleSend}
          >
            {sending ? "Sending..." : "Send ETH"}
          </button>

          <Link href="/dashboard">
            <button className="w-full border p-2 rounded-lg border-gray-500 bg-transparent">
              Cancel
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
