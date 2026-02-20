import { db } from './index.js'

export interface Appointment {
  id: number
  patient_name: string
  patient_email: string
  patient_phone?: string
  patient_telegram_id?: string
  service: string
  date_time: string
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'CANCELLED'
  notes?: string
  created_at: string
  updated_at: string
}

export interface CreateAppointmentInput {
  patientName: string
  patientEmail: string
  patientPhone?: string
  patientTelegramId?: string
  service: string
  dateTime: string
  notes?: string
}

export function createAppointment(input: CreateAppointmentInput): Appointment {
  const stmt = db.prepare(`
    INSERT INTO appointments (patient_name, patient_email, patient_phone, patient_telegram_id, service, date_time, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  const result = stmt.run(
    input.patientName,
    input.patientEmail,
    input.patientPhone || null,
    input.patientTelegramId || null,
    input.service,
    input.dateTime,
    input.notes || null
  )

  return getAppointmentById(result.lastInsertRowid as number)!
}

export function getAppointmentById(id: number): Appointment | undefined {
  const stmt = db.prepare('SELECT * FROM appointments WHERE id = ?')
  return stmt.get(id) as Appointment | undefined
}

export function updateAppointmentStatus(id: number, status: Appointment['status']): Appointment | undefined {
  const stmt = db.prepare(`
    UPDATE appointments
    SET status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `)
  stmt.run(status, id)
  return getAppointmentById(id)
}

export function getAppointmentsByEmail(email: string): Appointment[] {
  const stmt = db.prepare('SELECT * FROM appointments WHERE patient_email = ? ORDER BY date_time DESC')
  return stmt.all(email) as Appointment[]
}

export function getAppointmentsByDate(date: string): Appointment[] {
  const stmt = db.prepare("SELECT * FROM appointments WHERE date(date_time) = date(?) AND status != 'CANCELLED'")
  return stmt.all(date) as Appointment[]
}

export function getPendingAppointments(): Appointment[] {
  const stmt = db.prepare("SELECT * FROM appointments WHERE status = 'PENDING' ORDER BY created_at DESC")
  return stmt.all() as Appointment[]
}
