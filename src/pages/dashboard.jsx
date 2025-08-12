import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, GraduationCap, Award } from 'lucide-react'
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
        console.error('Error retrieving profile:', error)
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
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-2 text-gray-600">Welcome to your secure space</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="border-0 shadow-sm">
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Information */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {user?.nom && user?.prenom && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name:</p>
                    <p className="text-base font-semibold text-gray-900">
                      {user.prenom} {user.nom}
                    </p>
                  </div>
                )}
                
                {user?.role && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Role:</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border-0 ${
                      user.role === 'Admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'Teacher' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-500">Wallet Address:</p>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded break-all border-0">
                    {user?.walletAddress || user?.address || AuthService.getUserAddress()}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Status:</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border-0">
                    Authenticated ✓
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>Available actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  className="w-full border-0 shadow-sm" 
                  variant="outline"
                  onClick={() => navigate('/manage-users')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
                <Button 
                  className="w-full border-0 shadow-sm" 
                  variant="outline"
                  onClick={() => navigate('/manage-students')}
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Manage Students
                </Button>
                <Button 
                  className="w-full border-0 shadow-sm" 
                  variant="outline"
                  onClick={() => navigate('/manage-diplomas')}
                >
                  <Award className="h-4 w-4 mr-2" />
                  Manage Diplomas
                </Button>
                <Button className="w-full border-0 shadow-sm" variant="outline">
                  View Transactions
                </Button>
                <Button className="w-full border-0 shadow-sm" variant="outline">
                  Manage Profile
                </Button>
                <Button className="w-full border-0 shadow-sm" variant="outline">
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>Session data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Last connection:</p>
                  <p className="text-sm">{new Date().toLocaleString('en-US')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Auth method:</p>
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

        {/* Main content area */}
        <Card className="mt-8 border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Protected Area</CardTitle>
            <CardDescription>
              Content accessible only to users authenticated with MetaMask
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🎉 Congratulations! 
              </h3>
              <p className="text-gray-600 mb-6">
                You are now successfully connected via MetaMask.<br/>
                This area is protected and requires valid authentication.
              </p>
              <div className="bg-blue-50 border-0 shadow-sm rounded-lg p-4 max-w-2xl mx-auto">
                <h4 className="font-medium text-blue-900 mb-2">Technical information:</h4>
                <ul className="text-sm text-blue-800 space-y-1 text-left">
                  <li>• Message signature-based authentication</li>
                  <li>• Secure JWT token</li>
                  <li>• Session protected by Traefik</li>
                  <li>• NestJS backend with ethers.js validation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
