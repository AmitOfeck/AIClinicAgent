import type { LucideIcon } from 'lucide-react';

// Service types
export type ServiceCategory =
  | 'Preventive'
  | 'Aesthetic'
  | 'Restorative'
  | 'Endodontics'
  | 'Surgery';

export interface Service {
  id: string;
  name: string;
  nameHebrew?: string;
  category: ServiceCategory;
  duration: number;
  description: string;
  includes: string[];
  staff: string[];
}

// Team types
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialty?: string;
  bio: string;
  image: string;
  services: string[];
}

// Clinic info types
export interface DayHours {
  day: string;
  hours: string;
  isOpen: boolean;
}

export interface ClinicLocation {
  lat: number;
  lng: number;
  address: string;
  mapEmbedUrl: string;
  directionsUrl: string;
}

export interface ClinicInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  hours: DayHours[];
  location: ClinicLocation;
}

// Feature types
export interface Feature {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

// Stats types
export interface Stat {
  id: string;
  value: string;
  label: string;
  icon: LucideIcon;
}

// Navigation types
export interface NavLink {
  label: string;
  href: string;
}
