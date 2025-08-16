import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import AuthService from '@/lib/authService'
import { useDashboardLayout } from '@/components/DashboardLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import PromotionsSection from '@/components/students/PromotionsSection'
import StudentsSection from '@/components/students/StudentsSection'
import { useStudentsData } from '@/hooks/students/useStudentsData'
import { useStudentsFilters } from '@/hooks/students/useStudentsFilters'
import { useStudentsSelection } from '@/hooks/students/useStudentsSelection'

export default function ManageStudents() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const layout = useDashboardLayout?.() || {}
  
  // Data management
  const {
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
  } = useStudentsData()

  // Filtering
  const {
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
  } = useStudentsFilters(students, promotions)

  // Selection management
  const {
    selectedStudents,
    handleSelectStudent,
    handleSelectAll,
    clearSelection,
    isAllSelected
  } = useStudentsSelection(filteredStudents)

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
      }
    }

    checkAuth()
  }, [navigate])

  const getPromotionBadgeClass = (annee) => {
    const currentYear = new Date().getFullYear()
    if (annee === currentYear) {
      return 'default' // utilise le variant par défaut
    } else if (annee > currentYear) {
      return 'secondary' // utilise le variant secondary
    } else {
      return 'outline' // utilise le variant outline
    }
  }

  const handleBulkPromotionEdit = async (studentIds, promotionIds) => {
    await bulkUpdatePromotions(studentIds, promotionIds)
    clearSelection()
  }

  const handleBulkDelete = async (studentIds) => {
    await bulkDeleteStudents(studentIds)
    clearSelection()
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredRoles={['Admin', 'Teacher']}>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
          <p className="mt-2 text-gray-600">Manage students and their promotions</p>
        </div>

        <PromotionsSection
          promotions={promotions}
          students={students}
          filteredPromotions={filteredPromotions}
          promotionSearchTerm={promotionSearchTerm}
          setPromotionSearchTerm={setPromotionSearchTerm}
          showAllPromotions={showAllPromotions}
          setShowAllPromotions={setShowAllPromotions}
          onPromotionCreate={createPromotion}
          onPromotionUpdate={updatePromotion}
          onPromotionDelete={deletePromotion}
          getPromotionBadgeClass={getPromotionBadgeClass}
        />

        <StudentsSection
          students={students}
          filteredStudents={filteredStudents}
          promotions={promotions}
          selectedPromotion={selectedPromotion}
          setSelectedPromotion={setSelectedPromotion}
          studentSearchTerm={studentSearchTerm}
          setStudentSearchTerm={setStudentSearchTerm}
          selectedStudents={selectedStudents}
          onStudentSelect={handleSelectStudent}
          onSelectAll={handleSelectAll}
          isAllSelected={isAllSelected}
          onStudentCreate={createStudent}
          onStudentUpdate={updateStudent}
          onStudentDelete={deleteStudent}
          onBulkDelete={handleBulkDelete}
          onBulkPromotionEdit={handleBulkPromotionEdit}
          getPromotionBadgeClass={getPromotionBadgeClass}
          reloadData={loadData}
        />
  </div>
    </ProtectedRoute>
  )
}
