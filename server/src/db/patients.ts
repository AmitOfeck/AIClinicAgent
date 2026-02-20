import { db } from './index.js'

export interface PatientPreferences {
  id: number
  patient_email: string
  patient_name?: string
  preferences?: string
  notes?: string
  last_visit?: string
  created_at: string
  updated_at: string
}

export function getPatientByEmail(email: string): PatientPreferences | undefined {
  const stmt = db.prepare('SELECT * FROM patient_preferences WHERE patient_email = ?')
  return stmt.get(email) as PatientPreferences | undefined
}

export function upsertPatientPreferences(
  email: string,
  data: { name?: string; preferences?: string; notes?: string }
): PatientPreferences {
  const existing = getPatientByEmail(email)

  if (existing) {
    const stmt = db.prepare(`
      UPDATE patient_preferences
      SET patient_name = COALESCE(?, patient_name),
          preferences = COALESCE(?, preferences),
          notes = COALESCE(?, notes),
          last_visit = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE patient_email = ?
    `)
    stmt.run(data.name || null, data.preferences || null, data.notes || null, email)
  } else {
    const stmt = db.prepare(`
      INSERT INTO patient_preferences (patient_email, patient_name, preferences, notes, last_visit)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `)
    stmt.run(email, data.name || null, data.preferences || null, data.notes || null)
  }

  return getPatientByEmail(email)!
}

export function addPatientNote(email: string, note: string): void {
  const patient = getPatientByEmail(email)
  const existingNotes = patient?.notes ? JSON.parse(patient.notes) : []
  existingNotes.push({ note, timestamp: new Date().toISOString() })

  upsertPatientPreferences(email, { notes: JSON.stringify(existingNotes) })
}
