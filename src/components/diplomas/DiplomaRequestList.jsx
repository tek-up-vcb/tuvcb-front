import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar, User, Users, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';

const DiplomaRequestList = ({ 
  requests = [], 
  users = [], 
  students = [], 
  currentUserId,
  onSign, 
  onDelete, 
  loading = false 
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Demandes de Diplômes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Demandes de Diplômes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600">Aucune demande de diplôme</p>
            <p className="text-sm text-gray-500 mt-1">
              Créez votre première demande pour commencer
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            En attente
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="default" className="bg-green-500 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Approuvé
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rejeté
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUserName = (userIdOrAddress) => {
    // Essayer de trouver par ID d'abord
    let user = users.find(u => u.id === userIdOrAddress);
    // Si pas trouvé, essayer par adresse wallet
    if (!user) {
      user = users.find(u => u.walletAddress === userIdOrAddress);
    }
    return user ? `${user.prenom} ${user.nom}` : 'Utilisateur inconnu';
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.prenom} ${student.nom}` : 'Étudiant inconnu';
  };

  const canUserSign = (request) => {
    if (!currentUserId) return false;
    
    const isRequiredSigner = request.requiredSignatures?.includes(currentUserId);
    const hasAlreadySigned = request.signatures?.some(sig => 
      sig.userId === currentUserId && sig.isSigned
    );
    
    return isRequiredSigner && !hasAlreadySigned && request.status === 'pending';
  };

  const canUserDelete = (request) => {
    return request.createdBy === currentUserId && request.status === 'pending';
  };

  const getSignatureStatus = (request, userIdOrAddress) => {
    const signature = request.signatures?.find(sig => sig.userId === userIdOrAddress);
    return signature?.isSigned ? 'signed' : 'pending';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demandes de Diplômes ({requests.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map(request => (
            <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              {/* En-tête de la demande */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{request.diploma?.name}</h3>
                  <p className="text-sm text-gray-600">
                    {request.diploma?.level} - {request.diploma?.field}
                  </p>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(request.status)}
                  <Badge variant="outline" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {request.validSignatures}/{request.requiredSignatures?.length}
                  </Badge>
                </div>
              </div>

              {/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>Créé par: {getUserName(request.createdBy)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Le {new Date(request.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {/* Étudiants concernés */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Étudiants concernés ({request.studentIds?.length || 0})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {request.studentIds?.slice(0, 5).map(studentId => (
                    <Badge key={studentId} variant="outline" className="text-xs">
                      {getStudentName(studentId)}
                    </Badge>
                  ))}
                  {request.studentIds?.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{request.studentIds.length - 5} autres
                    </Badge>
                  )}
                </div>
              </div>

              {/* Signataires */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Signataires requis</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {request.requiredSignatures?.map(userIdOrAddress => {
                    const status = getSignatureStatus(request, userIdOrAddress);
                    return (
                      <Badge 
                        key={userIdOrAddress} 
                        variant={status === 'signed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {getUserName(userIdOrAddress)}
                        {status === 'signed' && ' ✓'}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Commentaire */}
              {request.comment && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm font-medium">Commentaire</span>
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                    {request.comment}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t">
                {canUserSign(request) && onSign && (
                  <Button
                    size="sm"
                    onClick={() => onSign(request)}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Signer
                  </Button>
                )}

                {canUserDelete(request) && onDelete && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(request.id)}
                  >
                    Supprimer
                  </Button>
                )}

                {!canUserSign(request) && !canUserDelete(request) && (
                  <span className="text-sm text-gray-500 py-1">
                    Aucune action disponible
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DiplomaRequestList;
