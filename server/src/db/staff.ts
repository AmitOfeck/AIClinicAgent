import { db } from './index.js'

export interface Staff {
  id: number
  name: string
  role: string
  specialty: string | null
  image_url: string | null
  bio: string | null
  working_hours: string | null
  is_active: number
  created_at: string
  updated_at: string
}

export interface StaffWithServices extends Staff {
  services: string[]
}

export function getAllStaff(): Staff[] {
  return db.prepare(`
    SELECT * FROM staff WHERE is_active = 1 ORDER BY id
  `).all() as Staff[]
}

export function getStaffById(id: number): Staff | undefined {
  return db.prepare(`
    SELECT * FROM staff WHERE id = ? AND is_active = 1
  `).get(id) as Staff | undefined
}

export function getStaffByName(name: string): Staff | undefined {
  return db.prepare(`
    SELECT * FROM staff WHERE name LIKE ? AND is_active = 1
  `).get(`%${name}%`) as Staff | undefined
}

export function getStaffForService(serviceName: string): Staff[] {
  return db.prepare(`
    SELECT s.* FROM staff s
    JOIN staff_services ss ON s.id = ss.staff_id
    JOIN services sv ON ss.service_id = sv.id
    WHERE sv.name LIKE ? AND s.is_active = 1
  `).all(`%${serviceName}%`) as Staff[]
}

export function getStaffForServiceById(serviceId: number): Staff[] {
  return db.prepare(`
    SELECT s.* FROM staff s
    JOIN staff_services ss ON s.id = ss.staff_id
    WHERE ss.service_id = ? AND s.is_active = 1
  `).all(serviceId) as Staff[]
}

export function getStaffWithServices(): StaffWithServices[] {
  const staff = getAllStaff()
  return staff.map(s => {
    const services = db.prepare(`
      SELECT sv.name FROM services sv
      JOIN staff_services ss ON sv.id = ss.service_id
      WHERE ss.staff_id = ?
    `).all(s.id) as { name: string }[]

    return {
      ...s,
      services: services.map(svc => svc.name)
    }
  })
}

export function getStaffWorkingHours(staffId: number): Record<string, string[]> | null {
  const staff = getStaffById(staffId)
  if (!staff || !staff.working_hours) return null

  try {
    return JSON.parse(staff.working_hours)
  } catch {
    return null
  }
}

export function isStaffAvailable(staffId: number, dayOfWeek: string, time: string): boolean {
  const hours = getStaffWorkingHours(staffId)
  if (!hours) return false

  const dayHours = hours[dayOfWeek.toLowerCase()]
  if (!dayHours || dayHours.length === 0) return false

  for (const slot of dayHours) {
    const [start, end] = slot.split('-')
    if (time >= start && time < end) {
      return true
    }
  }

  return false
}
