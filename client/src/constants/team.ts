import { Award, Users, UserCheck, Clock, Star, Heart } from 'lucide-react';
import type { TeamMember, Stat } from '@/types/clinic';

export const TEAM: TeamMember[] = [
  {
    id: 'dr-ilan-ofeck',
    name: 'Dr. Ilan Ofeck',
    role: 'Chief Dentist & Clinic Director',
    specialty: 'Prosthodontics & Aesthetic Dentistry',
    bio: 'With over 20 years of experience, Dr. Ofeck specializes in creating beautiful, natural-looking smiles. He leads our team with a commitment to excellence and patient care.',
    image: '/images/staff/dr-ilan-ofeck.jpg',
    services: ['Composite Restorations', 'Composite Veneers', 'Porcelain Veneers', 'Porcelain Crowns', 'Botox Treatment'],
  },
  {
    id: 'katy-fridman',
    name: 'Katy Fridman',
    role: 'Dental Hygienist',
    specialty: 'Preventive Care',
    bio: 'Katy brings warmth and expertise to every cleaning appointment. Her gentle approach helps patients feel at ease while maintaining optimal oral health.',
    image: '/images/staff/katy-fridman.jpg',
    services: ['Dental Hygiene & Cleaning', 'Teeth Whitening'],
  },
  {
    id: 'shir-formoza',
    name: 'Shir Formoza',
    role: 'Dental Hygienist',
    specialty: 'Preventive Care',
    bio: 'Shir is dedicated to patient education and preventive care. She works closely with patients to develop personalized oral hygiene routines.',
    image: '/images/staff/shir-formoza.jpg',
    services: ['Dental Hygiene & Cleaning', 'Teeth Whitening'],
  },
  {
    id: 'dr-maayan-granit',
    name: 'Dr. Maayan Granit',
    role: 'Endodontist',
    specialty: 'Root Canal Therapy',
    bio: 'Dr. Granit is our root canal specialist, using the latest techniques to save teeth that might otherwise need extraction. Her precision and care ensure comfortable treatments.',
    image: '/images/staff/dr-maayan-granit.jpg',
    services: ['Root Canal Treatment'],
  },
  {
    id: 'dr-sahar-nadel',
    name: 'Dr. Sahar Nadel',
    role: 'Oral & Maxillofacial Surgeon',
    specialty: 'Implants & Periodontal Surgery',
    bio: 'Dr. Nadel specializes in dental implants and periodontal surgery. His surgical expertise and attention to detail deliver exceptional outcomes.',
    image: '/images/staff/dr-sahar-nadel.jpg',
    services: ['Periodontal Surgery', 'Dental Implants'],
  },
  {
    id: 'dr-dan-zitoni',
    name: 'Dr. Dan Zitoni',
    role: 'Dentist',
    specialty: 'General & Restorative Dentistry',
    bio: 'Dr. Zitoni provides comprehensive dental care with a focus on patient comfort. He excels in restorative treatments that look and feel natural.',
    image: '/images/staff/dr-dan-zitoni.jpg',
    services: ['Composite Restorations'],
  },
];

export const STATS: Stat[] = [
  {
    id: 'experience',
    value: '20+',
    label: 'Years Experience',
    icon: Award,
  },
  {
    id: 'patients',
    value: '10,000+',
    label: 'Happy Patients',
    icon: Users,
  },
  {
    id: 'specialists',
    value: '6',
    label: 'Expert Specialists',
    icon: UserCheck,
  },
];

// Extended stats for about page
export const EXTENDED_STATS: Stat[] = [
  ...STATS,
  {
    id: 'hours',
    value: '54',
    label: 'Hours per Week',
    icon: Clock,
  },
  {
    id: 'rating',
    value: '4.9',
    label: 'Google Rating',
    icon: Star,
  },
  {
    id: 'satisfaction',
    value: '98%',
    label: 'Patient Satisfaction',
    icon: Heart,
  },
];
