// Utilities to parse CSV/Excel files into student objects
// Expected columns (case-insensitive, header-based):
// studentId, nom, prenom, email, promotionIds (comma-separated) OR promotion (single)

import Papa from 'papaparse'
import * as XLSX from 'xlsx'

const normalizeHeader = (h) => (h || '').toString().trim().toLowerCase()

function mapRowToStudent(row) {
  const get = (k) => row[k] ?? row[k.toUpperCase()] ?? row[k.toLowerCase()]

  const rawStudentId = get('studentId') ?? get('student_id') ?? get('id etudiant') ?? get('id étudiant')
  const rawNom = get('lastName') ?? get('lastname') ?? get('last_name') ?? get('nom')
  const rawPrenom = get('firstName') ?? get('firstname') ?? get('first_name') ?? get('prenom')
  const rawEmail = get('email')
  const rawPromotionIds = get('promotionIds') ?? get('promotion_ids')
  const rawPromotion = get('promotion')

  const promotionIds = []
  if (rawPromotionIds) {
    rawPromotionIds
      .toString()
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((id) => promotionIds.push(id))
  }

  // If the file provides a single promotion name or id in "promotion"
  if (rawPromotion && !promotionIds.length) {
    promotionIds.push(rawPromotion.toString().trim())
  }

  return {
    studentId: (rawStudentId || '').toString().trim(),
    nom: (rawNom || '').toString().trim(),
    prenom: (rawPrenom || '').toString().trim(),
    email: (rawEmail || '').toString().trim(),
    promotionIds,
  }
}

function validateStudent(s) {
  const errors = []
  if (!s.nom) errors.push('nom manquant')
  if (!s.prenom) errors.push('prenom manquant')
  if (!s.email) errors.push('email manquant')
  // studentId peut être auto-généré côté UI si vide
  if (s.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email)) errors.push('email invalide')
  return { ok: errors.length === 0, errors }
}

export async function parseStudentsFile(file) {
  const ext = file.name.split('.').pop().toLowerCase()

  if (ext === 'csv') {
    const text = await file.text()
    const { data, errors, meta } = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => normalizeHeader(h),
    })
    if (errors && errors.length) {
      throw new Error(`CSV invalide: ${errors[0].message}`)
    }
    const students = data.map(mapRowToStudent)
    return postProcess(students)
  }

  if (ext === 'xlsx' || ext === 'xls') {
    const buf = await file.arrayBuffer()
    const wb = XLSX.read(buf, { type: 'array' })
    const sheetName = wb.SheetNames[0]
    const ws = wb.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json(ws, { defval: '' })
    const students = rows.map((row) => {
      // Normalize keys to lower for mapping
      const norm = {}
      Object.keys(row).forEach((k) => {
        norm[normalizeHeader(k)] = row[k]
      })
      return mapRowToStudent(norm)
    })
    return postProcess(students)
  }

  throw new Error('Format non supporté. Utilisez CSV ou Excel (.xlsx)')
}

function postProcess(students) {
  const parsed = []
  const invalid = []
  for (const s of students) {
    const { ok, errors } = validateStudent(s)
    if (ok) parsed.push(s)
    else invalid.push({ student: s, errors })
  }
  return { parsed, invalid, total: students.length }
}

export function buildTemplateWorkbook(promotions = []) {
  // Return an xlsx workbook binary with header row and example
  const headers = ['studentId', 'lastName', 'firstName', 'email', 'promotionIds']
  const example = {
    studentId: 'ABC123',
    lastName: 'Doe',
    firstName: 'John',
    email: 'john.doe@example.com',
    promotionIds: 'PROMO2025,PROMO2026',
  }
  const ws = XLSX.utils.json_to_sheet([example], { header: headers })
  // Ensure header order
  XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A1' })
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Etudiants')

  // Add indicative promotions sheet (ignored by import)
  try {
    const promoRows = promotions && promotions.length
      ? promotions.map((p) => ({ id: p.id, nom: p.nom, annee: p.annee }))
      : [{ id: 'PROMO2025', nom: 'Informatique', annee: new Date().getFullYear() }]
    const ws2 = XLSX.utils.json_to_sheet(promoRows, { header: ['id', 'nom', 'annee'] })
    XLSX.utils.book_append_sheet(wb, ws2, 'Promotions (indicatif)')
  } catch { /* noop */ }
  return wb
}

export function downloadTemplate(promotions, filename = 'students-template.xlsx') {
  const wb = buildTemplateWorkbook(promotions)
  XLSX.writeFile(wb, filename)
}
