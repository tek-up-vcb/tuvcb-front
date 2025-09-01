import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';

const MerkleProofDialog = ({ isOpen, onClose, proof, student }) => {
  if (!isOpen) return null;
  // Affichage JSON prêt à copier/coller
  let proofJson = '';
  if (Array.isArray(proof) && proof.length > 0) {
    proofJson = JSON.stringify(proof, null, 2);
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Merkle Proof</DialogTitle>
          <DialogDescription>
            Merkle proof for student: <span className="font-semibold">{student?.nom} {student?.prenom}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto whitespace-pre-wrap max-w-full">
          <div className="font-semibold mb-1">Merkle Proof :</div>
          {(!proof || proof.length === 0) ? 'Single root (no proof)' : (
            <pre style={{wordBreak: 'break-word', whiteSpace: 'pre-line', margin: 0}}>{proofJson}</pre>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MerkleProofDialog;
