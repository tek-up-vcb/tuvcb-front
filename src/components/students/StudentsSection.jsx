import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Filter, UserPlus, Users, Search, GraduationCap, Pencil, Trash2, Edit3 } from 'lucide-react'
import StudentForm from './StudentForm'

export default function StudentsSection({
  students,
  filteredStudents,
  promotions,
  selectedPromotion,
  setSelectedPromotion,
  studentSearchTerm,
  setStudentSearchTerm,
  selectedStudents,
  onStudentSelect,
  onSelectAll,
  isAllSelected,
  onStudentCreate,
  onStudentUpdate,
  onStudentDelete,
  onBulkDelete,
  onBulkPromotionEdit,
  getPromotionBadgeClass
}) {
  const [studentDialogOpen, setStudentDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [bulkEditDialogOpen, setBulkEditDialogOpen] = useState(false)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [bulkPromotionIds, setBulkPromotionIds] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)

  const openEditStudentDialog = (student) => {
    setEditingStudent(student)
    setStudentDialogOpen(true)
  }

  const closeStudentDialog = () => {
    setStudentDialogOpen(false)
    setEditingStudent(null)
  }

  const handleStudentSubmit = async (studentData) => {
    try {
      setSubmitLoading(true)
      if (editingStudent) {
        await onStudentUpdate(editingStudent.id, studentData)
      } else {
        await onStudentCreate(studentData)
      }
      closeStudentDialog()
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleBulkPromotionEditSubmit = async () => {
    if (!bulkPromotionIds.length || selectedStudents.size === 0) {
      return
    }

    try {
      setSubmitLoading(true)
      await onBulkPromotionEdit(Array.from(selectedStudents), bulkPromotionIds)
      setBulkPromotionIds([])
      setBulkEditDialogOpen(false)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleBulkDeleteSubmit = async () => {
    if (selectedStudents.size === 0) {
      return
    }

    try {
      setSubmitLoading(true)
      await onBulkDelete(Array.from(selectedStudents))
      setBulkDeleteDialogOpen(false)
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Students List</CardTitle>
            <CardDescription>
              {filteredStudents.length} student{filteredStudents.length > 1 ? 's' : ''} 
              {selectedPromotion !== 'all' ? ' in selected promotion' : ' total'}
              {selectedStudents.size > 0 && (
                <span className="ml-2 text-blue-600 font-medium">
                  • {selectedStudents.size} selected
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex gap-3 items-center">
            {selectedStudents.size > 0 && (
              <div className="flex gap-2 border-r pr-3">
                <Dialog open={bulkEditDialogOpen} onOpenChange={setBulkEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 border-0 shadow-sm">
                      <Edit3 className="h-4 w-4" />
                      Change Promotions
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] border-0 shadow-lg">
                    <DialogHeader>
                      <DialogTitle>Bulk Edit Promotions</DialogTitle>
                      <DialogDescription>
                        Change promotions for {selectedStudents.size} selected student{selectedStudents.size > 1 ? 's' : ''}.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label>Promotions (multiple selection)</Label>
                        <div className="max-h-48 overflow-y-auto rounded-md p-3 space-y-2 bg-muted">
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
                          {bulkPromotionIds.length} promotion{bulkPromotionIds.length > 1 ? 's' : ''} selected
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => setBulkEditDialogOpen(false)} className="border-0 shadow-sm">
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleBulkPromotionEditSubmit} 
                        disabled={bulkPromotionIds.length === 0 || submitLoading}
                        className="border-0 shadow-sm"
                      >
                        {submitLoading ? 'Updating...' : 'Update'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700 border-0 shadow-sm">
                      <Trash2 className="h-4 w-4" />
                      Delete ({selectedStudents.size})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="border-0 shadow-lg">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Selected Students</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {selectedStudents.size} student{selectedStudents.size > 1 ? 's' : ''}? 
                        This action is irreversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleBulkDeleteSubmit}
                        className="bg-destructive hover:bg-destructive/90"
                        disabled={submitLoading}
                      >
                        {submitLoading ? 'Deleting...' : 'Delete'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
            
            {/* Search bar for students */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search students..."
                value={studentSearchTerm}
                onChange={(e) => setStudentSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Select value={selectedPromotion} onValueChange={setSelectedPromotion}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by promotion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Promotions</SelectItem>
                {promotions.map((promotion) => (
                  <SelectItem key={promotion.id} value={promotion.id}>
                    {promotion.nom} ({promotion.annee})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={studentDialogOpen} onOpenChange={setStudentDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 border-0 shadow-sm" onClick={() => setEditingStudent(null)}>
                  <UserPlus className="h-4 w-4" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] border-0 shadow-lg">
                <DialogHeader>
                  <DialogTitle>
                    {editingStudent ? 'Edit Student' : 'New Student'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingStudent ? 'Edit student information.' : 'Create a new student profile. ID will be auto-generated if left empty.'}
                  </DialogDescription>
                </DialogHeader>
                <StudentForm
                  student={editingStudent}
                  promotions={promotions}
                  onSubmit={handleStudentSubmit}
                  onCancel={closeStudentDialog}
                  isLoading={submitLoading}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={onSelectAll}
                  aria-label="Select all students"
                />
              </TableHead>
              <TableHead>Student ID</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Promotion</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id} className="hover:bg-muted/50">
                <TableCell>
                  <Checkbox
                    checked={selectedStudents.has(student.id)}
                    onCheckedChange={(checked) => onStudentSelect(student.id, checked)}
                    aria-label={`Select ${student.prenom} ${student.nom}`}
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
                        <Badge 
                          key={promotion.id}
                          variant={getPromotionBadgeClass(promotion.annee)}
                        >
                          {promotion.nom}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">No promotion</span>
                  )}
                </TableCell>
                <TableCell>{new Date(student.dateCreation).toLocaleDateString('en-US')}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openEditStudentDialog(student)}
                      className="border-0 shadow-sm"
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
                          <AlertDialogTitle>Delete Student</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete student {student.prenom} {student.nom}? 
                            This action is irreversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => onStudentDelete(student.id)}
                            className="bg-destructive hover:bg-destructive/90"
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
        
        {filteredStudents.length === 0 && !studentSearchTerm && (
          <div className="text-center py-12">
            <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              {selectedPromotion !== 'all' ? 'No students in this promotion' : 'No students'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedPromotion !== 'all' ? 'Change promotion or add a new student.' : 'Start by creating your first student.'}
            </p>
          </div>
        )}
        
        {filteredStudents.length === 0 && studentSearchTerm && (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No Students Found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No students match your search "{studentSearchTerm}".
            </p>
            <Button 
              variant="outline" 
              onClick={() => setStudentSearchTerm('')}
              className="mt-2 border-0 shadow-sm"
            >
              Clear Search
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
