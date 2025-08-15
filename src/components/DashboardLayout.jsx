import { useEffect, useState, useMemo } from 'react'
import { Outlet, useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import DashboardSidebar from '@/components/DashboardSidebar'
import FloatingSidebarToggle from '@/components/FloatingSidebarToggle'
import ProtectedRoute from '@/components/ProtectedRoute'
import AuthService from '@/lib/authService'

// Provide a helper hook for children to access the layout context (user, collapsed, toggler)
export function useDashboardLayout() {
	return useOutletContext()
}

export default function DashboardLayout() {
	const [user, setUser] = useState(null)
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
	const [loading, setLoading] = useState(true)
	const navigate = useNavigate()
	const location = useLocation()

	const toggleSidebar = () => setSidebarCollapsed((c) => !c)

	// Load user once for the whole dashboard area
	useEffect(() => {
		const init = async () => {
			if (!AuthService.isAuthenticated()) {
				navigate('/login')
				return
			}
			try {
				const profile = await AuthService.getProfile()
				setUser(profile)
			} catch (e) {
				console.error('Auth/profile error:', e)
				AuthService.logout()
				navigate('/login')
			} finally {
				setLoading(false)
			}
		}
		init()
		// do not include navigate in deps to avoid unwanted redirects loop
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Persist collapsed state per session (optional, small UX win)
	useEffect(() => {
		const saved = sessionStorage.getItem('dashboard.sidebarCollapsed')
		if (saved != null) setSidebarCollapsed(saved === 'true')
	}, [])
	useEffect(() => {
		sessionStorage.setItem('dashboard.sidebarCollapsed', String(sidebarCollapsed))
	}, [sidebarCollapsed])

	const contextValue = useMemo(
		() => ({ user, sidebarCollapsed, toggleSidebar }),
		[user, sidebarCollapsed]
	)

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
			</div>
		)
	}

	return (
		<ProtectedRoute requiredRoles={[]}> {/* Auth gate, role handled per page if needed */}
			<div className="flex min-h-screen">
				{/* Persistent Sidebar */}
				<DashboardSidebar user={user} isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />

				{/* Re-open button when collapsed */}
				<FloatingSidebarToggle onClick={toggleSidebar} isVisible={sidebarCollapsed} />

				{/* Right content switches with routes */}
				<div className={`flex-1 py-8 transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : 'ml-64'}`}>
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<Outlet context={contextValue} />
					</div>
				</div>
			</div>
		</ProtectedRoute>
	)
}
