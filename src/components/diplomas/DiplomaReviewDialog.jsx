
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Eye } from 'lucide-react';
import studentsService from '../../services/studentsService';
import { keccak256 } from 'js-sha3';

const DiplomaReviewDialog = ({ isOpen, onClose, request }) => {
  const [studentInfos, setStudentInfos] = useState([]); // données brutes étudiants
  const [loading, setLoading] = useState(false);
  const [detailDialog, setDetailDialog] = useState({ open: false, json: null, hash: null, student: null });

  useEffect(() => {
    if (!isOpen || !request) return;
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const infos = await Promise.all(
          (request.studentIds || []).map(async (id) => {
            try {
              const s = await studentsService.getStudentById(id);
              if (!s) return null;
              return {
                studentId: s.studentId || s.id,
                nom: s.nom,
                prenom: s.prenom,
              };
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

  // Génération des JSON + hash pour chaque étudiant
  const studentArtifacts = studentInfos.map((s) => {
    const salt = keccak256(Math.random().toString(36) + Date.now() + s.studentId).slice(0, 32); // 32 hex chars
    const artifact = {
      schema: 'v1',
      id: s.studentId,
      nom: s.nom,
      prenom: s.prenom,
      diploma: request?.diploma?.name || null,
      salt,
    };
    const jsonStr = JSON.stringify(artifact);
    const hash = keccak256(jsonStr);
    return { artifact, jsonStr: JSON.stringify(artifact, null, 2), hash };
  });

  if (!request || !isOpen) return null;

  const handleOpenDetails = (idx) => {
    const student = studentInfos[idx];
    const { jsonStr, hash } = studentArtifacts[idx];
    setDetailDialog({ open: true, json: jsonStr, hash, student });
  };
  const handleCloseDetails = () => {
    setDetailDialog({ open: false, json: null, hash: null, student: null });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl w-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Diplôme - Artefacts Étudiants</DialogTitle>
            <DialogDescription>
              Génération d'un artefact JSON (hashé par keccak256) pour chaque étudiant du diplôme.
            </DialogDescription>
          </DialogHeader>
          {loading ? (
            <div className="text-center text-muted-foreground">Chargement des étudiants...</div>
          ) : (
            <div className="space-y-4">
              {studentInfos.map((s, idx) => (
                <div key={s.studentId} className="border rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">{s.nom} {s.prenom}</span>{' '}
                        <span className="text-xs text-muted-foreground">(ID: {s.studentId})</span>
                      </div>
                      <Badge variant="outline" className="font-mono text-[10px] break-all max-w-[260px]">{studentArtifacts[idx].hash}</Badge>
                    </div>
                    {/* Promotion et année retirées */}
                  </div>
                  <Button size="icon" variant="outline" onClick={() => handleOpenDetails(idx)} title="Voir l'artefact JSON">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={detailDialog.open} onOpenChange={handleCloseDetails}>
        <DialogContent className="max-w-3xl w-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Artefact Étudiant</DialogTitle>
            <DialogDescription>
              {detailDialog.student ? `${detailDialog.student.nom} ${detailDialog.student.prenom}` : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="mb-4 text-xs">
            <span className="font-semibold">Hash (keccak256 du JSON): </span>
            <span className="font-mono select-all break-all">{detailDialog.hash}</span>
          </div>
          <pre className="bg-muted p-3 rounded text-xs font-mono overflow-x-auto whitespace-pre-wrap break-words">
{detailDialog.json}
          </pre>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                if (detailDialog.json) {
                  navigator.clipboard.writeText(detailDialog.json);
                }
              }}
            >Copier JSON</Button>
            <Button variant="default" onClick={handleCloseDetails}>Fermer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DiplomaReviewDialog;
