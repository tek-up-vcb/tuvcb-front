import { useState } from 'react'

export function useStudentsSelection(filteredStudents) {
  const [selectedStudents, setSelectedStudents] = useState(new Set())

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

  const clearSelection = () => {
    setSelectedStudents(new Set())
  }

  const isAllSelected = filteredStudents.length > 0 && selectedStudents.size === filteredStudents.length

  return {
    selectedStudents,
    handleSelectStudent,
    handleSelectAll,
    clearSelection,
    isAllSelected
  }
}
