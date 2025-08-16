import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, XCircle } from 'lucide-react'
import studentsService from '@/services/studentsService'

export default function BulkImportPreview({
  parsedStudents,
  invalidRows,
  total,
  promotions = [],
  onCancel,
  onConfirm,
  onDone,
}) {
  const [progress, setProgress] = useState(0)
  const [isImporting, setIsImporting] = useState(false)
  const [result, setResult] = useState(null)
  const [conflicts, setConflicts] = useState([]) // [{index,type,value}]
  const [checking, setChecking] = useState(false)
  const [globalPromotionId, setGlobalPromotionId] = useState('')

  // Pre-check duplicates (ID/email) against backend
  useEffect(() => {
    const run = async () => {
      setChecking(true)
      const found = []
      for (let i = 0; i < parsedStudents.length; i++) {
        const s = parsedStudents[i]
        // Check studentId if present
        if (s.studentId) {
          try {
            await studentsService.getStudentByStudentId(s.studentId)
            found.push({ index: i, type: 'studentId', value: s.studentId })
          } catch {}
        }
        // Check email
        if (s.email) {
          try {
            await studentsService.getStudentByEmail(s.email)
            found.push({ index: i, type: 'email', value: s.email })
          } catch {}
        }
      }
      setConflicts(found)
      setChecking(false)
    }
    run()
  }, [parsedStudents])

  const [visibleItems, setVisibleItems] = useState([])
  const [rendering, setRendering] = useState(false)

  // Progressive rendering of all rows to keep UI responsive
  useEffect(() => {
    let cancelled = false
    setVisibleItems([])
    if (!parsedStudents?.length) return
    const batchSize = 25
    const total = parsedStudents.length
    setRendering(true)
    const load = async () => {
      for (let start = 0; start < total; start += batchSize) {
        if (cancelled) return
        const count = Math.min(batchSize, total - start)
        const batch = Array.from({ length: count }, (_, i) => ({ s: parsedStudents[start + i], index: start + i }))
        setVisibleItems((prev) => [...prev, ...batch])
        // Yield to event loop to avoid blocking UI between batches
        await new Promise((r) => setTimeout(r, 0))
      }
      setRendering(false)
    }
    load()
    return () => { cancelled = true }
  }, [parsedStudents])

  const startImport = async () => {
    setIsImporting(true)
    setProgress(0)
    setResult(null)
    let ok = 0
    let fail = 0
    for (let i = 0; i < parsedStudents.length; i++) {
      const s = { ...parsedStudents[i] }
      // Apply global promotion if selected
      if (globalPromotionId) {
        const setP = new Set([...(s.promotionIds || [])])
        setP.add(globalPromotionId)
        s.promotionIds = Array.from(setP)
      }
      // Skip conflicted rows
      const hasConflict = conflicts.some((c) => c.index === i)
      if (hasConflict) {
        fail++
        setProgress(Math.round(((i + 1) / parsedStudents.length) * 100))
        continue
      }
      try {
        const res = await onConfirm(s, i, parsedStudents.length)
        if (res?.success || res === true) ok++
        else fail++
      } catch (e) {
        fail++
      }
      setProgress(Math.round(((i + 1) / parsedStudents.length) * 100))
    }
    setResult({ ok, fail })
    setIsImporting(false)
  try { onDone && onDone({ ok, fail }) } catch {}
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Aperçu de l'import</h3>
        <p className="text-sm text-muted-foreground">
          {total} lignes trouvées • {parsedStudents.length} valides • {invalidRows.length} invalides
        </p>
      </div>

      {invalidRows.length > 0 && (
        <div className="p-3 rounded-md bg-amber-50 text-amber-800 text-sm">
          Certaines lignes sont invalides et seront ignorées (ex: champs manquants / email invalide).
        </div>
      )}

      <div className="border rounded-md max-h-64 overflow-auto divide-y">
        {visibleItems.map((item) => (
          <div key={`row-${item.index}`} className="p-2 text-sm flex flex-wrap gap-2 items-center">
            {conflicts.some((c) => c.index === item.index) ? (
              <XCircle className="h-4 w-4 text-red-500" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            )}
            <code className="px-1 py-0.5 bg-muted rounded">{item.s.studentId || '(auto)'}</code>
            <span className="font-medium">{item.s.prenom} {item.s.nom}</span>
            <span className="text-muted-foreground">{item.s.email}</span>
            {item.s.promotionIds?.length ? (
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                promotions: {item.s.promotionIds.join(', ')}
              </span>
            ) : null}
          </div>
        ))}
      </div>

      {rendering && (
        <p className="text-xs text-muted-foreground">Affichage des lignes… {visibleItems.length}/{parsedStudents.length}</p>
      )}

      {checking && (
        <div className="text-xs text-muted-foreground">Vérification des doublons (ID / Email)…</div>
      )}

      {isImporting ? (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-xs text-muted-foreground">Import en cours… {progress}%</p>
        </div>
      ) : result ? (
        <div className="p-3 rounded-md bg-green-50 text-green-800 text-sm">
          Import terminé: {result.ok} succès • {result.fail} échecs.
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm">
          <label className="text-muted-foreground">Global promotion</label>
          <select
            className="border rounded px-2 py-1 text-sm bg-white"
            value={globalPromotionId}
            onChange={(e) => setGlobalPromotionId(e.target.value)}
          >
            <option value="">None</option>
            {promotions.map((p) => (
              <option key={p.id} value={p.id}>{p.nom} ({p.annee})</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
        {!isImporting && (
          <Button variant="outline" onClick={onCancel} className="border-0 shadow-sm">Annuler</Button>
        )}
        {!isImporting && (
          <Button onClick={startImport} className="border-0 shadow-sm" disabled={checking}>Importer</Button>
        )}
        </div>
      </div>
    </div>
  )
}
