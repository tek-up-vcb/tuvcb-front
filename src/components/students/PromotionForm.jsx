import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function PromotionForm({ promotion, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    annee: new Date().getFullYear()
  })
  const [errors, setErrors] = useState({})
  const [submitLoading, setSubmitLoading] = useState(false)

  useEffect(() => {
    if (promotion) {
      setFormData({
        nom: promotion.nom,
        description: promotion.description || '',
        annee: promotion.annee
      })
    } else {
      setFormData({
        nom: '',
        description: '',
        annee: new Date().getFullYear()
      })
    }
    setErrors({})
  }, [promotion])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Promotion name is required'
    }
    
    if (!formData.annee || formData.annee < 2020) {
      newErrors.annee = 'Year must be greater than or equal to 2020'
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
    
    if (!validateForm()) {
      return
    }

    try {
      setSubmitLoading(true)
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting promotion:', error)
      setErrors({ general: error.message })
    } finally {
      setSubmitLoading(false)
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
        <Label htmlFor="promo-nom">Promotion Name</Label>
        <Input
          id="promo-nom"
          value={formData.nom}
          onChange={(e) => handleInputChange('nom', e.target.value)}
          placeholder="Ex: Promo25, External2024..."
          className={`border-0 shadow-sm bg-gray-50 focus:bg-white ${errors.nom ? 'ring-2 ring-red-500' : ''}`}
        />
        {errors.nom && (
          <p className="text-sm text-red-500">{errors.nom}</p>
        )}
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="promo-description">Description (optional)</Label>
        <Textarea
          id="promo-description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Promotion description..."
          className="border-0 shadow-sm bg-gray-50 focus:bg-white"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="promo-annee">Year</Label>
        <Input
          id="promo-annee"
          type="number"
          min="2020"
          value={formData.annee}
          onChange={(e) => handleInputChange('annee', parseInt(e.target.value))}
          className={`border-0 shadow-sm bg-gray-50 focus:bg-white ${errors.annee ? 'ring-2 ring-red-500' : ''}`}
        />
        {errors.annee && (
          <p className="text-sm text-red-500">{errors.annee}</p>
        )}
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="border-0 shadow-sm">
          Cancel
        </Button>
        <Button type="submit" disabled={submitLoading} className="border-0 shadow-sm">
          {submitLoading ? 'Saving...' : promotion ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}
