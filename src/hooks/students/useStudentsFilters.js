import { useState, useEffect } from 'react'

export function useStudentsFilters(students, promotions) {
  const [filteredStudents, setFilteredStudents] = useState([])
  const [filteredPromotions, setFilteredPromotions] = useState([])
  const [selectedPromotion, setSelectedPromotion] = useState('all')
  const [showAllPromotions, setShowAllPromotions] = useState(false)
  const [promotionSearchTerm, setPromotionSearchTerm] = useState('')
  const [studentSearchTerm, setStudentSearchTerm] = useState('')

  // Filter promotions
  useEffect(() => {
    let filtered = promotions
    
    if (promotionSearchTerm) {
      filtered = filtered.filter(promotion =>
        promotion.nom.toLowerCase().includes(promotionSearchTerm.toLowerCase()) ||
        promotion.description?.toLowerCase().includes(promotionSearchTerm.toLowerCase()) ||
        promotion.annee.toString().includes(promotionSearchTerm)
      )
    }
    
    setFilteredPromotions(filtered)
  }, [promotions, promotionSearchTerm])

  // Filter students
  useEffect(() => {
    let filtered = students
    
    // Filter by selected promotion
    if (selectedPromotion !== 'all') {
      filtered = filtered.filter(student => 
        student.promotions && student.promotions.some(promo => promo.id === selectedPromotion)
      )
    }
    
    // Filter by search term
    if (studentSearchTerm) {
      filtered = filtered.filter(student =>
        student.nom.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        student.prenom.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        (student.promotions && student.promotions.some(promo => 
          promo.nom.toLowerCase().includes(studentSearchTerm.toLowerCase())
        ))
      )
    }
    
    setFilteredStudents(filtered)
  }, [students, selectedPromotion, studentSearchTerm])

  return {
    filteredStudents,
    filteredPromotions,
    selectedPromotion,
    setSelectedPromotion,
    showAllPromotions,
    setShowAllPromotions,
    promotionSearchTerm,
    setPromotionSearchTerm,
    studentSearchTerm,
    setStudentSearchTerm
  }
}
