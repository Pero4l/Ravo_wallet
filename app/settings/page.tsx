'use client'

import { useContext, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

import { ArrowLeft, ChevronRight, Eye, EyeOff, Copy, Lock, RotateCcw, AlertTriangle, Bell, Shield, LogOut } from 'lucide-react'

import { WalletContext } from '@/lib/wallet-context'

export default function SettingsPage() {
  const router = useRouter()
  const context = useContext(WalletContext)
  const [showRecoveryPhrase, setShowRecoveryPhrase] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [copied, setCopied] = useState(false)
  const recoveryPhrase = "Your recovery phrase here"; // Declare recoveryPhrase variable

  if (!context) {
    return <div>Loading...</div>
  }

  const { mnemonic, logout, settings, updateSettings } = context

  const handleCopyPhrase = () => {
    if (mnemonic) {
      navigator.clipboard.writeText(mnemonic)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleReset = () => {
    logout()
    localStorage.clear()
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header Bar */}
      <header className="bg-[#161b22]  border-gray-500 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <button  className="hover:bg-input text-foreground">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Security Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield size={20} className="text-blue-500" />
            <h2 className="text-lg font-semibold ">Security</h2>
          </div>
          <div className="space-y-2">
            {/* View Recovery Phrase */}
            <div className="bg-[#161b22] border border-gray-500  rounded-xl p-0 overflow-hidden hover:border-primary transition">
              <button
                onClick={() => setShowRecoveryPhrase(!showRecoveryPhrase)}
                className="w-full flex items-center justify-between text-left p-4"
              >
                <div className="flex items-center gap-3">
                  <Eye size={20} className="text-muted-foreground" />
                  <div>
                    <p className="text-foreground font-medium">View Recovery Phrase</p>
                    <p className="text-gray-400 text-sm">See your backup phrase</p>
                  </div>
                </div>
                <ChevronRight size={20} className={`text-muted-foreground transition ${showRecoveryPhrase ? 'rotate-90' : ''}`} />
              </button>

              {showRecoveryPhrase && mnemonic && (
                <div className="border-t border-gray-500 bg-background/50 p-4 space-y-3">
                  <div className="bg-[#2c1f25] border border-[#3d2c34] rounded-lg flex gap-2 p-4 ">
                    <AlertTriangle size={26} className="text-red-500" />
                    <p className="text-red-500 text-sm">
                      Never share this phrase. Anyone with it can access your funds.
                    </p>
                  </div>
                  <div className="bg-input border border-gray-500 rounded-lg p-3 font-mono text-sm text-foreground break-words">
                    {mnemonic}
                  </div>
                  <button
                    onClick={handleCopyPhrase}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 hover:bg-border rounded-lg transition text-sm text-green-500"
                  >
                    <Copy size={16} />
                    {copied ? 'Copied!' : 'Copy Phrase'}
                  </button>
                </div>
              )}
            </div>

            {/* Change Password */}
            <div className="bg-[#161b22] border border-gray-500  rounded-xl p-4 hover:bg-input transition cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock size={20} className="text-muted-foreground" />
                  <div>
                    <p className="text-foreground font-medium">Change Password</p>
                    <p className="text-gray-400 text-sm">Update your wallet password</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Bell size={20} className="text-blue-500" />
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          </div>
          <div className="space-y-2">
            <div className="bg-[#161b22] border border-gray-500  rounded-xl p-4 flex items-center flex-col justify-between gap-4">
              <div>
                <p className="text-foreground font-medium">Transaction Alerts</p>
                <p className="text-gray-400 text-sm">Notify on transaction events</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                onChange={() => updateSettings({ autoLock: !settings.autoLock })}
                className="w-5 h-5 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Lock size={20} className="text-blue-500" />
            <h2 className="text-lg font-semibold text-foreground">Display</h2>
          </div>
          <div className="space-y-2">
            <div className="bg-[#161b22] border border-gray-500  rounded-xl p-4">
              <div className="space-y-3">
                <div>
                  <p className="text-foreground font-medium mb-2">Currency Display</p>
                  <select
                    value={settings.currencyDisplay}
                    onChange={(e) => updateSettings({ currencyDisplay: e.target.value as 'USD' | 'ETH' })}
                    className="w-full bg-input border border-gray-500 rounded-lg p-2 text-foreground"
                  >
                    <option value="USD">USD</option>
                    <option value="ETH">Crypto (ETH)</option>
                  </select>
                </div>
                <div>
                  <p className="text-foreground font-medium mb-2">Auto-lock Timer</p>
                  <select
                    value={settings.lockTimeout}
                    onChange={(e) => updateSettings({ lockTimeout: parseInt(e.target.value) })}
                    className="w-full bg-input border border-gray-500 rounded-lg p-2 text-foreground"
                  >
                    <option value={1}>1 minute</option>
                    <option value={5}>5 minutes</option>
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Account</h2>
          <div className="space-y-2">
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full bg-gray-700 hover:bg-gray-600 p-2 rounded-lg text-foreground flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </button>

            {/* Reset Wallet */}
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full bg-red-500/15 hover:bg-red-600 text-red-500 border border-red-600/30 flex items-center justify-center gap-2 p-2 rounded-lg"
              >
                <RotateCcw size={16} className="mr-2" />
                Reset Wallet
              </button>
            ) : (
              <div className="bg-[#161b22] border border-red-500/30 rounded-lg p-6">
                <div className="mb-4 bg-red-500/15 border-red-500/30 p-3 rounded-lg">
                  <div className="flex gap-2">
                    <AlertTriangle size={46} className="" />
                    <p className="text-red-500 text-sm">
                      This action cannot be undone. Make sure you have your recovery phrase saved before proceeding.
                    </p>
                  </div>
                </div>

                <p className="text-foreground mb-4">
                  Are you sure you want to reset your wallet? This will delete all local data.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    className="border-border text-foreground hover:bg-input bg-transparent px-4 py-2 rounded-lg"
                    onClick={() => setShowResetConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg" onClick={handleReset}>
                    Reset Wallet
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Version Info */}
        <div className="text-center py-8 border-t border-gray-500">
          <p className="text-muted-foreground text-sm">
            Ravo v1.0.0
          </p>
          <p className="text-gray-400 text-xs mt-1">
            © 2026 Ravo. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  )
}
