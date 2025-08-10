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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, UserCheck, Shield, User } from 'lucide-react'
import AuthService from '@/lib/authService'
import { validateEthereumAddressDetailed, formatEthereumAddress } from '@/utils/ethereum'
import usersService from '@/services/usersService'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    role: '',
    walletAddress: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [submitLoading, setSubmitLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      if (!AuthService.isAuthenticated()) {
        navigate('/login')
        return
      }
      
      await loadUsers()
    }

    checkAuth()
  }, [navigate])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const userData = await usersService.getAllUsers()
      setUsers(userData)
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error)
      // En cas d'erreur, afficher un message à l'utilisateur
      // Pour l'instant, on garde une liste vide
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const validateWalletAddress = (address) => {
    // Utilisation de l'utilitaire de validation détaillée
    const validation = validateEthereumAddressDetailed(address)
    return validation.isValid
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.nom.trim()) {
      errors.nom = 'Le nom est requis'
    }
    
    if (!formData.prenom.trim()) {
      errors.prenom = 'Le prénom est requis'
    }
    
    if (!formData.role) {
      errors.role = 'Le rôle est requis'
    }
    
    if (!formData.walletAddress.trim()) {
      errors.walletAddress = 'L\'adresse wallet est requise'
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
      
      // Créer l'utilisateur via l'API
      const newUser = await usersService.createUser(formData)
      
      // Mettre à jour la liste des utilisateurs
      setUsers(prevUsers => [newUser, ...prevUsers])
      
      // Réinitialiser le formulaire
      setFormData({ nom: '', prenom: '', role: '', walletAddress: '' })
      setFormErrors({})
      setDialogOpen(false)
      
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error)
      
      // Afficher l'erreur dans le formulaire
      if (error.message.includes('adresse wallet')) {
        setFormErrors({ walletAddress: error.message })
      } else {
        setFormErrors({ general: error.message })
      }
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Effacer l'erreur pour ce champ quand l'utilisateur tape
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin':
        return <Shield className="h-4 w-4 text-red-500" />
      case 'Teacher':
        return <UserCheck className="h-4 w-4 text-blue-500" />
      case 'Guest':
        return <User className="h-4 w-4 text-gray-500" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Teacher':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Guest':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
              <p className="mt-2 text-gray-600">Gérez les utilisateurs de la plateforme</p>
            </div>
            <div className="flex gap-4">
              <Button onClick={() => navigate('/dashboard')} variant="outline">
                Retour au Dashboard
              </Button>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Liste des Utilisateurs</CardTitle>
                <CardDescription>
                  {users.length} utilisateur{users.length > 1 ? 's' : ''} enregistré{users.length > 1 ? 's' : ''}
                </CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter un utilisateur
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Nouvel Utilisateur</DialogTitle>
                    <DialogDescription>
                      Créez un nouveau compte utilisateur. Tous les champs sont obligatoires.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    {formErrors.general && (
                      <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                        {formErrors.general}
                      </div>
                    )}
                    
                    <div className="grid gap-2">
                      <Label htmlFor="nom">Nom</Label>
                      <Input
                        id="nom"
                        value={formData.nom}
                        onChange={(e) => handleInputChange('nom', e.target.value)}
                        placeholder="Entrez le nom"
                        className={formErrors.nom ? 'border-red-500' : ''}
                      />
                      {formErrors.nom && (
                        <p className="text-sm text-red-500">{formErrors.nom}</p>
                      )}
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="prenom">Prénom</Label>
                      <Input
                        id="prenom"
                        value={formData.prenom}
                        onChange={(e) => handleInputChange('prenom', e.target.value)}
                        placeholder="Entrez le prénom"
                        className={formErrors.prenom ? 'border-red-500' : ''}
                      />
                      {formErrors.prenom && (
                        <p className="text-sm text-red-500">{formErrors.prenom}</p>
                      )}
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="role">Rôle</Label>
                      <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                        <SelectTrigger className={formErrors.role ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Sélectionnez un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Teacher">Teacher</SelectItem>
                          <SelectItem value="Guest">Guest</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.role && (
                        <p className="text-sm text-red-500">{formErrors.role}</p>
                      )}
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="walletAddress">Adresse Wallet</Label>
                      <Input
                        id="walletAddress"
                        value={formData.walletAddress}
                        onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                        placeholder="0x..."
                        className={formErrors.walletAddress ? 'border-red-500' : ''}
                      />
                      {formErrors.walletAddress && (
                        <p className="text-sm text-red-500">{formErrors.walletAddress}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        Adresse Ethereum valide (format: 0x + 40 caractères hexadécimaux)
                      </p>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button type="submit" disabled={submitLoading}>
                        {submitLoading ? 'Création...' : 'Créer l\'utilisateur'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Adresse Wallet</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.nom}</TableCell>
                    <TableCell>{user.prenom}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeClass(user.role)}`}>
                          {user.role}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="relative rounded bg-muted px-2 py-1 font-mono text-sm">
                        {formatEthereumAddress(user.walletAddress)}
                      </code>
                    </TableCell>
                    <TableCell>{new Date(user.dateCreation).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {users.length === 0 && (
              <div className="text-center py-12">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun utilisateur</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Commencez par créer votre premier utilisateur.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
