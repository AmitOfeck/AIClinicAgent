import Database, { Database as DatabaseType } from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, '../../data')
const dbPath = path.join(dataDir, 'clinic.db')

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

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
      name_hebrew TEXT,
      description TEXT,
      duration_minutes INTEGER NOT NULL,
      price TEXT,
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

  // Appointments table (with staff_id)
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

  // Patient preferences table (for long-term memory & re-engagement)
  db.exec(`
    CREATE TABLE IF NOT EXISTS patient_preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_email TEXT UNIQUE NOT NULL,
      patient_name TEXT,
      phone TEXT,
      whatsapp_number TEXT,
      preferences TEXT,
      interests TEXT,
      notes TEXT,
      last_interaction TEXT,
      converted INTEGER DEFAULT 0,
      preferred_channel TEXT DEFAULT 'email',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Migration: Add new columns if they don't exist (for existing databases)
  const columns = db.prepare("PRAGMA table_info(patient_preferences)").all() as { name: string }[]
  const columnNames = columns.map(c => c.name)

  if (!columnNames.includes('phone')) {
    db.exec("ALTER TABLE patient_preferences ADD COLUMN phone TEXT")
  }
  if (!columnNames.includes('whatsapp_number')) {
    db.exec("ALTER TABLE patient_preferences ADD COLUMN whatsapp_number TEXT")
  }
  if (!columnNames.includes('interests')) {
    db.exec("ALTER TABLE patient_preferences ADD COLUMN interests TEXT")
  }
  if (!columnNames.includes('last_interaction')) {
    db.exec("ALTER TABLE patient_preferences ADD COLUMN last_interaction TEXT")
  }
  if (!columnNames.includes('converted')) {
    db.exec("ALTER TABLE patient_preferences ADD COLUMN converted INTEGER DEFAULT 0")
  }
  if (!columnNames.includes('preferred_channel')) {
    db.exec("ALTER TABLE patient_preferences ADD COLUMN preferred_channel TEXT DEFAULT 'email'")
  }

  // Seed initial data if tables are empty
  seedInitialData()

  console.log('Database initialized')
}

function seedInitialData() {
  // Check if staff already exists
  const staffCount = db.prepare('SELECT COUNT(*) as count FROM staff').get() as { count: number }
  if (staffCount.count > 0) return

  console.log('Seeding initial data...')

  // Insert staff members with MOCK SCHEDULES
  const insertStaff = db.prepare(`
    INSERT INTO staff (name, role, specialty, image_url, bio, working_hours)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  const staffData = [
    {
      name: 'Dr. Ilan Ofeck',
      role: 'Chief Dentist & Clinic Director',
      specialty: 'General Dentistry, Prosthodontics, Aesthetic Dentistry',
      image_url: '/images/staff/dr-ilan-ofeck.jpg',
      bio: 'Graduated from Tel Aviv University School of Dental Medicine. Over 30 years of experience in general and aesthetic dentistry.',
      working_hours: JSON.stringify({
        sunday: ['08:00-18:00'],
        monday: ['08:00-18:00'],
        tuesday: ['08:00-18:00'],
        wednesday: ['08:00-18:00'],
        thursday: ['08:00-18:00'],
        friday: ['08:00-13:00'],
        saturday: []
      })
    },
    {
      name: 'Katy Fridman',
      role: 'Dental Hygienist',
      specialty: 'Dental Hygiene, Teeth Cleaning, Patient Education',
      image_url: '/images/staff/katy-fridman.jpg',
      bio: 'Licensed dental hygienist specializing in tartar removal and patient education on proper oral care.',
      working_hours: JSON.stringify({
        sunday: ['08:00-14:00'],
        monday: [],
        tuesday: ['08:00-14:00'],
        wednesday: [],
        thursday: ['08:00-14:00'],
        friday: [],
        saturday: []
      })
    },
    {
      name: 'Dr. Sahar Nadel',
      role: 'Oral & Maxillofacial Surgeon',
      specialty: 'Oral Surgery, Dental Implants, Periodontal Surgery',
      image_url: '/images/staff/dr-sahar-nadel.jpg',
      bio: 'Graduated from Hebrew University School of Dental Medicine (2010). Completed specialized training in oral surgery.',
      working_hours: JSON.stringify({
        sunday: [],
        monday: ['14:00-18:00'],
        tuesday: [],
        wednesday: ['14:00-18:00'],
        thursday: [],
        friday: [],
        saturday: []
      })
    },
    {
      name: 'Dr. Maayan Granit',
      role: 'Endodontist',
      specialty: 'Root Canal Treatment, Endodontics',
      image_url: '/images/staff/dr-maayan-granit.jpg',
      bio: 'Completed endodontics residency at Hebrew University in Jerusalem (2013). Specialist in root canal treatments.',
      working_hours: JSON.stringify({
        sunday: [],
        monday: ['08:00-14:00'],
        tuesday: [],
        wednesday: ['08:00-14:00'],
        thursday: [],
        friday: ['08:00-13:00'],
        saturday: []
      })
    },
    {
      name: 'Dr. Dan Zitoni',
      role: 'Dentist',
      specialty: 'General Dentistry, Restorations',
      image_url: '/images/staff/dr-dan-zitoni.jpg',
      bio: 'General dentist providing comprehensive dental care and restorative treatments.',
      working_hours: JSON.stringify({
        sunday: ['14:00-18:00'],
        monday: [],
        tuesday: ['14:00-18:00'],
        wednesday: [],
        thursday: ['14:00-18:00'],
        friday: [],
        saturday: []
      })
    },
    {
      name: 'Shir Formoza',
      role: 'Dental Hygienist',
      specialty: 'Dental Hygiene, Natural Treatment Approaches',
      image_url: '/images/staff/shir-formoza.jpg',
      bio: 'Licensed dental hygienist with a unique approach using natural treatment methods.',
      working_hours: JSON.stringify({
        sunday: [],
        monday: ['08:00-14:00'],
        tuesday: [],
        wednesday: ['08:00-14:00'],
        thursday: [],
        friday: ['08:00-13:00'],
        saturday: []
      })
    }
  ]

  for (const staff of staffData) {
    insertStaff.run(staff.name, staff.role, staff.specialty, staff.image_url, staff.bio, staff.working_hours)
  }

  // Insert services
  const insertService = db.prepare(`
    INSERT INTO services (name, name_hebrew, description, duration_minutes, category)
    VALUES (?, ?, ?, ?, ?)
  `)

  const servicesData = [
    {
      name: 'Dental Hygiene & Cleaning',
      name_hebrew: 'טיפולי שיננית',
      description: 'Professional cleaning to remove plaque and tartar buildup, stain removal, and oral hygiene guidance.',
      duration_minutes: 45,
      category: 'Preventive'
    },
    {
      name: 'Teeth Whitening',
      name_hebrew: 'הלבנת שיניים',
      description: 'Professional whitening treatment available both in-office and at-home options.',
      duration_minutes: 60,
      category: 'Aesthetic'
    },
    {
      name: 'Composite Restorations',
      name_hebrew: 'שחזורים',
      description: 'White composite fillings replacing old amalgam restorations with better aesthetics.',
      duration_minutes: 45,
      category: 'Restorative'
    },
    {
      name: 'Composite Veneers',
      name_hebrew: 'ציפויי קומפוזיט',
      description: 'Modern tooth reshaping technique with pre-visualization of results before treatment.',
      duration_minutes: 60,
      category: 'Aesthetic'
    },
    {
      name: 'Porcelain Veneers',
      name_hebrew: 'ציפויי חרסינה',
      description: 'Thin porcelain shells to close gaps, whiten, reshape, and improve smile aesthetics.',
      duration_minutes: 60,
      category: 'Aesthetic'
    },
    {
      name: 'Porcelain Crowns',
      name_hebrew: 'כתרי חרסינה',
      description: 'Complete tooth coverage for structural restoration and aesthetic improvement.',
      duration_minutes: 60,
      category: 'Restorative'
    },
    {
      name: 'Root Canal Treatment',
      name_hebrew: 'טיפולי שורש',
      description: 'Deep cleaning and filling of root canals to treat decay and inflammation, preserving the tooth.',
      duration_minutes: 90,
      category: 'Endodontics'
    },
    {
      name: 'Periodontal Surgery',
      name_hebrew: 'ניתוחי חניכיים',
      description: 'Treatment for gum disease, bacterial infections, gum recession, and bone loss.',
      duration_minutes: 90,
      category: 'Surgery'
    },
    {
      name: 'Dental Implants',
      name_hebrew: 'שתלים דנטליים',
      description: 'Titanium or zirconia implants as artificial tooth roots with 95%+ success rates.',
      duration_minutes: 120,
      category: 'Surgery'
    },
    {
      name: 'Botox Treatment',
      name_hebrew: 'בוטוקס',
      description: 'Relaxes jaw muscles to reduce teeth grinding/clenching and associated pain.',
      duration_minutes: 30,
      category: 'Aesthetic'
    }
  ]

  for (const service of servicesData) {
    insertService.run(service.name, service.name_hebrew, service.description, service.duration_minutes, service.category)
  }

  // Create staff-services relationships
  const insertStaffService = db.prepare(`
    INSERT INTO staff_services (staff_id, service_id) VALUES (?, ?)
  `)

  // Staff IDs: 1=Ofeck, 2=Katy, 3=Sahar, 4=Maayan, 5=Dan, 6=Shir
  // Service IDs: 1=Cleaning, 2=Whitening, 3=Composite Rest, 4=Composite Veneer,
  //              5=Porcelain Veneer, 6=Porcelain Crown, 7=Root Canal, 8=Perio Surgery, 9=Implants, 10=Botox

  const staffServiceRelations = [
    // Katy Fridman (2) - Hygienist
    { staffId: 2, serviceId: 1 },  // Dental Hygiene & Cleaning
    { staffId: 2, serviceId: 2 },  // Teeth Whitening

    // Shir Formoza (6) - Hygienist
    { staffId: 6, serviceId: 1 },  // Dental Hygiene & Cleaning
    { staffId: 6, serviceId: 2 },  // Teeth Whitening

    // Dr. Ilan Ofeck (1) - Chief Dentist
    { staffId: 1, serviceId: 3 },  // Composite Restorations
    { staffId: 1, serviceId: 4 },  // Composite Veneers
    { staffId: 1, serviceId: 5 },  // Porcelain Veneers
    { staffId: 1, serviceId: 6 },  // Porcelain Crowns
    { staffId: 1, serviceId: 10 }, // Botox Treatment

    // Dr. Dan Zitoni (5) - Dentist
    { staffId: 5, serviceId: 3 },  // Composite Restorations

    // Dr. Maayan Granit (4) - Endodontist
    { staffId: 4, serviceId: 7 },  // Root Canal Treatment

    // Dr. Sahar Nadel (3) - Oral Surgeon
    { staffId: 3, serviceId: 8 },  // Periodontal Surgery
    { staffId: 3, serviceId: 9 },  // Dental Implants
  ]

  for (const relation of staffServiceRelations) {
    insertStaffService.run(relation.staffId, relation.serviceId)
  }

  console.log('Initial data seeded successfully')
}
