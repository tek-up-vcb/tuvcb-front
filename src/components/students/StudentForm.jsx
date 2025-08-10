import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RefreshCw } from 'lucide-react'

export default function StudentForm({ student, promotions, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    studentId: '',
    nom: '',
    prenom: '',
    email: '',
    promotionIds: []
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (student) {
      setFormData({
        studentId: student.studentId,
        nom: student.nom,
        prenom: student.prenom,
        email: student.email,
        promotionIds: student.promotions ? student.promotions.map(p => p.id) : []
      })
    } else {
      setFormData({
        studentId: '',
        nom: '',
        prenom: '',
        email: '',
        promotionIds: []
      })
    }
    setErrors({})
  }, [student])

  // Generate random student ID
  const generateRandomStudentId = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    let result = ''
    
    // 3 random letters
    for (let i = 0; i < 3; i++) {
      result += letters.charAt(Math.floor(Math.random() * letters.length))
    }
    
    // 3 random numbers
    for (let i = 0; i < 3; i++) {
      result += numbers.charAt(Math.floor(Math.random() * numbers.length))
    }
    
    return result
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required'
    }
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Last name is required'
    }
    
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'First name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Auto-generate ID if empty
    const submitData = { ...formData }
    if (!submitData.studentId.trim()) {
      const generatedId = generateRandomStudentId()
      submitData.studentId = generatedId
      setFormData(prev => ({ ...prev, studentId: generatedId }))
    }
    
    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(submitData)
    } catch (error) {
      console.error('Error submitting student:', error)
      
      if (error.message.includes('ID')) {
        setErrors({ studentId: error.message })
      } else if (error.message.includes('email')) {
        setErrors({ email: error.message })
      } else {
        setErrors({ general: error.message })
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      {errors.general && (
        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md border-0">
          {errors.general}
        </div>
      )}
      
      <div className="grid gap-2">
        <Label htmlFor="studentId">Student ID</Label>
        <div className="flex gap-2">
          <Input
            id="studentId"
            value={formData.studentId}
            onChange={(e) => handleInputChange('studentId', e.target.value)}
            placeholder="Ex: ETU2025001 (auto-generated if empty)"
            className={`border-0 shadow-sm bg-gray-50 focus:bg-white ${errors.studentId ? 'ring-2 ring-red-500' : ''}`}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleInputChange('studentId', generateRandomStudentId())}
            className="border-0 shadow-sm"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        {errors.studentId && (
          <p className="text-sm text-red-500">{errors.studentId}</p>
        )}
        <p className="text-xs text-gray-500">
          Leave empty to auto-generate a random ID (ex: ABC123)
        </p>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="nom">Last Name</Label>
        <Input
          id="nom"
          value={formData.nom}
          onChange={(e) => handleInputChange('nom', e.target.value)}
          placeholder="Enter last name"
          className={`border-0 shadow-sm bg-gray-50 focus:bg-white ${errors.nom ? 'ring-2 ring-red-500' : ''}`}
        />
        {errors.nom && (
          <p className="text-sm text-red-500">{errors.nom}</p>
        )}
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="prenom">First Name</Label>
        <Input
          id="prenom"
          value={formData.prenom}
          onChange={(e) => handleInputChange('prenom', e.target.value)}
          placeholder="Enter first name"
          className={`border-0 shadow-sm bg-gray-50 focus:bg-white ${errors.prenom ? 'ring-2 ring-red-500' : ''}`}
        />
        {errors.prenom && (
          <p className="text-sm text-red-500">{errors.prenom}</p>
        )}
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="example@email.com"
          className={`border-0 shadow-sm bg-gray-50 focus:bg-white ${errors.email ? 'ring-2 ring-red-500' : ''}`}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>
      
      <div className="grid gap-2">
        <Label>Promotions (optional)</Label>
        <div className="space-y-2 max-h-32 overflow-y-auto border-0 shadow-sm rounded-md p-2 bg-gray-50">
          {promotions.map((promotion) => (
            <div key={promotion.id} className="flex items-center space-x-2">
              <Checkbox
                id={`promotion-${promotion.id}`}
                checked={formData.promotionIds.includes(promotion.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleInputChange('promotionIds', [...formData.promotionIds, promotion.id])
                  } else {
                    handleInputChange('promotionIds', formData.promotionIds.filter(id => id !== promotion.id))
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
          {formData.promotionIds.length} promotion{formData.promotionIds.length > 1 ? 's' : ''} selected.
        </p>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="border-0 shadow-sm">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="border-0 shadow-sm">
          {isLoading ? 'Saving...' : student ? 'Update' : 'Create Student'}
        </Button>
      </div>
    </form>
  )
}
