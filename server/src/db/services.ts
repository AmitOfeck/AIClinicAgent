import { db } from './index.js'
import { Staff } from './staff.js'

export interface Service {
  id: number
  name: string
  description: string | null
  duration_minutes: number
  price: string
  category: string | null
  is_active: number
  created_at: string
  updated_at: string
}

export interface ServiceWithStaff extends Service {
  staff: { id: number; name: string }[]
}

export function getAllServices(): Service[] {
  return db.prepare(`
    SELECT * FROM services WHERE is_active = 1 ORDER BY category, name
  `).all() as Service[]
}

export function getServiceById(id: number): Service | undefined {
  return db.prepare(`
    SELECT * FROM services WHERE id = ? AND is_active = 1
  `).get(id) as Service | undefined
}

export function getServiceByName(name: string): Service | undefined {
  return db.prepare(`
    SELECT * FROM services WHERE name LIKE ? AND is_active = 1
  `).get(`%${name}%`) as Service | undefined
}

export function getServicesByCategory(category: string): Service[] {
  return db.prepare(`
    SELECT * FROM services WHERE category = ? AND is_active = 1
  `).all(category) as Service[]
}

export function getServicesWithStaff(): ServiceWithStaff[] {
  const services = getAllServices()
  return services.map(svc => {
    const staff = db.prepare(`
      SELECT s.id, s.name FROM staff s
      JOIN staff_services ss ON s.id = ss.staff_id
      WHERE ss.service_id = ? AND s.is_active = 1
    `).all(svc.id) as { id: number; name: string }[]

    return {
      ...svc,
      staff
    }
  })
}

export function getServicesForStaff(staffId: number): Service[] {
  return db.prepare(`
    SELECT sv.* FROM services sv
    JOIN staff_services ss ON sv.id = ss.service_id
    WHERE ss.staff_id = ? AND sv.is_active = 1
  `).all(staffId) as Service[]
}

export function findServiceByKeywords(keywords: string): Service | undefined {
  // Try exact match first
  let service = db.prepare(`
    SELECT * FROM services WHERE name = ? AND is_active = 1
  `).get(keywords) as Service | undefined

  if (service) return service

  // Try partial match
  service = db.prepare(`
    SELECT * FROM services WHERE name LIKE ? AND is_active = 1
  `).get(`%${keywords}%`) as Service | undefined

  if (service) return service

  // Try matching by common keywords
  const keywordMap: Record<string, string> = {
    'cleaning': 'Routine Checkup & Cleaning',
    'checkup': 'Routine Checkup & Cleaning',
    'check up': 'Routine Checkup & Cleaning',
    'whitening': 'Teeth Whitening',
    'whiten': 'Teeth Whitening',
    'root canal': 'Root Canal Treatment',
    'endodontic': 'Root Canal Treatment',
    'implant': 'Dental Implants',
    'implants': 'Dental Implants',
    'gum': 'Gum Disease Treatment',
    'periodontal': 'Gum Disease Treatment',
    'gums': 'Gum Disease Treatment',
    'kids': 'Pediatric Dentistry',
    'children': 'Pediatric Dentistry',
    'child': 'Pediatric Dentistry',
    'pediatric': 'Pediatric Dentistry',
    'cosmetic': 'Aesthetic Dentistry',
    'aesthetic': 'Aesthetic Dentistry',
    'veneer': 'Aesthetic Dentistry',
    'crown': 'Aesthetic Dentistry',
    'surgery': 'Oral Surgery',
    'extraction': 'Oral Surgery',
    'wisdom': 'Oral Surgery',
    'anxiety': 'Anxiety Management',
    'nervous': 'Anxiety Management',
    'sedation': 'Anxiety Management',
    'laughing gas': 'Anxiety Management',
    'consultation': 'General Consultation',
    'consult': 'General Consultation',
  }

  const lowerKeywords = keywords.toLowerCase()
  for (const [key, serviceName] of Object.entries(keywordMap)) {
    if (lowerKeywords.includes(key)) {
      return db.prepare(`
        SELECT * FROM services WHERE name = ? AND is_active = 1
      `).get(serviceName) as Service | undefined
    }
  }

  return undefined
}
