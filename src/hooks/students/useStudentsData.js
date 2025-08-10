import { useState, useEffect } from 'react'
import studentsService from '@/services/studentsService'
import promotionsService from '@/services/promotionsService'

export function useStudentsData() {
  const [students, setStudents] = useState([])
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)

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
      console.error('Error loading data:', error)
      setStudents([])
      setPromotions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const createStudent = async (studentData) => {
    await studentsService.createStudent(studentData)
    await loadData()
  }

  const updateStudent = async (id, studentData) => {
    await studentsService.updateStudent(id, studentData)
    await loadData()
  }

  const deleteStudent = async (id) => {
    await studentsService.deleteStudent(id)
    setStudents(prevStudents => prevStudents.filter(student => student.id !== id))
  }

  const bulkDeleteStudents = async (studentIds) => {
    const deletePromises = studentIds.map(id => studentsService.deleteStudent(id))
    await Promise.all(deletePromises)
    setStudents(prevStudents => 
      prevStudents.filter(student => !studentIds.includes(student.id))
    )
  }

  const bulkUpdatePromotions = async (studentIds, promotionIds) => {
    await studentsService.bulkUpdatePromotions(studentIds, promotionIds)
    await loadData()
  }

  const createPromotion = async (promotionData) => {
    await promotionsService.createPromotion(promotionData)
    await loadData()
  }

  const updatePromotion = async (id, promotionData) => {
    await promotionsService.updatePromotion(id, promotionData)
    await loadData()
  }

  const deletePromotion = async (id) => {
    await promotionsService.deletePromotion(id)
    await loadData()
  }

  return {
    students,
    promotions,
    loading,
    loadData,
    createStudent,
    updateStudent,
    deleteStudent,
    bulkDeleteStudents,
    bulkUpdatePromotions,
    createPromotion,
    updatePromotion,
    deletePromotion
  }
}
