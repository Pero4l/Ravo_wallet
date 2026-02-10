'use client'


import { useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import React from 'react'

import { AlertCircle, ArrowLeft } from 'lucide-react'
import { WalletContext } from '@/lib/wallet-context'

export default function ImportWalletPage() {
  const router = useRouter()
  const context = useContext(WalletContext)
  const [importMethod, setImportMethod] = useState<'phrase' | 'privateKey'>('phrase')
  const [input, setInput] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<{ input?: string; password?: string; confirmPassword?: string }>({})

  // console.log('WalletContext:', context) // Debugging log   

  if (!context) {
    return <div className='text-4xl text-center justify-center pt-96'>Loading...</div>
  }

  const validate = () => {
    const newErrors: { input?: string; password?: string; confirmPassword?: string } = {}

    if (!input.trim()) {
      newErrors.input = importMethod === 'phrase'
        ? 'Recovery phrase is required'
        : 'Private key is required'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const canSubmit = input && password && password === confirmPassword && password.length >= 6

  const handleImport = async () => {
    if (validate()) {
      try {
        await context.importWallet(input, password)
        router.push('/dashboard')
      } catch (error) {
        setErrors({ input: 'Invalid recovery phrase or private key' })
      }
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <button  className="hover:bg-input text-foreground">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Import Wallet</h1>
            <p className="text-muted-foreground text-sm">Access your existing wallet</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#161b22] border border-gray-600 rounded-lg p-8 shadow-lg">
          {/* Import Method Toggle */}
          <div className="mb-6 flex gap-2 bg-input p-1 rounded-lg">
            <button
              onClick={() => setImportMethod('phrase')}
              className={`flex-1 py-2 px-3 rounded text-sm font-medium transition ${
                importMethod === 'phrase'
                  ? 'bg-blue-500 text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Recovery Phrase
            </button>
            <button
              onClick={() => setImportMethod('privateKey')}
              className={`flex-1 py-2 px-3 rounded text-sm font-medium transition ${
                importMethod === 'privateKey'
                  ? 'bg-blue-500 text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Private Key
            </button>
          </div>

          {/* Recovery Phrase or Private Key Input */}
          <div className="mb-6 ">
            <label className="text-sm font-medium text-foreground mb-2 block">
              {importMethod === 'phrase' ? 'Recovery Phrase (12 words)' : 'Private Key'}
            </label>
            <textarea
              placeholder={
                importMethod === 'phrase'
                  ? 'Enter your 12-word recovery phrase, separated by spaces'
                  : 'Enter your private key (starting with 0x)'
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`bg-input  border border-gray-500 rounded-lg p-5 w-full text-foreground min-h-24 ${errors.input ? 'border-destructive' : ''}`}
            />
            {errors.input && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.input}
              </p>
            )}
          </div>

          {/* Warning Alert */}
          <div className="mb-6 bg-[#2c1f25] border border-[#3d2c34] p-4 rounded-lg">
            <h1 className="text-red-500 text-sm">
              ⚠️ Never share your recovery phrase or private key. Only import on trusted devices.
            </h1>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-2 block">Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`bg-[#161b22] border-gray-500 p-1 px-3 rounded-lg w-full outline-none border text-foreground ${errors.password ? 'border-destructive' : ''}`}
            />
            {errors.password && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-2 block">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`bg-[#161b22] border-gray-500 p-1 px-3 rounded-lg w-full outline-none border text-foreground ${errors.confirmPassword ? 'border-destructive' : ''}`}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Import Button */}
          <button
            
            className="w-full bg-blue-500 hover:bg-blue-700 p-2 rounded-lg text-primary-foreground disabled:opacity-50"
            disabled={!canSubmit}
            onClick={handleImport}
          >
            Import Wallet
          </button>

          {/* Back Link */}
          <Link href="/" className="block mt-3">
            <button className="w-full border-border text-foreground hover:bg-input bg-transparent">
              Back to Welcome
            </button>
          </Link>
        </div>
      </div>
    </main>
  )
}
