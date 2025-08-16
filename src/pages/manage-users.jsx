import { useEffect, useState } from 'react' 
import { useNavigate } from 'react-router-dom' 
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import Skeleton from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import { Plus, UserCheck, Shield, User, Pencil, Trash2 } from 'lucide-react'
import AuthService from '@/lib/authService'
import { useDashboardLayout } from '@/components/DashboardLayout' 
import ProtectedRoute from '@/components/ProtectedRoute'
import { validateEthereumAddressDetailed, formatEthereumAddress } from '@/utils/ethereum'
import usersService from '@/services/usersService'

export default function ManageUsers() {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [selectedUsers, setSelectedUsers] = useState(new Set())
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    role: '',
    walletAddress: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [submitLoading, setSubmitLoading] = useState(false)
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
        await loadUsers()
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

  // Multiple selection management
  const handleSelectUser = (userId, checked) => {
    const newSelection = new Set(selectedUsers)
    if (checked) {
      newSelection.add(userId)
    } else {
      newSelection.delete(userId)
    }
    setSelectedUsers(newSelection)
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(new Set(users.map(u => u.id)))
    } else {
      setSelectedUsers(new Set())
    }
  }

  const isAllSelected = users.length > 0 && selectedUsers.size === users.length

  const loadUsers = async () => {
    try {
      setLoading(true)
      const userData = await usersService.getAllUsers()
      setUsers(userData)
    } catch (error) {
      console.error('Error loading users:', error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.nom.trim()) {
      errors.nom = 'Last name is required'
    }
    
    if (!formData.prenom.trim()) {
      errors.prenom = 'First name is required'
    }
    
    if (!formData.role) {
      errors.role = 'Role is required'
    }
    
    if (!formData.walletAddress.trim()) {
      errors.walletAddress = 'Wallet address is required'
    } else {
      const validation = validateEthereumAddressDetailed(formData.walletAddress)
      if (!validation.isValid) {
        errors.walletAddress = validation.error
      }
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setSubmitLoading(true)
      
      if (editingUser) {
        const updatedUser = await usersService.updateUser(editingUser.id, formData)
        setUsers(prevUsers => 
          prevUsers.map(user => user.id === editingUser.id ? updatedUser : user)
        )
      } else {
        const newUser = await usersService.createUser(formData)
        setUsers(prevUsers => [newUser, ...prevUsers])
      }
      
      resetForm()
      setDialogOpen(false)
      
    } catch (error) {
      console.error('Error during submission:', error)
      
      if (error.message.includes('wallet address')) {
        setFormErrors({ walletAddress: error.message })
      } else {
        setFormErrors({ general: error.message })
      }
    } finally {
      setSubmitLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ nom: '', prenom: '', role: '', walletAddress: '' })
    setFormErrors({})
    setEditingUser(null)
  }

  const openEditDialog = (user) => {
    setEditingUser(user)
    setFormData({
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
      walletAddress: user.walletAddress
    })
    setDialogOpen(true)
  }

  const handleDeleteUser = async (userId) => {
    try {
      await usersService.deleteUser(userId)
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId))
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const handleBulkDelete = async () => {
    try {
      setSubmitLoading(true)
      
      const deletePromises = Array.from(selectedUsers).map(userId => 
        usersService.deleteUser(userId)
      )
      
      await Promise.all(deletePromises)
      
      setUsers(prevUsers => 
        prevUsers.filter(user => !selectedUsers.has(user.id))
      )
      
      setSelectedUsers(new Set())
      setBulkDeleteDialogOpen(false)
      
    } catch (error) {
      console.error('Error during bulk deletion:', error)
    } finally {
      setSubmitLoading(false)
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin':
        return <Shield className="h-4 w-4 text-red-600" />
      case 'Teacher':
        return <UserCheck className="h-4 w-4 text-blue-600" />
      default:
        return <User className="h-4 w-4 text-gray-600" />
    }
  }

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800'
      case 'Teacher':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 rounded-xl border border-border/70 bg-card">
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-border/70 bg-card p-4">
          <Skeleton className="h-9 w-full mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredRoles={['Admin']}>
  <div className="space-y-8">
        <div className="mb-8"> 
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1> 
          <p className="mt-2 text-gray-600">Manage system users and their permissions</p> 
        </div> 

    <Card>
          <CardHeader>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Users List</CardTitle>
                <CardDescription>
                  {users.length} user{users.length > 1 ? 's' : ''} registered
                  {selectedUsers.size > 0 && (
                    <span className="ml-2 text-blue-600 font-medium">
                      • {selectedUsers.size} selected
                    </span>
                  )}
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                {selectedUsers.size > 0 && (
                  <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="soft" size="sm" className="gap-2 text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                        Delete ({selectedUsers.size})
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-0 shadow-lg">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Selected Users</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {selectedUsers.size} user{selectedUsers.size > 1 ? 's' : ''}? 
                          This action is irreversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-0">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleBulkDelete}
                          className="bg-red-600 hover:bg-red-700 border-0"
                          disabled={submitLoading}
                        >
                          {submitLoading ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2" variant="soft" onClick={resetForm}>
                      <Plus className="h-4 w-4" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] border-0 shadow-lg">
                    <DialogHeader>
                      <DialogTitle>
                        {editingUser ? 'Edit User' : 'New User'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingUser ? 'Edit user information and permissions.' : 'Create a new user account with wallet authentication.'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                      {formErrors.general && (
                        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md border-0">
                          {formErrors.general}
                        </div>
                      )}
                      
                      <div className="grid gap-2">
                        <Label htmlFor="nom">Last Name</Label>
                        <Input
                          id="nom"
                          value={formData.nom}
                          onChange={(e) => handleInputChange('nom', e.target.value)}
                          placeholder="Enter last name"
                          className={`border-0 shadow-sm bg-gray-50 focus:bg-white ${formErrors.nom ? 'ring-2 ring-red-500' : ''}`}
                        />
                        {formErrors.nom && (
                          <p className="text-sm text-red-500">{formErrors.nom}</p>
                        )}
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="prenom">First Name</Label>
                        <Input
                          id="prenom"
                          value={formData.prenom}
                          onChange={(e) => handleInputChange('prenom', e.target.value)}
                          placeholder="Enter first name"
                          className={`border-0 shadow-sm bg-gray-50 focus:bg-white ${formErrors.prenom ? 'ring-2 ring-red-500' : ''}`}
                        />
                        {formErrors.prenom && (
                          <p className="text-sm text-red-500">{formErrors.prenom}</p>
                        )}
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                          <SelectTrigger className={`border-0 shadow-sm ${formErrors.role ? 'ring-2 ring-red-500' : ''}`}>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent className="border-0 shadow-lg">
                            <SelectItem value="Guest">Guest</SelectItem>
                            <SelectItem value="Teacher">Teacher</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.role && (
                          <p className="text-sm text-red-500">{formErrors.role}</p>
                        )}
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="walletAddress">Wallet Address</Label>
                        <Input
                          id="walletAddress"
                          value={formData.walletAddress}
                          onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                          placeholder="0x..."
                          className={`border-0 shadow-sm bg-gray-50 focus:bg-white font-mono ${formErrors.walletAddress ? 'ring-2 ring-red-500' : ''}`}
                        />
                        {formErrors.walletAddress && (
                          <p className="text-sm text-red-500">{formErrors.walletAddress}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          Ethereum wallet address (42 characters starting with 0x)
                        </p>
                      </div>
                      
                      <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="soft" onClick={() => setDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={submitLoading}>
                          {submitLoading ? 'Saving...' : editingUser ? 'Update' : 'Create'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
      <Table className="min-w-[720px]">
              <TableHeader>
        <TableRow className="border-b border-border/40">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all users"
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Wallet Address</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.has(user.id)}
                        onCheckedChange={(checked) => handleSelectUser(user.id, checked)}
                        aria-label={`Select ${user.prenom} ${user.nom}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {user.prenom} {user.nom}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border-0 ${getRoleBadgeClass(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="relative rounded bg-muted px-2 py-1 font-mono text-sm border-0">
                        {formatEthereumAddress(user.walletAddress)}
                      </code>
                    </TableCell>
                    <TableCell>{new Date(user.dateCreation).toLocaleDateString('en-US')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button 
                          variant="soft" 
                          size="sm"
                          onClick={() => openEditDialog(user)}
                          className=""
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 border-0 shadow-sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="border-0 shadow-lg">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete user {user.prenom} {user.nom}? 
                                This action is irreversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-0">Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteUser(user.id)}
                                className="bg-red-600 hover:bg-red-700 border-0"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
            
            {users.length === 0 && (
              <EmptyState
                icon={User}
                title="No users"
                description="Start by creating your first user."
              />
            )}
          </CardContent>
        </Card>
  </div> 
    </ProtectedRoute>
  )
}
