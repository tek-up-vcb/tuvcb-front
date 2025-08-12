import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle, XCircle, User, Users, Calendar } from 'lucide-react';

const SignatureDialog = ({ 
  isOpen, 
  onClose, 
  request, 
  users = [], 
  students = [], 
  onSign, 
  loading = false 
}) => {
  const [signatureData, setSignatureData] = useState({
    approve: true,
    signatureComment: '',
  });

  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await onSign(request.id, signatureData);
      // Réinitialiser le formulaire
      setSignatureData({
        approve: true,
        signatureComment: '',
      });
      onClose();
    } catch (err) {
      setError('Erreur lors de la signature');
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.prenom} ${user.nom}` : 'Utilisateur inconnu';
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.prenom} ${student.nom}` : 'Étudiant inconnu';
  };

  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {signatureData.approve ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            Signer la Demande de Diplôme
          </DialogTitle>
          <DialogDescription>
            Approuvez ou rejetez cette demande de soumission de diplôme
          </DialogDescription>
        </DialogHeader>

        {/* Informations sur la demande */}
        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">{request.diploma?.name}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Créé par: {getUserName(request.createdBy)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Le {new Date(request.createdAt).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>

          {/* Étudiants concernés */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4" />
              <span className="font-medium">Étudiants concernés ({request.studentIds?.length || 0})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {request.studentIds?.map(studentId => (
                <Badge key={studentId} variant="outline">
                  {getStudentName(studentId)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Commentaire de la demande */}
          {request.comment && (
            <div>
              <span className="font-medium text-sm">Commentaire de la demande:</span>
              <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded mt-1">
                {request.comment}
              </p>
            </div>
          )}

          {/* État des signatures */}
          <div>
            <span className="font-medium text-sm">État des signatures:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {request.requiredSignatures?.map(userId => {
                const signature = request.signatures?.find(sig => sig.userId === userId);
                const isSigned = signature?.isSigned;
                
                return (
                  <Badge 
                    key={userId} 
                    variant={isSigned ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {getUserName(userId)}
                    {isSigned && ' ✓'}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>

        {error && (
          <Alert className="mb-4" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Formulaire de signature */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="decision">Votre décision *</Label>
            <Select
              value={signatureData.approve.toString()}
              onValueChange={(value) => setSignatureData({
                ...signatureData,
                approve: value === 'true'
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Approuver la demande
                  </div>
                </SelectItem>
                <SelectItem value="false">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    Rejeter la demande
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="signatureComment">
              Commentaire {signatureData.approve ? '(optionnel)' : '(requis pour un rejet)'}
            </Label>
            <Textarea
              id="signatureComment"
              value={signatureData.signatureComment}
              onChange={(e) => setSignatureData({
                ...signatureData,
                signatureComment: e.target.value
              })}
              placeholder={
                signatureData.approve 
                  ? "Commentaire optionnel sur votre approbation..."
                  : "Veuillez expliquer les raisons du rejet..."
              }
              required={!signatureData.approve}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className={`flex-1 ${
                signatureData.approve 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-red-500 hover:bg-red-600'
              }`}
              disabled={loading}
            >
              {loading ? 'Signature...' : (
                signatureData.approve ? 'Approuver' : 'Rejeter'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureDialog;
