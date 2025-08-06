import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Phone, ArrowLeft, Loader2 } from 'lucide-react'
import logo from '@/assets/logo.png'
import metamaskLogo from '@/assets/metamask.png'
import { useCallback, useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login, checkAuthStatus, isAuthenticated } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleLogin = useCallback(async () => {
    if (!window?.ethereum) {
      alert('MetaMask extension not detected. Please install MetaMask to continue.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const walletAddress = accounts[0]

      // Step 1: Connect wallet and get nonce
      const authApiUrl = import.meta.env.VITE_AUTH_API_URL || 'http://auth.localhost'
      const connectResponse = await fetch(`${authApiUrl}/auth/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      })

      if (!connectResponse.ok) {
        throw new Error('Failed to connect wallet')
      }

      const { nonce } = await connectResponse.json()

      // Step 2: Sign the message
      const message = `Please sign this message to authenticate with TUVCB: ${nonce}`
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, walletAddress],
      })

      // Step 3: Verify signature and get JWT token
      const verifyResponse = await fetch(`${authApiUrl}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({ walletAddress, signature }),
      })

      if (!verifyResponse.ok) {
        throw new Error('Authentication failed')
      }

      const result = await verifyResponse.json()
      console.log('Authentication successful:', result)

      // Update auth state and redirect
      await checkAuthStatus()
      navigate('/')
    } catch (err) {
      console.error('Authentication error:', err)
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [navigate, checkAuthStatus])

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <Link
        to="/"
        className="absolute left-4 top-4 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="h-6 w-6" />
      </Link>
      <div className="flex w-full max-w-sm flex-col items-center gap-8 text-center">
        <img src={logo} alt="TEK-UP University" className="h-16 w-auto" />
        <div className="w-full space-y-6">
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-black">Login to your account</h1>
            <p className="text-sm text-gray-500">
              Use the MetaMask extension on your browser to continue
            </p>
          </div>
          
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <img src={metamaskLogo} alt="MetaMask" className="h-5 w-5" />
                Login via MetaMask
              </>
            )}
          </Button>
          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-xs text-gray-400">OR</span>
            <Separator className="flex-1" />
          </div>
          <Button variant="outline" className="w-full text-black">
            <Phone className="h-4 w-4" />
            Contact us
          </Button>
          <p className="text-xs text-gray-400">
            By clicking continue, you agree to our{' '}
            <Link to="/terms" className="underline text-blue-600">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="#" className="underline text-blue-600">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
