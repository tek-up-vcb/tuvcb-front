
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Eye } from 'lucide-react';
import { computeMerkleTree } from '../../utils/merkle';
import studentsService from '../../services/studentsService';
import MerkleProofDialog from './MerkleProofDialog';

const DiplomaReviewDialog = ({ isOpen, onClose, request }) => {
  const [studentInfos, setStudentInfos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [proofDialog, setProofDialog] = useState({ open: false, proof: null, student: null });

  useEffect(() => {
    if (!isOpen || !request) return;
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const infos = await Promise.all(
          (request.studentIds || []).map(async (id) => {
            try {
              const s = await studentsService.getStudentById(id);
              return s ? { studentId: s.studentId, nom: s.nom, prenom: s.prenom } : null;
            } catch {
              return null;
            }
          })
        );
        setStudentInfos(infos.filter(Boolean));
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [isOpen, request]);

  // Calcul du Merkle tree
  const { root, leaves, proofs } = computeMerkleTree(studentInfos);

  if (!request || !isOpen) return null;

  const handleOpenProof = (idx) => {
    setProofDialog({ open: true, proof: proofs[idx], student: studentInfos[idx] });
  };
  const handleCloseProof = () => {
    setProofDialog({ open: false, proof: null, student: null });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl w-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Merkle Review - Diplôme</DialogTitle>
            <DialogDescription>
              Ancrage sur la blockchain : vérification Merkle des étudiants du diplôme
            </DialogDescription>
          </DialogHeader>
          <div className="mb-4">
            <span className="font-semibold">Merkle Root :</span>
            <Badge className="ml-2 select-all">{root}</Badge>
          </div>
          {loading ? (
            <div className="text-center text-muted-foreground">Chargement des étudiants...</div>
          ) : (
            <div className="space-y-4">
              {studentInfos.map((s, idx) => (
                <div key={s.studentId} className="border rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <span className="font-medium">{s.nom} {s.prenom}</span> <span className="text-xs text-muted-foreground">(ID: {s.studentId})</span>
                    <div className="text-xs mt-1">Hash: <span className="select-all font-mono">{leaves[idx]}</span></div>
                  </div>
                  <Button size="icon" variant="outline" onClick={() => handleOpenProof(idx)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <MerkleProofDialog
        isOpen={proofDialog.open}
        onClose={handleCloseProof}
        proof={proofDialog.proof}
        student={proofDialog.student}
      />
    </>
  );
};

export default DiplomaReviewDialog;
