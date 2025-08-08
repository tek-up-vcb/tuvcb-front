import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AuthService from '@/lib/authService'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      if (!AuthService.isAuthenticated()) {
        navigate('/login')
        return
      }

      try {
        const profile = await AuthService.getProfile()
        setUser(profile)
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error)
        AuthService.logout()
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [navigate])

  const handleLogout = () => {
    AuthService.logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-2 text-gray-600">Bienvenue dans votre espace sécurisé</p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              Déconnexion
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Informations utilisateur */}
          <Card>
            <CardHeader>
              <CardTitle>Profil Utilisateur</CardTitle>
              <CardDescription>Informations de votre wallet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Adresse Wallet:</p>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded break-all">
                  {user?.address || AuthService.getUserAddress()}
                </p>
                <p className="text-sm font-medium text-gray-500 mt-4">Statut:</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Authentifié ✓
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Fonctionnalités */}
          <Card>
            <CardHeader>
              <CardTitle>Fonctionnalités</CardTitle>
              <CardDescription>Actions disponibles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  Consulter les transactions
                </Button>
                <Button className="w-full" variant="outline">
                  Gérer le profil
                </Button>
                <Button className="w-full" variant="outline">
                  Paramètres
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques */}
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
              <CardDescription>Données de la session</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Dernière connexion:</p>
                  <p className="text-sm">{new Date().toLocaleString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Méthode d'auth:</p>
                  <p className="text-sm">MetaMask</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Session:</p>
                  <p className="text-sm">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Zone de contenu principal */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Zone Protégée</CardTitle>
            <CardDescription>
              Contenu accessible uniquement aux utilisateurs authentifiés avec MetaMask
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🎉 Félicitations ! 
              </h3>
              <p className="text-gray-600 mb-6">
                Vous êtes maintenant connecté avec succès via MetaMask.<br/>
                Cette zone est protégée et nécessite une authentification valide.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
                <h4 className="font-medium text-blue-900 mb-2">Informations techniques:</h4>
                <ul className="text-sm text-blue-800 space-y-1 text-left">
                  <li>• Authentification basée sur la signature de message</li>
                  <li>• Token JWT sécurisé</li>
                  <li>• Session protégée par Traefik</li>
                  <li>• Backend NestJS avec validation ethers.js</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
