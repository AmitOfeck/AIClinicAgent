import type { Service, ServiceCategory } from '@/types/clinic';

export const SERVICES: Service[] = [
  {
    id: 'dental-hygiene',
    name: 'Dental Hygiene & Cleaning',
    nameHebrew: 'ניקוי שיניים',
    category: 'Preventive',
    duration: 45,
    description: 'Professional cleaning to remove tartar, plaque, and stains. Includes a thorough examination to maintain optimal oral health.',
    includes: ['Tartar removal', 'Polishing', 'Fluoride treatment', 'Gum health assessment'],
    staff: ['Katy Fridman', 'Shir Formoza'],
  },
  {
    id: 'teeth-whitening',
    name: 'Teeth Whitening',
    nameHebrew: 'הלבנת שיניים',
    category: 'Aesthetic',
    duration: 60,
    description: 'Professional in-office whitening treatment for a brighter, more confident smile. Safe and effective results.',
    includes: ['Consultation', 'Professional whitening gel', 'LED activation', 'Take-home maintenance kit'],
    staff: ['Katy Fridman', 'Shir Formoza'],
  },
  {
    id: 'composite-veneers',
    name: 'Composite Veneers',
    nameHebrew: 'ציפויי קומפוזיט',
    category: 'Aesthetic',
    duration: 60,
    description: 'Modern tooth reshaping technique with composite resin. Minimally invasive with immediate results.',
    includes: ['Digital smile preview', 'Tooth preparation', 'Custom composite application', 'Polish and finish'],
    staff: ['Dr. Ilan Ofeck'],
  },
  {
    id: 'porcelain-veneers',
    name: 'Porcelain Veneers',
    nameHebrew: 'ציפויי חרסינה',
    category: 'Aesthetic',
    duration: 60,
    description: 'Thin porcelain shells custom-made to cover the front surface of teeth. Perfect for closing gaps and creating a beautiful smile.',
    includes: ['Consultation', 'Digital design', 'Custom lab fabrication', 'Professional bonding'],
    staff: ['Dr. Ilan Ofeck'],
  },
  {
    id: 'composite-restorations',
    name: 'Composite Restorations',
    nameHebrew: 'סתימות קומפוזיט',
    category: 'Restorative',
    duration: 45,
    description: 'Tooth-colored fillings that blend naturally with your teeth. Replace old amalgam fillings or treat new cavities.',
    includes: ['Decay removal', 'Tooth preparation', 'Composite filling', 'Shaping and polishing'],
    staff: ['Dr. Ilan Ofeck', 'Dr. Dan Zitoni'],
  },
  {
    id: 'porcelain-crowns',
    name: 'Porcelain Crowns',
    nameHebrew: 'כתרי חרסינה',
    category: 'Restorative',
    duration: 60,
    description: 'Full coverage restoration for damaged or weakened teeth. Custom-made for a natural look and perfect fit.',
    includes: ['Tooth preparation', 'Digital impression', 'Temporary crown', 'Final crown placement'],
    staff: ['Dr. Ilan Ofeck'],
  },
  {
    id: 'root-canal',
    name: 'Root Canal Treatment',
    nameHebrew: 'טיפול שורש',
    category: 'Endodontics',
    duration: 90,
    description: 'Advanced endodontic treatment to save infected teeth. Performed with modern techniques for maximum comfort.',
    includes: ['Digital X-rays', 'Local anesthesia', 'Canal cleaning and shaping', 'Permanent filling'],
    staff: ['Dr. Maayan Granit'],
  },
  {
    id: 'periodontal-surgery',
    name: 'Periodontal Surgery',
    nameHebrew: 'ניתוח חניכיים',
    category: 'Surgery',
    duration: 90,
    description: 'Surgical treatment for advanced gum disease. Restore gum health and prevent tooth loss.',
    includes: ['Comprehensive evaluation', 'Surgical treatment', 'Post-op care instructions', 'Follow-up visits'],
    staff: ['Dr. Sahar Nadel'],
  },
  {
    id: 'dental-implants',
    name: 'Dental Implants',
    nameHebrew: 'שתלים דנטליים',
    category: 'Surgery',
    duration: 120,
    description: 'Permanent tooth replacement with titanium or zirconia implants. Over 95% success rate with proper care.',
    includes: ['3D CT scan', 'Surgical implant placement', 'Healing period monitoring', 'Final crown attachment'],
    staff: ['Dr. Sahar Nadel'],
  },
  {
    id: 'botox-treatment',
    name: 'Botox Treatment',
    nameHebrew: 'טיפול בוטוקס',
    category: 'Aesthetic',
    duration: 30,
    description: 'Therapeutic botox for teeth grinding (bruxism) and jaw clenching. Also available for facial aesthetics.',
    includes: ['Consultation', 'Treatment planning', 'Botox injection', 'Follow-up assessment'],
    staff: ['Dr. Ilan Ofeck'],
  },
];

import type { BadgeVariant } from '@/components/ui/Badge';

export const CATEGORY_COLORS: Record<ServiceCategory, BadgeVariant> = {
  Preventive: 'preventive',
  Aesthetic: 'aesthetic',
  Restorative: 'restorative',
  Endodontics: 'endodontics',
  Surgery: 'surgery',
};

export const CATEGORY_ICONS: Record<ServiceCategory, string> = {
  Preventive: '🦷',
  Aesthetic: '✨',
  Restorative: '🔧',
  Endodontics: '💉',
  Surgery: '🏥',
};

// Get highlighted services for home page
export const HIGHLIGHTED_SERVICES = SERVICES.slice(0, 6);

// Group services by category
export const SERVICES_BY_CATEGORY = SERVICES.reduce((acc, service) => {
  if (!acc[service.category]) {
    acc[service.category] = [];
  }
  acc[service.category].push(service);
  return acc;
}, {} as Record<ServiceCategory, Service[]>);
