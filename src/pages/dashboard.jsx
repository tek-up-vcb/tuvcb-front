import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, GraduationCap, Award, Database } from 'lucide-react'
import AuthService from '@/lib/authService'
import { useDashboardLayout } from '@/components/DashboardLayout'
import studentsService from '@/services/studentsService'
import diplomasService from '@/services/diplomasService'

function KpiCard({ icon: Icon, label, value, sub }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className="h-4 w-4 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [kpiLoading, setKpiLoading] = useState(true)
  const [kpis, setKpis] = useState({ totalStudents: 0, graduatedStudents: 0, anchoredRequests: 0 })
  const navigate = useNavigate()
  const layout = useDashboardLayout?.() || {}

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

  useEffect(() => {
    const loadKpis = async () => {
      try {
        const [studentKpi, grad, diplomaKpi] = await Promise.all([
          studentsService.getKpi(),
          diplomasService.getGraduatedStudentsCount(),
          diplomasService.getKpiMetrics(),
        ])
        setKpis({
          totalStudents: studentKpi.total,
          graduatedStudents: grad.graduatedStudents,
          anchoredRequests: diplomaKpi.anchoredRequests,
        })
      } catch (e) {
        console.error('Erreur chargement KPI', e)
      } finally {
        setKpiLoading(false)
      }
    }
    if (!loading) loadKpis()
  }, [loading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome to your secure space</p>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <KpiCard icon={Users} label="Étudiants" value={kpiLoading ? '...' : kpis.totalStudents} />
        <KpiCard icon={GraduationCap} label="Diplômés" value={kpiLoading ? '...' : kpis.graduatedStudents} />
        <KpiCard icon={Award} label="Demandes ancrées" value={kpiLoading ? '...' : kpis.anchoredRequests} />
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
                  <p className="text-base font-semibold text-gray-900">{user.prenom} {user.nom}</p>
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
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border-0">Authenticated ✓</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* School News */}
        <Card className="border-0 shadow-sm md:col-span-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>School News</CardTitle>
              <CardDescription>Latest updates from TEK-UP</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-100">
              {[
                { id:1, title:"Voting opens for the next student club", date:"2025-09-01", desc:"Students can now propose and vote for the next official club. Voting runs until 15 September on the internal platform." },
                { id:2, title:"2025 Graduation Ceremony highlights", date:"2025-07-28", desc:"Congrats to the 2025 class! Top blockchain and AI projects were showcased. Video replays will be published next week." },
                { id:3, title:"Workshop: Smart Contract Security", date:"2025-08-25", desc:"An advanced hands-on session strengthened auditing skills and Solidity best practices with guest experts." },
                { id:4, title:"Launch of the TEK-UP Web3 Lab", date:"2025-08-10", desc:"The new innovation lab is live: project mentoring, research support and technical resources now available." },
              ].map(n => (
                <li key={n.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-snug line-clamp-1">{n.title}</p>
                      <p className="mt-1 text-xs text-gray-500 leading-snug line-clamp-2">{n.desc}</p>
                    </div>
                    <span className="text-[11px] font-medium text-gray-400 whitespace-nowrap">{new Date(n.date).toLocaleDateString('en-GB',{day:'2-digit',month:'2-digit'})}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
