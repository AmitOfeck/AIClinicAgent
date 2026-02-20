import { db } from './index.js'

export interface PatientPreferences {
  id: number
  patient_email: string
  patient_name?: string
  phone?: string
  whatsapp_number?: string
  preferences?: string
  interests?: string
  notes?: string
  last_interaction?: string
  converted: number
  preferred_channel: string
  created_at: string
  updated_at: string
}

export function getPatientByEmail(email: string): PatientPreferences | undefined {
  const stmt = db.prepare('SELECT * FROM patient_preferences WHERE patient_email = ?')
  return stmt.get(email) as PatientPreferences | undefined
}

export function upsertPatientPreferences(
  email: string,
  data: { name?: string; phone?: string; whatsapp?: string; preferences?: string; notes?: string }
): PatientPreferences {
  const existing = getPatientByEmail(email)

  if (existing) {
    const stmt = db.prepare(`
      UPDATE patient_preferences
      SET patient_name = COALESCE(?, patient_name),
          phone = COALESCE(?, phone),
          whatsapp_number = COALESCE(?, whatsapp_number),
          preferences = COALESCE(?, preferences),
          notes = COALESCE(?, notes),
          last_interaction = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE patient_email = ?
    `)
    stmt.run(
      data.name || null,
      data.phone || null,
      data.whatsapp || null,
      data.preferences || null,
      data.notes || null,
      email
    )
  } else {
    const stmt = db.prepare(`
      INSERT INTO patient_preferences (patient_email, patient_name, phone, whatsapp_number, preferences, notes, last_interaction)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `)
    stmt.run(
      email,
      data.name || null,
      data.phone || null,
      data.whatsapp || null,
      data.preferences || null,
      data.notes || null
    )
  }

  return getPatientByEmail(email)!
}

export function trackPatientInteraction(email: string): void {
  const existing = getPatientByEmail(email)

  if (existing) {
    db.prepare(`
      UPDATE patient_preferences
      SET last_interaction = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE patient_email = ?
    `).run(email)
  } else {
    db.prepare(`
      INSERT INTO patient_preferences (patient_email, last_interaction)
      VALUES (?, CURRENT_TIMESTAMP)
    `).run(email)
  }
}

export function addPatientInterest(email: string, serviceName: string): void {
  const patient = getPatientByEmail(email)
  const existingInterests: string[] = patient?.interests ? JSON.parse(patient.interests) : []

  if (!existingInterests.includes(serviceName)) {
    existingInterests.push(serviceName)
    db.prepare(`
      UPDATE patient_preferences
      SET interests = ?,
          last_interaction = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE patient_email = ?
    `).run(JSON.stringify(existingInterests), email)
  }
}

export function markPatientConverted(email: string): void {
  db.prepare(`
    UPDATE patient_preferences
    SET converted = 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE patient_email = ?
  `).run(email)
}

export function getPatientsForReengagement(daysSinceLastContact: number = 30): PatientPreferences[] {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysSinceLastContact)

  return db.prepare(`
    SELECT * FROM patient_preferences
    WHERE last_interaction < ?
    AND converted = 0
    ORDER BY last_interaction ASC
  `).all(cutoffDate.toISOString()) as PatientPreferences[]
}

export function getConvertedPatients(): PatientPreferences[] {
  return db.prepare(`
    SELECT * FROM patient_preferences
    WHERE converted = 1
    ORDER BY last_interaction DESC
  `).all() as PatientPreferences[]
}
