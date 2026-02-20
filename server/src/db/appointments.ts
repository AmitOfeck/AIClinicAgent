import { db } from './index.js'

export interface Appointment {
  id: number
  patient_name: string
  patient_email: string
  patient_phone?: string
  patient_telegram_id?: string
  service_id?: number
  service: string
  staff_id?: number
  date_time: string
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'CANCELLED'
  notes?: string
  created_at: string
  updated_at: string
}

export interface AppointmentWithDetails extends Appointment {
  staff_name?: string
  staff_specialty?: string
}

export interface CreateAppointmentInput {
  patientName: string
  patientEmail: string
  patientPhone?: string
  patientTelegramId?: string
  serviceId?: number
  service: string
  staffId?: number
  dateTime: string
  notes?: string
}

export function createAppointment(input: CreateAppointmentInput): Appointment {
  const stmt = db.prepare(`
    INSERT INTO appointments (
      patient_name, patient_email, patient_phone, patient_telegram_id,
      service_id, service, staff_id, date_time, notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const result = stmt.run(
    input.patientName,
    input.patientEmail,
    input.patientPhone || null,
    input.patientTelegramId || null,
    input.serviceId || null,
    input.service,
    input.staffId || null,
    input.dateTime,
    input.notes || null
  )

  return getAppointmentById(result.lastInsertRowid as number)!
}

export function getAppointmentById(id: number): Appointment | undefined {
  const stmt = db.prepare('SELECT * FROM appointments WHERE id = ?')
  return stmt.get(id) as Appointment | undefined
}

export function getAppointmentWithDetails(id: number): AppointmentWithDetails | undefined {
  const stmt = db.prepare(`
    SELECT a.*, s.name as staff_name, s.specialty as staff_specialty
    FROM appointments a
    LEFT JOIN staff s ON a.staff_id = s.id
    WHERE a.id = ?
  `)
  return stmt.get(id) as AppointmentWithDetails | undefined
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

export function getAppointmentsByStaffAndDate(staffId: number, date: string): Appointment[] {
  const stmt = db.prepare(`
    SELECT * FROM appointments
    WHERE staff_id = ?
    AND date(date_time) = date(?)
    AND status IN ('PENDING', 'APPROVED')
  `)
  return stmt.all(staffId, date) as Appointment[]
}

export function getPendingAppointments(): Appointment[] {
  const stmt = db.prepare("SELECT * FROM appointments WHERE status = 'PENDING' ORDER BY created_at DESC")
  return stmt.all() as Appointment[]
}

export function getPendingAppointmentsWithDetails(): AppointmentWithDetails[] {
  const stmt = db.prepare(`
    SELECT a.*, s.name as staff_name, s.specialty as staff_specialty
    FROM appointments a
    LEFT JOIN staff s ON a.staff_id = s.id
    WHERE a.status = 'PENDING'
    ORDER BY a.created_at DESC
  `)
  return stmt.all() as AppointmentWithDetails[]
}

export function getAppointmentsByStaff(staffId: number): Appointment[] {
  const stmt = db.prepare(`
    SELECT * FROM appointments
    WHERE staff_id = ?
    ORDER BY date_time DESC
  `)
  return stmt.all(staffId) as Appointment[]
}
