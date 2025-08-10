import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Search, ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react'
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
import PromotionForm from './PromotionForm'

export default function PromotionsSection({
  promotions,
  students,
  filteredPromotions,
  promotionSearchTerm,
  setPromotionSearchTerm,
  showAllPromotions,
  setShowAllPromotions,
  onPromotionCreate,
  onPromotionUpdate,
  onPromotionDelete,
  getPromotionBadgeClass
}) {
  const [promotionDialogOpen, setPromotionDialogOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState(null)

  const openEditPromotionDialog = (promotion) => {
    setEditingPromotion(promotion)
    setPromotionDialogOpen(true)
  }

  const closePromotionDialog = () => {
    setPromotionDialogOpen(false)
    setEditingPromotion(null)
  }

  const handlePromotionSubmit = async (promotionData) => {
    if (editingPromotion) {
      await onPromotionUpdate(editingPromotion.id, promotionData)
    } else {
      await onPromotionCreate(promotionData)
    }
    closePromotionDialog()
  }

  return (
    <Card className="mb-6 border-0">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Promotions</CardTitle>
            <CardDescription>
              {promotions.length} promotion{promotions.length > 1 ? 's' : ''} registered
            </CardDescription>
          </div>
          <div className="flex gap-3 items-center">
            {/* Search bar for promotions */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search promotions..."
                value={promotionSearchTerm}
                onChange={(e) => setPromotionSearchTerm(e.target.value)}
                className="pl-10 w-64 border-0 shadow-sm bg-gray-50 focus:bg-white"
              />
            </div>
            <Dialog open={promotionDialogOpen} onOpenChange={setPromotionDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 border-0 shadow-sm" onClick={() => setEditingPromotion(null)}>
                  <Plus className="h-4 w-4" />
                  Add Promotion
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] border-0 shadow-lg">
                <DialogHeader>
                  <DialogTitle>
                    {editingPromotion ? 'Edit Promotion' : 'New Promotion'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingPromotion ? 'Edit promotion information.' : 'Create a new promotion to group students.'}
                  </DialogDescription>
                </DialogHeader>
                <PromotionForm
                  promotion={editingPromotion}
                  onSubmit={handlePromotionSubmit}
                  onCancel={closePromotionDialog}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(showAllPromotions ? filteredPromotions : filteredPromotions.slice(0, 6)).map((promotion) => {
            // Calculate student count in this promotion
            const studentCount = students.filter(student => 
              student.promotions && student.promotions.some(p => p.id === promotion.id)
            ).length;
            
            return (
              <div key={promotion.id} className="border-0 shadow-sm rounded-lg p-4 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{promotion.nom}</h3>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditPromotionDialog(promotion)}
                      className="border-0"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 border-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="border-0 shadow-lg">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Promotion</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete promotion "{promotion.nom}"? 
                            This action will affect all students in this promotion.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-0">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => onPromotionDelete(promotion.id)}
                            className="bg-red-600 hover:bg-red-700 border-0"
                          >
                            Delete
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
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border-0 ${getPromotionBadgeClass(promotion.annee)}`}>
                    {promotion.annee}
                  </span>
                  <span className="text-sm text-gray-500">
                    {studentCount} student{studentCount > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* "Show more" button if more than 6 promotions */}
        {filteredPromotions.length > 6 && (
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={() => setShowAllPromotions(!showAllPromotions)}
              className="gap-2 border-0 shadow-sm"
            >
              {showAllPromotions ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Show More ({filteredPromotions.length - 6} others)
                </>
              )}
            </Button>
          </div>
        )}
        
        {filteredPromotions.length === 0 && promotionSearchTerm && (
          <div className="text-center py-8">
            <Search className="mx-auto h-8 w-8 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No Promotions Found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No promotions match your search "{promotionSearchTerm}".
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
