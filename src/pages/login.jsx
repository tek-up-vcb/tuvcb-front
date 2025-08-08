import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Phone, ArrowLeft } from 'lucide-react'
import logo from '@/assets/logo.png'
import metamaskLogo from '@/assets/metamask.png'
import { useCallback, useState } from 'react'
import AuthService from '@/lib/authService'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const result = await AuthService.authenticate()
      console.log('Authentification réussie:', result)
      navigate('/dashboard')
    } catch (error) {
      console.error('Erreur d\'authentification:', error)
      setError(error.message || 'Erreur lors de l\'authentification')
    } finally {
      setIsLoading(false)
    }
  }, [navigate])

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
              Use the Metamask extension on your browser to continue
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <img src={metamaskLogo} alt="Metamask" className="h-5 w-5" />
            {isLoading ? 'Connexion en cours...' : 'Login via Metamask'}
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
