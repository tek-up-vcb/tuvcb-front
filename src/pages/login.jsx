import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Phone } from 'lucide-react'
import logo from '@/assets/logo.png'
import metamaskLogo from '@/assets/metamask.png'
import { useCallback } from 'react'

export default function LoginPage() {
  const handleLogin = useCallback(async () => {
    if (window?.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
      } catch (err) {
        console.error('Metamask connection failed', err)
      }
    } else {
      alert('Metamask extension not detected')
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-8 text-center">
        <img src={logo} alt="TEK-UP University" className="h-16 w-auto" />
        <div className="w-full space-y-6">
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-black">Login to your account</h1>
            <p className="text-sm text-gray-500">
              Use the Metamask extension on your browser to continue
            </p>
          </div>
          <Button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            <img src={metamaskLogo} alt="Metamask" className="h-5 w-5" />
            Login via Metamask
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
