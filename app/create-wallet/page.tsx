"use client"
import React from 'react'
import { useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// import { Alert, AlertDescription } from '@/components/ui/alert'
import { Copy, Eye, EyeOff, ArrowLeft, ShieldAlert } from 'lucide-react'

// import { ethers } from "ethers";
import { WalletContext } from '@/lib/wallet-context'

const Createpage = () => {
      const router = useRouter()
      const context = useContext(WalletContext)
  const [showPhrase, setShowPhrase] = useState(false)
  const [copied, setCopied] = useState(false)
  const [tempMnemonic, setTempMnemonic] = useState<string | null>(null)
  const [step, setStep] = useState<'display' | 'set-password'>('display')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const generateMnemonic = async () => {
      try {
        setLoading(true)
        if (!context?.initializeWalletCreation) {
          throw new Error('Provider not available')
        }
        const mnemonic = await context.initializeWalletCreation()
        setTempMnemonic(mnemonic)
      } catch (error) {
        console.error('Error generating wallet:', error)
        setPasswordError('Failed to generate wallet')
      } finally {
        setLoading(false)
      }
    }
    generateMnemonic()
  }, [])

 


  if (!context) {
    return <div>Loading...</div>
  }

  const handleCopy = () => {
    if (tempMnemonic) {
      navigator.clipboard.writeText(tempMnemonic)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleNext = () => {
    setStep('set-password')
  }

  const handleCreateWallet = async () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }

    try {
      await context.createWallet(password)
      router.push('/dashboard')
    } catch (error) {
      setPasswordError('Failed to create wallet')
    }
  }

  const phraseArray = tempMnemonic?.split(' ') || []

  return (
        <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <Link href="/" className="mb-4 inline-flex">
          <button  className="text-muted-foreground hover:bg-red-600 flex items-center px-1 py-1 rounded-lg transition">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </button>
        </Link>

        {step === 'display' ? (
          <div>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Your Recovery Phrase</h1>
              <p className="text-muted-foreground">
                Write down these 12 words in order. Store them safely offline.
              </p>
            </div>

            {/* Card */}
            <div className="bg-card border border-gray-600 rounded-lg p-8 shadow-lg space-y-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                  <p className="text-muted-foreground">Generating your wallet...</p>
                </div>
              ) : (
                <div>
                  {/* Toggle */}
                  <div className="flex justify-between items-center pb-2">
                    <h2 className="text-lg font-semibold text-foreground">Recovery Phrase</h2>
                    <button
                      onClick={() => setShowPhrase(!showPhrase)}
                      className="flex items-center gap-2 text-primary hover:text-blue-400 transition"
                    >
                      {showPhrase ? (
                        <>
                          <EyeOff className=" text-blue-400" size={18} />
                          <span className="text-sm text-blue-400">Hide</span>
                        </>
                      ) : (
                        <>
                          <Eye className=" text-blue-400" size={18} />
                          <span className="text-sm text-blue-400">Show</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Recovery Phrase Grid */}
                  <div className="bg-[#0e1116] rounded-lg p-6 border border-gray-600">
                    {showPhrase ? (
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                        {phraseArray.map((word, index) => (
                          <div
                            key={index}
                            className="bg-[#161b22] border border-gray-600 rounded px-3 py-2 text-center"
                          >
                            <div className="text-xs text-muted-foreground mb-1">{index + 1}</div>
                            <div className="text-sm font-medium text-foreground">{word}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                        {Array(12).fill(null).map((_, index) => (
                          <div
                            key={index}
                            className="bg-[#161b22] border border-gray-600 rounded px-3 py-2 text-center"
                          >
                            <div className="text-xs text-muted-foreground mb-1">{index + 1}</div>
                            <div className="h-5 bg-input rounded" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Warning Alert */}
                  <div className="bg-red-700 border-red p-3 rounded-lg mt-2 mb-2">
                    <h1 className=" text-sm">
                     <span className="flex items-center gap-2"><ShieldAlert size={20} className="" /> Warning:</span> Never share your recovery phrase. Anyone with these words can access your funds.
                    </h1>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={handleCopy}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-foreground hover:bg-input transition"
                  >
                    <Copy size={18} />
                    <span>{copied ? 'Copied!' : 'Copy Phrase'}</span>
                  </button>

                  {/* Continue Button */}
                  <button
            
                    onClick={handleNext}
                    className="w-full bg-blue-600 mt-2 p-2 rounded-xl hover:bg-blue-900 text-primary-foreground"
                  >
                    I Saved My Phrase Securely
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>




            {/* Set Password Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Create Password</h1>
              <p className="text-muted-foreground">
                Set a strong password to secure your wallet
              </p>
            </div>

            {/* Password Card */}
            <div className="bg-card border border-border rounded-lg p-8 shadow-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            {/*  */}
              {passwordError && (
                <div className="bg-destructive/10 border-destructive/30">
                  <h1 className="text-destructive text-sm text-red-500">{passwordError}</h1>
                </div>
              )}

              <button
                onClick={handleCreateWallet}
                
                className="w-full bg-blue-600 p-2 rounded-xl hover:bg-blue-800 text-primary-foreground"
              >
                Create Wallet
              </button>

              <button
                onClick={() => setStep('display')}
                
                className="w-full hover:bg-red-600 hover:p-2 rounded-xl  border-border text-foreground hover:bg-card"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default Createpage
