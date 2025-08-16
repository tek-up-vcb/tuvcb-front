import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { 
  LayoutDashboard, 
  Award, 
  Users, 
  GraduationCap,
  Settings, 
  HelpCircle, 
  MoreVertical,
  ChevronDown,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react'
import { ThemeToggleMenuItem } from '@/components/ThemeToggle'
import AuthService from '@/lib/authService'
import logo from '@/assets/logo.png'

export default function DashboardSidebar({ user, isCollapsed = false, onToggle }) {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Pour les admins, selectedRole permet de voir comme un autre rôle
  // Pour les autres, selectedRole est toujours leur vrai rôle
  const [selectedRole, setSelectedRole] = useState(user?.role || 'Guest')

  // Mettre à jour le rôle sélectionné quand l'utilisateur change
  useEffect(() => {
    if (user?.role) {
      setSelectedRole(user.role)
    }
  }, [user?.role])

  const handleLogout = () => {
    AuthService.logout()
    navigate('/login')
  }

  // Fonction pour déterminer quels éléments de navigation afficher selon le rôle
  const getVisibleNavigationItems = (role) => {
    const allItems = [
      {
        title: 'Dashboard',
        icon: LayoutDashboard,
        path: '/dashboard'
      },
      {
        title: 'Manage Diplomas',
        icon: Award,
        path: '/manage-diplomas'
      },
      {
        title: 'Manage Users',
        icon: Users,
        path: '/manage-users'
      },
      {
        title: 'Manage Students',
        icon: GraduationCap,
        path: '/manage-students'
      }
    ]

    switch (role) {
      case 'Admin':
        return allItems // Admin voit tout
      case 'Teacher':
        return allItems.filter(item => item.path !== '/manage-users') // Teacher ne voit pas Manage Users
      case 'Guest':
        return allItems.filter(item => item.path === '/dashboard') // Guest ne voit que le dashboard
      default:
        return allItems.filter(item => item.path === '/dashboard')
    }
  }

  const navigationItems = getVisibleNavigationItems(selectedRole)

  const toolItems = [
    {
      title: 'Check diplomas',
      icon: Award,
      path: '/check-diplomas'
    }
  ]

  // Fonction pour déterminer si le sélecteur de rôle doit être affiché
  const shouldShowRoleSelector = () => {
    return user?.role === 'Admin'
  }

  // Fonction pour gérer le changement de rôle (seulement pour les admins)
  const handleRoleChange = (newRole) => {
    if (user?.role === 'Admin') {
      setSelectedRole(newRole)
    }
  }

  // Fonction pour déterminer si l'utilisateur peut accéder à une route
  const canAccessRoute = (path, userRole) => {
    switch (path) {
      case '/manage-users':
        return userRole === 'Admin'
      case '/manage-diplomas':
      case '/manage-students':
        return userRole === 'Admin' || userRole === 'Teacher'
      case '/dashboard':
        return true // Tous les utilisateurs authentifiés peuvent accéder au dashboard
      default:
        return true
    }
  }

  // Fonction pour gérer la navigation avec vérification des permissions
  const handleNavigation = (path) => {
    const effectiveRole = user?.role || 'Guest'
    if (canAccessRoute(path, effectiveRole)) {
      navigate(path)
    } else {
      // Optionnel : afficher un message d'erreur ou rediriger vers le dashboard
      console.warn(`Access denied to ${path} for role ${effectiveRole}`)
      navigate('/dashboard')
    }
  }

  const isActivePath = (path) => {
    // Actif si la route exacte ou une sous-route (ex: /manage-users/123)
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const getUserDisplayName = () => {
    if (user?.nom && user?.prenom) {
      return `${user.prenom} ${user.nom}`
    }
    return 'Amino'
  }

  const getUserAddress = () => {
    const address = user?.walletAddress || user?.address || AuthService.getUserAddress()
    if (address) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`
    }
    return '0xD4ch...'
  }

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col bg-background/95 backdrop-blur-sm border-r border-border/70 shadow-soft transition-all duration-300 transform ${
        isCollapsed
          ? 'w-16 -translate-x-full sm:translate-x-0'
          : 'w-64 translate-x-0'
      } max-w-full overflow-hidden`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 flex-shrink-0">
        <button
          type="button"
          onClick={() => navigate('/')}
          className={`focus:outline-none ${isCollapsed ? 'mx-auto' : ''}`}
          title="Go to landing"
        >
          <img src={logo} alt="TEK-UP University" className={`${isCollapsed ? 'h-8' : 'h-10'} w-auto max-w-[90%] object-contain cursor-pointer`} />
        </button>
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 ml-2"
            onClick={onToggle}
            title="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        )}
        {isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-3 h-8 w-8 p-0"
            onClick={onToggle}
            title="Expand sidebar"
          >
            <PanelLeftOpen className="h-4 w-4" />
            <span className="sr-only">Open sidebar</span>
          </Button>
        )}
      </div>

      {/* Sélecteur de rôle - seulement visible pour les admins */}
      {shouldShowRoleSelector() && (
        <div className="p-3 flex-shrink-0 min-w-0">
          {!isCollapsed && (
            <div className="mb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                View as
              </p>
            </div>
          )}
          <Select value={selectedRole} onValueChange={handleRoleChange}>
            <SelectTrigger className={`${isCollapsed ? 'justify-center' : 'w-full'} min-w-0`} title={isCollapsed ? `View as: ${selectedRole}` : undefined}>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {!isCollapsed && <SelectValue />}
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Teacher">Teacher</SelectItem>
              <SelectItem value="Guest">Guest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Indicateur de rôle pour les non-admins */}
      {!shouldShowRoleSelector() && (
        <div className="p-3 flex-shrink-0">
          <div className={`items-center gap-2 px-2 py-2 bg-muted/50 rounded-md ${isCollapsed ? 'flex justify-center' : 'flex'}`} title={isCollapsed ? (user?.role || 'Guest') : undefined}>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            {!isCollapsed && <span className="text-sm font-medium">{user?.role || 'Guest'}</span>}
          </div>
        </div>
      )}

      {/* Navigation principale - avec scroll */}
  <div className="flex-1 overflow-y-auto px-2">
        {/* Section Platform */}
        <div className="mb-6">
          {!isCollapsed && (
            <p className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Platform
            </p>
          )}
          <div className={`space-y-1 ${isCollapsed ? 'flex flex-col items-center gap-2 space-y-0' : ''}`}>
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = isActivePath(item.path)
              
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  title={isCollapsed ? item.title : undefined}
                  className={`${isCollapsed ? 'h-10 w-10 p-0 justify-center rounded-md' : 'w-full justify-start px-3 gap-2 h-9 rounded-md'} ${isActive ? 'bg-accent/15 text-foreground' : 'hover:bg-accent/10'} transition-colors`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <Icon className="h-4 w-4" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Section Tools */}
        <div className="mb-6">
          {!isCollapsed && (
            <p className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tools
            </p>
          )}
          <div className={`space-y-1 ${isCollapsed ? 'flex flex-col items-center gap-2 space-y-0' : ''}`}>
            {toolItems.map((item) => {
              const Icon = item.icon
              const isActive = isActivePath(item.path)
              
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  title={isCollapsed ? item.title : undefined}
                  className={`${isCollapsed ? 'h-10 w-10 p-0 justify-center rounded-md' : 'w-full justify-start px-3 gap-2 h-9 rounded-md'} ${isActive ? 'bg-accent/15 text-foreground' : 'hover:bg-accent/10'} transition-colors`}
                  onClick={() => navigate(item.path)}
                >
                  <Icon className="h-4 w-4" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Section inférieure */}
      <div className="flex-shrink-0">
        {/* Settings et Help */}
        <div className={`p-4 ${isCollapsed ? 'flex flex-col items-center gap-2' : 'space-y-1'}`}>
          <Button
            variant="ghost"
            title={isCollapsed ? 'Settings' : undefined}
            className={`${isCollapsed ? 'h-10 w-10 p-0 justify-center rounded-md' : 'w-full justify-start gap-2 h-9 rounded-md'} hover:bg-accent/10`}
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-4 w-4" />
            {!isCollapsed && 'Settings'}
          </Button>
          <Button
            variant="ghost"
            title={isCollapsed ? 'Get Help' : undefined}
            className={`${isCollapsed ? 'h-10 w-10 p-0 justify-center rounded-md' : 'w-full justify-start gap-2 h-9 rounded-md'} hover:bg-accent/10`}
            onClick={() => navigate('/help')}
          >
            <HelpCircle className="h-4 w-4" />
            {!isCollapsed && 'Get Help'}
          </Button>
        </div>

  <div className="h-px bg-border mx-4" />

        {/* Profil utilisateur */}
        <div className="p-4">
          <div className={`items-center ${isCollapsed ? 'flex justify-center' : 'flex justify-between'}`}>
            <div className={`items-center ${isCollapsed ? 'flex' : 'flex gap-3'}`}>
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-medium">
                  {getUserDisplayName().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{getUserDisplayName()}</p>
                  <p className="text-xs text-muted-foreground font-mono">{getUserAddress()}</p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <ThemeToggleMenuItem />
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
