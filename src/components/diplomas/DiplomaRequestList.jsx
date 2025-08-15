import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar, User, Users, MessageSquare, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';

const DiplomaRequestList = ({ 
  requests = [], 
  users = [], 
  students = [], 
  currentUserId,
  onSign, 
  onDelete,
  onCreateNew,
  loading = false 
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-semibold">Diploma Requests</CardTitle>
              <CardDescription>Manage diploma submission requests</CardDescription>
            </div>
            {onCreateNew && (
              <Button onClick={onCreateNew} className="gap-2">
                <Plus className="h-4 w-4" />
                New Request
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-semibold">Diploma Requests</CardTitle>
              <CardDescription>Manage diploma submission requests</CardDescription>
            </div>
            {onCreateNew && (
              <Button onClick={onCreateNew} className="gap-2">
                <Plus className="h-4 w-4" />
                New Request
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No diploma requests</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first request to get started
            </p>
            {onCreateNew && (
              <Button onClick={onCreateNew} className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Create Request
              </Button>
            )}
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
            Pending
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="default" className="bg-green-500 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUserName = (userIdOrAddress) => {
    // Try to find by ID first
    let user = users.find(u => u.id === userIdOrAddress);
    // If not found, try by wallet address
    if (!user) {
      user = users.find(u => u.walletAddress === userIdOrAddress);
    }
    return user ? `${user.prenom} ${user.nom}` : 'Unknown user';
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.prenom} ${student.nom}` : 'Unknown student';
  };

  const canUserSign = (request) => {
    console.log('=== CAN USER SIGN CHECK ===');
    console.log('currentUserId received:', currentUserId);
    console.log('request.requiredSignatures:', request.requiredSignatures);
    
    if (!currentUserId) {
      console.log('❌ No currentUserId - cannot sign');
      return false;
    }
    
    const isRequiredSigner = request.requiredSignatures?.includes(currentUserId);
    console.log('✅ isRequiredSigner:', isRequiredSigner);
    
    if (!isRequiredSigner) {
      console.log('❌ User not in required signers');
      return false;
    }
    
    const hasAlreadySigned = request.signatures?.some(sig => 
      sig.userId === currentUserId && sig.isSigned
    );
    console.log('hasAlreadySigned:', hasAlreadySigned);
    
    const canSign = isRequiredSigner && !hasAlreadySigned && request.status === 'pending';
    console.log('🎯 Final result - canSign:', canSign);
    
    return canSign;
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
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-semibold">Diploma Requests ({requests.length})</CardTitle>
            <CardDescription>Manage diploma submission requests</CardDescription>
          </div>
          {onCreateNew && (
            <Button onClick={onCreateNew} className="gap-2">
              <Plus className="h-4 w-4" />
              New Request
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {requests.map(request => (
            <div key={request.id} className="bg-card border border-0 rounded-lg p-4 hover:bg-muted/50 transition-all duration-200">
              {/* Request header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{request.diploma?.name}</h3>
                  <p className="text-sm text-muted-foreground">
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

              {/* Basic information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>Created by: {getUserName(request.createdBy)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>On {new Date(request.createdAt).toLocaleDateString('en-US')}</span>
                </div>
              </div>

              {/* Concerned students */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Concerned students ({request.studentIds?.length || 0})
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
                      +{request.studentIds.length - 5} others
                    </Badge>
                  )}
                </div>
              </div>

              {/* Signatories */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Required signatories</span>
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

              {/* Comment */}
              {request.comment && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm font-medium">Comment</span>
                  </div>
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded border border-border">
                    {request.comment}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-border">
                {canUserSign(request) && onSign && (
                  <Button
                    size="sm"
                    onClick={() => onSign(request)}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Sign
                  </Button>
                )}

                {canUserDelete(request) && onDelete && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(request.id)}
                  >
                    Delete
                  </Button>
                )}

                {!canUserSign(request) && !canUserDelete(request) && (
                  <span className="text-sm text-gray-500 py-1">
                    No actions available
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
