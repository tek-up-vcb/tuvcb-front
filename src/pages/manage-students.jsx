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
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, GraduationCap, Pencil, Trash2, Filter, UserPlus, Users, RefreshCw, Edit3 } from 'lucide-react'
import AuthService from '@/lib/authService'
import studentsService from '@/services/studentsService'
import promotionsService from '@/services/promotionsService'

export default function ManageStudents() {
  const [students, setStudents] = useState([])
  const [promotions, setPromotions] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [selectedPromotion, setSelectedPromotion] = useState('all')
  const [loading, setLoading] = useState(true)
  const [studentDialogOpen, setStudentDialogOpen] = useState(false)
  const [promotionDialogOpen, setPromotionDialogOpen] = useState(false)
  const [bulkEditDialogOpen, setBulkEditDialogOpen] = useState(false)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [editingPromotion, setEditingPromotion] = useState(null)
  const [selectedStudents, setSelectedStudents] = useState(new Set())
  const [bulkPromotionIds, setBulkPromotionIds] = useState([])
  const [studentFormData, setStudentFormData] = useState({
    studentId: '',
    nom: '',
    prenom: '',
    email: '',
    promotionIds: []
  })
  const [promotionFormData, setPromotionFormData] = useState({
    nom: '',
    description: '',
    annee: new Date().getFullYear()
  })
  const [studentFormErrors, setStudentFormErrors] = useState({})
  const [promotionFormErrors, setPromotionFormErrors] = useState({})
  const [submitLoading, setSubmitLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      if (!AuthService.isAuthenticated()) {
        navigate('/login')
        return
      }
      
      await loadData()
    }

    checkAuth()
  }, [navigate])

  useEffect(() => {
    // Filtrer les étudiants par promotion
    if (selectedPromotion === 'all') {
      setFilteredStudents(students)
    } else {
      setFilteredStudents(students.filter(student => 
        student.promotions && student.promotions.some(promo => promo.id === selectedPromotion)
      ))
    }
  }, [students, selectedPromotion])

  // Fonction pour générer un ID étudiant aléatoire
  const generateRandomStudentId = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    let result = ''
    
    // 3 lettres aléatoires
    for (let i = 0; i < 3; i++) {
      result += letters.charAt(Math.floor(Math.random() * letters.length))
    }
    
    // 3 chiffres aléatoires
    for (let i = 0; i < 3; i++) {
      result += numbers.charAt(Math.floor(Math.random() * numbers.length))
    }
    
    return result
  }

  // Gestion de la sélection multiple
  const handleSelectStudent = (studentId, checked) => {
    const newSelection = new Set(selectedStudents)
    if (checked) {
      newSelection.add(studentId)
    } else {
      newSelection.delete(studentId)
    }
    setSelectedStudents(newSelection)
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedStudents(new Set(filteredStudents.map(s => s.id)))
    } else {
      setSelectedStudents(new Set())
    }
  }

  const isAllSelected = filteredStudents.length > 0 && selectedStudents.size === filteredStudents.length
  const isIndeterminate = selectedStudents.size > 0 && selectedStudents.size < filteredStudents.length

  const loadData = async () => {
    try {
      setLoading(true)
      const [studentsData, promotionsData] = await Promise.all([
        studentsService.getAllStudents(),
        promotionsService.getAllPromotions()
      ])
      setStudents(studentsData)
      setPromotions(promotionsData)
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      setStudents([])
      setPromotions([])
    } finally {
      setLoading(false)
    }
  }

  const validateStudentForm = () => {
    const errors = {}
    
    if (!studentFormData.studentId.trim()) {
      errors.studentId = 'L\'ID étudiant est requis'
    }
    
    if (!studentFormData.nom.trim()) {
      errors.nom = 'Le nom est requis'
    }
    
    if (!studentFormData.prenom.trim()) {
      errors.prenom = 'Le prénom est requis'
    }
    
    if (!studentFormData.email.trim()) {
      errors.email = 'L\'email est requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentFormData.email)) {
      errors.email = 'Format d\'email invalide'
    }
    
    // Les promotions sont maintenant optionnelles (0 à n)
    
    setStudentFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validatePromotionForm = () => {
    const errors = {}
    
    if (!promotionFormData.nom.trim()) {
      errors.nom = 'Le nom de la promotion est requis'
    }
    
    if (!promotionFormData.annee || promotionFormData.annee < 2020) {
      errors.annee = 'L\'année doit être supérieure ou égale à 2020'
    }
    
    setPromotionFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleStudentSubmit = async (e) => {
    e.preventDefault()
    
    // Préparer les données à envoyer
    const submitData = {
      ...studentFormData
    }
    
    // Auto-générer l'ID si vide
    if (!submitData.studentId.trim()) {
      const generatedId = generateRandomStudentId()
      submitData.studentId = generatedId
      setStudentFormData(prev => ({ ...prev, studentId: generatedId }))
    }
    
    if (!validateStudentForm()) {
      return
    }

    try {
      setSubmitLoading(true)
      
      if (editingStudent) {
        await studentsService.updateStudent(editingStudent.id, submitData)
      } else {
        await studentsService.createStudent(submitData)
      }
      
      await loadData()
      resetStudentForm()
      setStudentDialogOpen(false)
      
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
      
      if (error.message.includes('ID')) {
        setStudentFormErrors({ studentId: error.message })
      } else if (error.message.includes('email')) {
        setStudentFormErrors({ email: error.message })
      } else {
        setStudentFormErrors({ general: error.message })
      }
    } finally {
      setSubmitLoading(false)
    }
  }

  // Fonction pour éditer la promotion en lot
  const handleBulkPromotionEdit = async () => {
    if (!bulkPromotionIds.length || selectedStudents.size === 0) {
      return
    }

    try {
      setSubmitLoading(true)
      
      // Utiliser la nouvelle méthode du service pour la modification groupée
      await studentsService.bulkUpdatePromotions(
        Array.from(selectedStudents),
        bulkPromotionIds
      )
      
      await loadData()
      
      // Réinitialiser
      setSelectedStudents(new Set())
      setBulkPromotionIds([])
      setBulkEditDialogOpen(false)
      
    } catch (error) {
      console.error('Erreur lors de la modification en lot:', error)
    } finally {
      setSubmitLoading(false)
    }
  }

  // Fonction pour supprimer en lot
  const handleBulkDelete = async () => {
    if (selectedStudents.size === 0) {
      return
    }

    try {
      setSubmitLoading(true)
      
      // Supprimer tous les étudiants sélectionnés
      const deletePromises = Array.from(selectedStudents).map(studentId => 
        studentsService.deleteStudent(studentId)
      )
      
      await Promise.all(deletePromises)
      
      // Mettre à jour l'état local
      setStudents(prevStudents => 
        prevStudents.filter(student => !selectedStudents.has(student.id))
      )
      
      // Réinitialiser la sélection
      setSelectedStudents(new Set())
      setBulkDeleteDialogOpen(false)
      
    } catch (error) {
      console.error('Erreur lors de la suppression en lot:', error)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handlePromotionSubmit = async (e) => {
    e.preventDefault()
    
    if (!validatePromotionForm()) {
      return
    }

    try {
      setSubmitLoading(true)
      
      if (editingPromotion) {
        await promotionsService.updatePromotion(editingPromotion.id, promotionFormData)
        // Recharger toutes les données pour s'assurer d'avoir les relations à jour
        await loadData()
      } else {
        await promotionsService.createPromotion(promotionFormData)
        // Recharger toutes les données pour s'assurer d'avoir les relations à jour
        await loadData()
      }
      
      resetPromotionForm()
      setPromotionDialogOpen(false)
      
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
      setPromotionFormErrors({ general: error.message })
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleStudentInputChange = (field, value) => {
    setStudentFormData(prev => ({ ...prev, [field]: value }))
    if (studentFormErrors[field]) {
      setStudentFormErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handlePromotionInputChange = (field, value) => {
    setPromotionFormData(prev => ({ ...prev, [field]: value }))
    if (promotionFormErrors[field]) {
      setPromotionFormErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleEditStudent = (student) => {
    setEditingStudent(student)
    setStudentFormData({
      studentId: student.studentId,
      nom: student.nom,
      prenom: student.prenom,
      email: student.email,
      promotionIds: student.promotions ? student.promotions.map(p => p.id) : []
    })
    setStudentDialogOpen(true)
  }

  const resetStudentForm = () => {
    setStudentFormData({
      studentId: '',
      nom: '',
      prenom: '',
      email: '',
      promotionIds: []
    })
    setStudentFormErrors({})
    setEditingStudent(null)
  }

  const resetPromotionForm = () => {
    setPromotionFormData({
      nom: '',
      description: '',
      annee: new Date().getFullYear()
    })
    setPromotionFormErrors({})
    setEditingPromotion(null)
  }

  const openEditStudentDialog = (student) => {
    setEditingStudent(student)
    setStudentFormData({
      studentId: student.studentId,
      nom: student.nom,
      prenom: student.prenom,
      email: student.email,
      promotionIds: student.promotion ? [student.promotion.id] : []
    })
    setStudentDialogOpen(true)
  }

  const openEditPromotionDialog = (promotion) => {
    setEditingPromotion(promotion)
    setPromotionFormData({
      nom: promotion.nom,
      description: promotion.description || '',
      annee: promotion.annee
    })
    setPromotionDialogOpen(true)
  }

  const handleDeleteStudent = async (studentId) => {
    try {
      await studentsService.deleteStudent(studentId)
      setStudents(prevStudents => prevStudents.filter(student => student.id !== studentId))
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const handleDeletePromotion = async (promotionId) => {
    try {
      await promotionsService.deletePromotion(promotionId)
      await loadData() // Recharger toutes les données
    } catch (error) {
      console.error('Erreur lors de la suppression de la promotion:', error)
    }
  }

  const getPromotionBadgeClass = (annee) => {
    const currentYear = new Date().getFullYear()
    if (annee === currentYear) {
      return 'bg-green-100 text-green-800 border-green-200'
    } else if (annee > currentYear) {
      return 'bg-blue-100 text-blue-800 border-blue-200'
    } else {
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
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Étudiants</h1>
              <p className="mt-2 text-gray-600">Gérez les étudiants et leurs promotions</p>
            </div>
            <div className="flex gap-4">
              <Button onClick={() => navigate('/dashboard')} variant="outline">
                Retour au Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* Section Promotions */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Promotions</CardTitle>
                <CardDescription>
                  {promotions.length} promotion{promotions.length > 1 ? 's' : ''} enregistrée{promotions.length > 1 ? 's' : ''}
                </CardDescription>
              </div>
              <Dialog open={promotionDialogOpen} onOpenChange={setPromotionDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2" onClick={resetPromotionForm}>
                    <Plus className="h-4 w-4" />
                    Ajouter une promotion
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPromotion ? 'Modifier la promotion' : 'Nouvelle Promotion'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingPromotion ? 'Modifiez les informations de la promotion.' : 'Créez une nouvelle promotion pour regrouper les étudiants.'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handlePromotionSubmit} className="grid gap-4 py-4">
                    {promotionFormErrors.general && (
                      <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                        {promotionFormErrors.general}
                      </div>
                    )}
                    
                    <div className="grid gap-2">
                      <Label htmlFor="promo-nom">Nom de la promotion</Label>
                      <Input
                        id="promo-nom"
                        value={promotionFormData.nom}
                        onChange={(e) => handlePromotionInputChange('nom', e.target.value)}
                        placeholder="Ex: Promo25, Externes2024..."
                        className={promotionFormErrors.nom ? 'border-red-500' : ''}
                      />
                      {promotionFormErrors.nom && (
                        <p className="text-sm text-red-500">{promotionFormErrors.nom}</p>
                      )}
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="promo-description">Description (optionnel)</Label>
                      <Textarea
                        id="promo-description"
                        value={promotionFormData.description}
                        onChange={(e) => handlePromotionInputChange('description', e.target.value)}
                        placeholder="Description de la promotion..."
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="promo-annee">Année</Label>
                      <Input
                        id="promo-annee"
                        type="number"
                        min="2020"
                        value={promotionFormData.annee}
                        onChange={(e) => handlePromotionInputChange('annee', parseInt(e.target.value))}
                        className={promotionFormErrors.annee ? 'border-red-500' : ''}
                      />
                      {promotionFormErrors.annee && (
                        <p className="text-sm text-red-500">{promotionFormErrors.annee}</p>
                      )}
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setPromotionDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button type="submit" disabled={submitLoading}>
                        {submitLoading ? 'En cours...' : editingPromotion ? 'Modifier' : 'Créer'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {promotions.map((promotion) => (
                <div key={promotion.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{promotion.nom}</h3>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditPromotionDialog(promotion)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer la promotion</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer la promotion "{promotion.nom}" ? 
                              Cette action affectera tous les étudiants de cette promotion.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeletePromotion(promotion.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  {promotion.description && (
                    <p className="text-sm text-gray-600 mb-2">{promotion.description}</p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPromotionBadgeClass(promotion.annee)}`}>
                      {promotion.annee}
                    </span>
                    <span className="text-sm text-gray-500">
                      {students.filter(s => s.promotion?.id === promotion.id).length} étudiant{students.filter(s => s.promotion?.id === promotion.id).length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section Étudiants */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Liste des Étudiants</CardTitle>
                <CardDescription>
                  {filteredStudents.length} étudiant{filteredStudents.length > 1 ? 's' : ''} 
                  {selectedPromotion !== 'all' ? ' dans la promotion sélectionnée' : ' au total'}
                  {selectedStudents.size > 0 && (
                    <span className="ml-2 text-blue-600 font-medium">
                      • {selectedStudents.size} sélectionné{selectedStudents.size > 1 ? 's' : ''}
                    </span>
                  )}
                </CardDescription>
              </div>
              <div className="flex gap-3 items-center">
                {selectedStudents.size > 0 && (
                  <div className="flex gap-2 border-r pr-3">
                    <Dialog open={bulkEditDialogOpen} onOpenChange={setBulkEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Edit3 className="h-4 w-4" />
                          Changer promotions
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Modifier les promotions en lot</DialogTitle>
                          <DialogDescription>
                            Changer les promotions de {selectedStudents.size} étudiant{selectedStudents.size > 1 ? 's' : ''} sélectionné{selectedStudents.size > 1 ? 's' : ''}.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label>Promotions (sélection multiple)</Label>
                            <div className="max-h-48 overflow-y-auto border rounded-md p-3 space-y-2">
                              {promotions.map((promotion) => (
                                <div key={promotion.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`bulk-promo-${promotion.id}`}
                                    checked={bulkPromotionIds.includes(promotion.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setBulkPromotionIds(prev => [...prev, promotion.id])
                                      } else {
                                        setBulkPromotionIds(prev => prev.filter(id => id !== promotion.id))
                                      }
                                    }}
                                  />
                                  <label 
                                    htmlFor={`bulk-promo-${promotion.id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                  >
                                    {promotion.nom} ({promotion.annee})
                                  </label>
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500">
                              {bulkPromotionIds.length} promotion{bulkPromotionIds.length > 1 ? 's' : ''} sélectionnée{bulkPromotionIds.length > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button type="button" variant="outline" onClick={() => setBulkEditDialogOpen(false)}>
                            Annuler
                          </Button>
                          <Button 
                            onClick={handleBulkPromotionEdit} 
                            disabled={bulkPromotionIds.length === 0 || submitLoading}
                          >
                            {submitLoading ? 'Modification...' : 'Modifier'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                          Supprimer ({selectedStudents.size})
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer les étudiants sélectionnés</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer {selectedStudents.size} étudiant{selectedStudents.size > 1 ? 's' : ''} ? 
                            Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleBulkDelete}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={submitLoading}
                          >
                            {submitLoading ? 'Suppression...' : 'Supprimer'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
                
                <Select value={selectedPromotion} onValueChange={setSelectedPromotion}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrer par promotion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les promotions</SelectItem>
                    {promotions.map((promotion) => (
                      <SelectItem key={promotion.id} value={promotion.id}>
                        {promotion.nom} ({promotion.annee})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={studentDialogOpen} onOpenChange={setStudentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2" onClick={resetStudentForm}>
                      <UserPlus className="h-4 w-4" />
                      Ajouter un étudiant
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>
                        {editingStudent ? 'Modifier l\'étudiant' : 'Nouvel Étudiant'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingStudent ? 'Modifiez les informations de l\'étudiant.' : 'Créez un nouveau profil étudiant. L\'ID sera généré automatiquement si laissé vide.'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleStudentSubmit} className="grid gap-4 py-4">
                      {studentFormErrors.general && (
                        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                          {studentFormErrors.general}
                        </div>
                      )}
                      
                      <div className="grid gap-2">
                        <Label htmlFor="studentId">ID Étudiant</Label>
                        <div className="flex gap-2">
                          <Input
                            id="studentId"
                            value={studentFormData.studentId}
                            onChange={(e) => handleStudentInputChange('studentId', e.target.value)}
                            placeholder="Ex: ETU2025001 (auto-généré si vide)"
                            className={studentFormErrors.studentId ? 'border-red-500' : ''}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleStudentInputChange('studentId', generateRandomStudentId())}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                        {studentFormErrors.studentId && (
                          <p className="text-sm text-red-500">{studentFormErrors.studentId}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          Laissez vide pour générer automatiquement un ID aléatoire (ex: ABC123)
                        </p>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="nom">Nom</Label>
                        <Input
                          id="nom"
                          value={studentFormData.nom}
                          onChange={(e) => handleStudentInputChange('nom', e.target.value)}
                          placeholder="Entrez le nom"
                          className={studentFormErrors.nom ? 'border-red-500' : ''}
                        />
                        {studentFormErrors.nom && (
                          <p className="text-sm text-red-500">{studentFormErrors.nom}</p>
                        )}
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="prenom">Prénom</Label>
                        <Input
                          id="prenom"
                          value={studentFormData.prenom}
                          onChange={(e) => handleStudentInputChange('prenom', e.target.value)}
                          placeholder="Entrez le prénom"
                          className={studentFormErrors.prenom ? 'border-red-500' : ''}
                        />
                        {studentFormErrors.prenom && (
                          <p className="text-sm text-red-500">{studentFormErrors.prenom}</p>
                        )}
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={studentFormData.email}
                          onChange={(e) => handleStudentInputChange('email', e.target.value)}
                          placeholder="exemple@email.com"
                          className={studentFormErrors.email ? 'border-red-500' : ''}
                        />
                        {studentFormErrors.email && (
                          <p className="text-sm text-red-500">{studentFormErrors.email}</p>
                        )}
                      </div>
                      
                      <div className="grid gap-2">
                        <Label>Promotions (optionnel)</Label>
                        <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
                          {promotions.map((promotion) => (
                            <div key={promotion.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`promotion-${promotion.id}`}
                                checked={studentFormData.promotionIds.includes(promotion.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    handleStudentInputChange('promotionIds', [...studentFormData.promotionIds, promotion.id])
                                  } else {
                                    handleStudentInputChange('promotionIds', studentFormData.promotionIds.filter(id => id !== promotion.id))
                                  }
                                }}
                              />
                              <Label htmlFor={`promotion-${promotion.id}`} className="text-sm">
                                {promotion.nom} ({promotion.annee})
                              </Label>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">
                          {studentFormData.promotionIds.length} promotion{studentFormData.promotionIds.length > 1 ? 's' : ''} sélectionnée{studentFormData.promotionIds.length > 1 ? 's' : ''}.
                        </p>
                      </div>
                      
                      <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setStudentDialogOpen(false)}>
                          Annuler
                        </Button>
                        <Button type="submit" disabled={submitLoading}>
                          {submitLoading ? 'En cours...' : editingStudent ? 'Modifier' : 'Créer l\'étudiant'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Sélectionner tous les étudiants"
                    />
                  </TableHead>
                  <TableHead>ID Étudiant</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Promotion</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedStudents.has(student.id)}
                        onCheckedChange={(checked) => handleSelectStudent(student.id, checked)}
                        aria-label={`Sélectionner ${student.prenom} ${student.nom}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <code className="relative rounded bg-muted px-2 py-1 font-mono text-sm">
                        {student.studentId}
                      </code>
                    </TableCell>
                    <TableCell className="font-medium">{student.nom}</TableCell>
                    <TableCell>{student.prenom}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      {student.promotions && student.promotions.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {student.promotions.map((promotion) => (
                            <span 
                              key={promotion.id}
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPromotionBadgeClass(promotion.annee)}`}
                            >
                              {promotion.nom}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">Aucune promotion</span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(student.dateCreation).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditStudentDialog(student)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer l'étudiant</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer l'étudiant {student.prenom} {student.nom} ? 
                                Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteStudent(student.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Supprimer
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
            
            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  {selectedPromotion !== 'all' ? 'Aucun étudiant dans cette promotion' : 'Aucun étudiant'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedPromotion !== 'all' ? 'Changez de promotion ou ajoutez un nouvel étudiant.' : 'Commencez par créer votre premier étudiant.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
