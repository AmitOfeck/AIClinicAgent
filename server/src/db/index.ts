import Database, { Database as DatabaseType } from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '../../data/clinic.db')

export const db: DatabaseType = new Database(dbPath)

export function initDatabase() {
  // Staff members table
  db.exec(`
    CREATE TABLE IF NOT EXISTS staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      specialty TEXT,
      image_url TEXT,
      bio TEXT,
      working_hours TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Services table
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      duration_minutes INTEGER NOT NULL,
      price TEXT NOT NULL,
      category TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Staff-Services relationship table (many-to-many)
  db.exec(`
    CREATE TABLE IF NOT EXISTS staff_services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      staff_id INTEGER NOT NULL,
      service_id INTEGER NOT NULL,
      FOREIGN KEY (staff_id) REFERENCES staff(id),
      FOREIGN KEY (service_id) REFERENCES services(id),
      UNIQUE(staff_id, service_id)
    )
  `)

  // Appointments table (updated with staff_id)
  db.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_name TEXT NOT NULL,
      patient_email TEXT NOT NULL,
      patient_phone TEXT,
      patient_telegram_id TEXT,
      service_id INTEGER,
      service TEXT NOT NULL,
      staff_id INTEGER,
      date_time TEXT NOT NULL,
      status TEXT DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'APPROVED', 'DECLINED', 'CANCELLED')),
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (service_id) REFERENCES services(id),
      FOREIGN KEY (staff_id) REFERENCES staff(id)
    )
  `)

  // Patient preferences table (for long-term memory)
  db.exec(`
    CREATE TABLE IF NOT EXISTS patient_preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_email TEXT UNIQUE NOT NULL,
      patient_name TEXT,
      preferences TEXT,
      notes TEXT,
      last_visit TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Conversation history table (for context)
  db.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      patient_email TEXT,
      messages TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Seed initial data if tables are empty
  seedInitialData()

  console.log('Database initialized')
}

function seedInitialData() {
  // Check if staff already exists
  const staffCount = db.prepare('SELECT COUNT(*) as count FROM staff').get() as { count: number }
  if (staffCount.count > 0) return

  console.log('Seeding initial data...')

  // Insert staff members
  const insertStaff = db.prepare(`
    INSERT INTO staff (name, role, specialty, image_url, bio, working_hours)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  const defaultHours = JSON.stringify({
    sunday: ['08:00-18:00'],
    monday: ['08:00-18:00'],
    tuesday: ['08:00-18:00'],
    wednesday: ['08:00-18:00'],
    thursday: ['08:00-18:00'],
    friday: ['08:00-13:00'],
    saturday: []
  })

  const staffData = [
    {
      name: 'Dr. Ilan Ofeck',
      role: 'Lead Dentist',
      specialty: 'General Dentistry, Prosthodontics',
      image_url: '/images/staff/dr-ofeck.jpg',
      bio: 'Graduate of Tel Aviv University School of Dental Medicine with over 30 years of experience. Specializes in general dentistry and prosthodontics with a gentle, patient-focused approach.',
      working_hours: defaultHours
    },
    {
      name: 'Endodontic Specialist',
      role: 'Specialist',
      specialty: 'Endodontics',
      image_url: '/images/staff/endodontist.jpg',
      bio: 'Our endodontic specialist handles all root canal treatments with precision and care, using the latest techniques for optimal outcomes.',
      working_hours: defaultHours
    },
    {
      name: 'Periodontal Specialist',
      role: 'Specialist',
      specialty: 'Periodontics',
      image_url: '/images/staff/periodontist.jpg',
      bio: 'Specializing in gum disease treatment and prevention, including natural herbal therapies for healthier gums.',
      working_hours: defaultHours
    },
    {
      name: 'Oral Surgeon',
      role: 'Specialist',
      specialty: 'Oral Surgery',
      image_url: '/images/staff/oral-surgeon.jpg',
      bio: 'Our oral and maxillofacial surgeon performs implants, extractions, and other surgical procedures with expertise.',
      working_hours: defaultHours
    },
    {
      name: 'Pediatric Dentist',
      role: 'Specialist',
      specialty: 'Pediatrics',
      image_url: '/images/staff/pediatric-dentist.jpg',
      bio: 'Making dental visits fun for kids! Our pediatric dentist creates positive experiences for young patients.',
      working_hours: defaultHours
    },
    {
      name: 'Dental Hygienist',
      role: 'Hygienist',
      specialty: 'Dental Hygiene',
      image_url: '/images/staff/hygienist.jpg',
      bio: 'Dedicated to patient comfort and education, providing thorough cleanings and personalized oral health guidance.',
      working_hours: defaultHours
    }
  ]

  for (const staff of staffData) {
    insertStaff.run(staff.name, staff.role, staff.specialty, staff.image_url, staff.bio, staff.working_hours)
  }

  // Insert services
  const insertService = db.prepare(`
    INSERT INTO services (name, description, duration_minutes, price, category)
    VALUES (?, ?, ?, ?, ?)
  `)

  const servicesData = [
    {
      name: 'Routine Checkup & Cleaning',
      description: 'Comprehensive oral examination and professional cleaning by our dental hygienist. Includes plaque removal, polishing, and personalized care recommendations.',
      duration_minutes: 30,
      price: '₪250',
      category: 'General'
    },
    {
      name: 'Teeth Whitening',
      description: 'Professional in-office whitening treatment for a brighter, more confident smile. Safe and effective results in just one session.',
      duration_minutes: 60,
      price: '₪800',
      category: 'Cosmetic'
    },
    {
      name: 'Root Canal Treatment',
      description: 'Expert endodontic treatment to save an infected tooth. Modern techniques ensure minimal discomfort and excellent outcomes.',
      duration_minutes: 90,
      price: '₪1,500',
      category: 'Specialist'
    },
    {
      name: 'Dental Implants',
      description: 'State-of-the-art implant placement by our oral surgeon. A permanent solution to replace missing teeth that looks and feels natural.',
      duration_minutes: 120,
      price: 'From ₪4,500',
      category: 'Specialist'
    },
    {
      name: 'Gum Disease Treatment',
      description: 'Periodontal therapy including natural herbal treatments. We treat all stages of gum disease to restore your oral health.',
      duration_minutes: 60,
      price: 'From ₪400',
      category: 'Specialist'
    },
    {
      name: 'Pediatric Dentistry',
      description: 'Gentle, child-friendly dental care. We make dental visits fun and stress-free for your little ones.',
      duration_minutes: 30,
      price: '₪200',
      category: 'General'
    },
    {
      name: 'Aesthetic Dentistry',
      description: 'Transform your smile with crowns, veneers, and other cosmetic treatments. Custom-designed for natural, beautiful results.',
      duration_minutes: 60,
      price: 'From ₪1,200',
      category: 'Cosmetic'
    },
    {
      name: 'Oral Surgery',
      description: 'Expert surgical procedures including wisdom teeth removal and complex extractions.',
      duration_minutes: 60,
      price: 'From ₪500',
      category: 'Specialist'
    },
    {
      name: 'Anxiety Management',
      description: 'Nitrous oxide (laughing gas) sedation for anxious patients. Relax and feel comfortable during your dental treatment.',
      duration_minutes: 0,
      price: '₪150',
      category: 'Add-on'
    },
    {
      name: 'General Consultation',
      description: 'Meet with Dr. Ofeck to discuss your dental health, treatment options, and create a personalized care plan.',
      duration_minutes: 20,
      price: '₪150',
      category: 'General'
    }
  ]

  for (const service of servicesData) {
    insertService.run(service.name, service.description, service.duration_minutes, service.price, service.category)
  }

  // Create staff-services relationships
  const insertStaffService = db.prepare(`
    INSERT INTO staff_services (staff_id, service_id) VALUES (?, ?)
  `)

  // Staff ID mapping (based on insert order):
  // 1: Dr. Ofeck, 2: Endodontist, 3: Periodontist, 4: Oral Surgeon, 5: Pediatric, 6: Hygienist

  // Service ID mapping:
  // 1: Checkup, 2: Whitening, 3: Root Canal, 4: Implants, 5: Gum Disease
  // 6: Pediatric, 7: Aesthetic, 8: Oral Surgery, 9: Anxiety, 10: Consultation

  const staffServiceRelations = [
    // Dr. Ofeck (1) - General Consultation, Aesthetic
    { staffId: 1, serviceId: 7 },  // Aesthetic Dentistry
    { staffId: 1, serviceId: 10 }, // General Consultation

    // Endodontist (2) - Root Canal
    { staffId: 2, serviceId: 3 },  // Root Canal Treatment

    // Periodontist (3) - Gum Disease
    { staffId: 3, serviceId: 5 },  // Gum Disease Treatment

    // Oral Surgeon (4) - Implants, Oral Surgery
    { staffId: 4, serviceId: 4 },  // Dental Implants
    { staffId: 4, serviceId: 8 },  // Oral Surgery

    // Pediatric Dentist (5) - Pediatric Dentistry
    { staffId: 5, serviceId: 6 },  // Pediatric Dentistry

    // Hygienist (6) - Checkup, Whitening
    { staffId: 6, serviceId: 1 },  // Routine Checkup & Cleaning
    { staffId: 6, serviceId: 2 },  // Teeth Whitening
  ]

  for (const relation of staffServiceRelations) {
    insertStaffService.run(relation.staffId, relation.serviceId)
  }

  console.log('Initial data seeded successfully')
}
