import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthService from '@/lib/authService'

// Composant pour protéger les routes selon les rôles
export default function ProtectedRoute({ children, requiredRoles = [], fallbackPath = '/dashboard' }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAccess = async () => {
      if (!AuthService.isAuthenticated()) {
        navigate('/login')
        return
      }

      try {
        const profile = await AuthService.getProfile()
        setUser(profile)

        // Si aucun rôle requis spécifié, l'accès est autorisé
        if (requiredRoles.length === 0) {
          setHasAccess(true)
        } else {
          // Vérifier si l'utilisateur a l'un des rôles requis
          const userRole = profile?.role || 'Guest'
          const hasRequiredRole = requiredRoles.includes(userRole)
          setHasAccess(hasRequiredRole)

          if (!hasRequiredRole) {
            // Rediriger vers la page de fallback si l'accès est refusé
            navigate(fallbackPath)
            return
          }
        }
      } catch (error) {
        console.error('Error checking access:', error)
        AuthService.logout()
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAccess()
  }, [navigate, requiredRoles, fallbackPath])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!hasAccess) {
    return null // Ne rien afficher pendant la redirection
  }

  return children
}
