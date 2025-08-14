import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import AuthService from '@/lib/authService'
import DashboardSidebar from '@/components/DashboardSidebar'
import FloatingSidebarToggle from '@/components/FloatingSidebarToggle'
import ProtectedRoute from '@/components/ProtectedRoute'
import PromotionsSection from '@/components/students/PromotionsSection'
import StudentsSection from '@/components/students/StudentsSection'
import { useStudentsData } from '@/hooks/students/useStudentsData'
import { useStudentsFilters } from '@/hooks/students/useStudentsFilters'
import { useStudentsSelection } from '@/hooks/students/useStudentsSelection'

export default function ManageStudents() {
  const [user, setUser] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const navigate = useNavigate()

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }
  
  // Data management
  const {
    students,
    promotions,
    loading,
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
      return 'bg-green-100 text-green-800'
    } else if (annee > currentYear) {
      return 'bg-blue-100 text-blue-800'
    } else {
      return 'bg-gray-100 text-gray-800'
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredRoles={['Admin', 'Teacher']}>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <DashboardSidebar 
          user={user} 
          isCollapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
        />
        
        {/* Bouton flottant pour rouvrir le sidebar */}
        <FloatingSidebarToggle 
          onClick={toggleSidebar}
          isVisible={sidebarCollapsed}
        />
        
        {/* Main content */}
        <div className={`flex-1 py-8 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-0' : 'ml-64'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
