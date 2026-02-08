import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      {/* Logo */}

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Ravo</h1>
          <p className="text-muted-foreground text-lg">Your crypto. Your control.</p>
        </div>
        </div>

         {/* Card Container */}
        <div className="bg-card border border-border rounded-lg p-10 shadow-lg">
          <p className="text-center text-foreground mb-8 ">
            Get started with your secure Web3 wallet in seconds.
          </p>

          {/* Buttons */}
          <div className="space-y-3 mb-8">
            <Link href="/create-wallet" className="block">
              <button className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-xl text-primary-foreground">
                Create New Wallet
              </button>
            </Link>
            <Link href="/import-wallet" className="block">
              <button
                className="w-full border-border hover:text-blue-700 text-foreground hover:bg-card bg-transparent"
              >
                Import Existing Wallet
              </button>
            </Link>
          </div>

          {/* Security Disclaimer */}
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Your private keys are stored securely on your device. Ravo never stores or transmits your keys.
            </p>
          </div>
        </div>

    </div>
  );
}
