import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';

const MerkleProofDialog = ({ isOpen, onClose, proof, student }) => {
  if (!isOpen) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Merkle Proof</DialogTitle>
          <DialogDescription>
            Preuve Merkle pour l'étudiant : <span className="font-semibold">{student?.nom} {student?.prenom}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto whitespace-pre-wrap max-w-full">
          <div className="font-semibold mb-1">Merkle Proof :</div>
          {proof?.length === 0 ? 'Racine unique (pas de preuve)' : (
            <div style={{wordBreak: 'break-word', whiteSpace: 'pre-line'}}>
              {proof?.join('\n')}
            </div>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>Fermer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MerkleProofDialog;
