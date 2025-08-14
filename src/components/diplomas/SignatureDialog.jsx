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
      // Reset form
      setSignatureData({
        approve: true,
        signatureComment: '',
      });
      onClose();
    } catch (err) {
      setError('Error during signature');
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.prenom} ${user.nom}` : 'Unknown user';
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.prenom} ${student.nom}` : 'Unknown student';
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
            Sign Diploma Request
          </DialogTitle>
          <DialogDescription>
            Approve or reject this diploma submission request
          </DialogDescription>
        </DialogHeader>

        {/* Request information */}
        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">{request.diploma?.name}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Created by: {getUserName(request.createdBy)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>On {new Date(request.createdAt).toLocaleDateString('en-US')}</span>
              </div>
            </div>
          </div>

          {/* Concerned students */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4" />
              <span className="font-medium">Concerned students ({request.studentIds?.length || 0})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {request.studentIds?.map(studentId => (
                <Badge key={studentId} variant="outline">
                  {getStudentName(studentId)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Request comment */}
          {request.comment && (
            <div>
              <span className="font-medium text-sm">Request comment:</span>
              <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded mt-1">
                {request.comment}
              </p>
            </div>
          )}

          {/* Signature status */}
          <div>
            <span className="font-medium text-sm">Signature status:</span>
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

        {/* Signature form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="decision">Your decision *</Label>
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
                    Approve request
                  </div>
                </SelectItem>
                <SelectItem value="false">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    Reject request
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="signatureComment">
              Comment {signatureData.approve ? '(optional)' : '(required for rejection)'}
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
                  ? "Optional comment on your approval..."
                  : "Please explain the reasons for rejection..."
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
              Cancel
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
              {loading ? 'Signing...' : (
                signatureData.approve ? 'Approve' : 'Reject'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureDialog;
