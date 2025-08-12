import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { X } from 'lucide-react';

const DiplomaRequestForm = ({ 
  diplomas = [], 
  students = [], 
  promotions = [], 
  users = [], 
  onSubmit, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    diplomaId: '',
    studentIds: [],
    comment: '',
    requiredSignatures: [],
  });

  const [error, setError] = useState(null);
  const [selectedPromotion, setSelectedPromotion] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.diplomaId || formData.studentIds.length === 0 || formData.requiredSignatures.length === 0) {
      setError('Veuillez sélectionner un diplôme, des étudiants et des signataires');
      return;
    }

    console.log('=== FORM SUBMISSION ===');
    console.log('Form data before submission:', formData);

    try {
      await onSubmit(formData);
      // Réinitialiser le formulaire
      setFormData({
        diplomaId: '',
        studentIds: [],
        comment: '',
        requiredSignatures: [],
      });
      setSelectedPromotion('');
    } catch (err) {
      console.error('Form submission error:', err);
      setError('Erreur lors de la création de la demande: ' + err.message);
    }
  };

  const addStudent = (studentId) => {
    if (!formData.studentIds.includes(studentId)) {
      setFormData({
        ...formData,
        studentIds: [...formData.studentIds, studentId]
      });
    }
  };

  const removeStudent = (studentId) => {
    setFormData({
      ...formData,
      studentIds: formData.studentIds.filter(id => id !== studentId)
    });
  };

  const addStudentsByPromotion = (promotionId) => {
    const promotion = promotions.find(p => p.id === promotionId);
    if (promotion) {
      const promotionStudents = students.filter(s => 
        s.promotions && s.promotions.some(p => p.id === promotionId)
      );
      const newStudentIds = promotionStudents.map(s => s.id);
      
      // Ajouter les étudiants qui ne sont pas déjà sélectionnés
      const uniqueStudentIds = [...new Set([...formData.studentIds, ...newStudentIds])];
      
      setFormData({
        ...formData,
        studentIds: uniqueStudentIds
      });
    }
  };

  const addSignature = (userId) => {
    if (!formData.requiredSignatures.includes(userId)) {
      setFormData({
        ...formData,
        requiredSignatures: [...formData.requiredSignatures, userId]
      });
    }
  };

  const removeSignature = (userId) => {
    setFormData({
      ...formData,
      requiredSignatures: formData.requiredSignatures.filter(id => id !== userId)
    });
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.prenom} ${student.nom}` : 'Étudiant inconnu';
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.prenom} ${user.nom}` : 'Utilisateur inconnu';
  };

  const signatoryUsers = users.filter(user => 
    user.role === 'Admin' || user.role === 'Teacher' || user.role === 'Director'
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouvelle Demande de Diplôme</CardTitle>
        <CardDescription>
          Créez une demande de soumission de diplôme pour un ou plusieurs étudiants
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sélection du diplôme */}
          <div>
            <Label htmlFor="diploma">Diplôme *</Label>
            <Select
              value={formData.diplomaId}
              onValueChange={(value) => setFormData({...formData, diplomaId: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un diplôme" />
              </SelectTrigger>
              <SelectContent>
                {diplomas.map(diploma => (
                  <SelectItem key={diploma.id} value={diploma.id}>
                    {diploma.nom || diploma.name} - {diploma.niveau || diploma.level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sélection des étudiants */}
          <div>
            <Label>Étudiants concernés *</Label>
            
            {/* Sélection rapide par promotion */}
            <div className="mt-2">
              <Label htmlFor="promotion" className="text-sm">Sélection rapide par promotion</Label>
              <div className="flex gap-2">
                <Select
                  value={selectedPromotion}
                  onValueChange={setSelectedPromotion}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Choisir une promotion" />
                  </SelectTrigger>
                  <SelectContent>
                    {promotions.map(promotion => (
                      <SelectItem key={promotion.id} value={promotion.id}>
                        {promotion.nom} ({promotion.annee})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => selectedPromotion && addStudentsByPromotion(selectedPromotion)}
                  disabled={!selectedPromotion}
                >
                  Ajouter la promotion
                </Button>
              </div>
            </div>

            {/* Sélection individuelle */}
            <div className="mt-2">
              <Label htmlFor="students" className="text-sm">Ou sélection individuelle</Label>
              <Select onValueChange={addStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Ajouter un étudiant" />
                </SelectTrigger>
                <SelectContent>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.prenom} {student.nom}
                      {student.promotions && student.promotions.length > 0 && ` - ${student.promotions[0].nom}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Étudiants sélectionnés */}
            {formData.studentIds.length > 0 && (
              <div className="mt-3">
                <Label className="text-sm">Étudiants sélectionnés ({formData.studentIds.length})</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.studentIds.map(studentId => (
                    <Badge key={studentId} variant="secondary" className="flex items-center gap-1">
                      {getStudentName(studentId)}
                      <button
                        type="button"
                        onClick={() => removeStudent(studentId)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Signataires requis */}
          <div>
            <Label>Signataires requis *</Label>
            <Select onValueChange={addSignature}>
              <SelectTrigger>
                <SelectValue placeholder="Ajouter un signataire" />
              </SelectTrigger>
              <SelectContent>
                {signatoryUsers.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.prenom} {user.nom} ({user.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {formData.requiredSignatures.length > 0 && (
              <div className="mt-3">
                <Label className="text-sm">Signataires sélectionnés ({formData.requiredSignatures.length})</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.requiredSignatures.map(userId => (
                    <Badge key={userId} variant="outline" className="flex items-center gap-1">
                      {getUserName(userId)}
                      <button
                        type="button"
                        onClick={() => removeSignature(userId)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Commentaire */}
          <div>
            <Label htmlFor="comment">Commentaire</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({...formData, comment: e.target.value})}
              placeholder="Commentaire optionnel sur cette demande..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Création...' : 'Créer la Demande'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DiplomaRequestForm;
