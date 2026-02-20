import type { ClinicInfo, NavLink } from '@/types/clinic';

export const CLINIC_INFO: ClinicInfo = {
  name: "Dr. Ilan Ofeck Dental Clinic",
  address: "Basel 35, Tel Aviv, Israel",
  phone: "03-5467032",
  email: "info@dr-ofeck.co.il",
  website: "dr-ofeck.co.il",
  hours: [
    { day: 'Sunday', hours: '8:00 AM - 6:00 PM', isOpen: true },
    { day: 'Monday', hours: '8:00 AM - 6:00 PM', isOpen: true },
    { day: 'Tuesday', hours: '8:00 AM - 6:00 PM', isOpen: true },
    { day: 'Wednesday', hours: '8:00 AM - 6:00 PM', isOpen: true },
    { day: 'Thursday', hours: '8:00 AM - 6:00 PM', isOpen: true },
    { day: 'Friday', hours: '8:00 AM - 1:00 PM', isOpen: true },
    { day: 'Saturday', hours: 'Closed', isOpen: false },
  ],
  location: {
    lat: 32.0853,
    lng: 34.7818,
    address: "Basel 35, Tel Aviv, Israel",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3381.0!2d34.7818!3d32.0853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4b7c0c1f1f1f%3A0x1234567890abcdef!2sBasel%20St%2035%2C%20Tel%20Aviv-Yafo!5e0!3m2!1sen!2sil!4v1234567890",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Basel+35+Tel+Aviv+Israel",
  },
};

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
];

export const YOUTUBE_VIDEO_ID = 'REp2xUsrUQA';
export const YOUTUBE_EMBED_URL = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`;

// Insurance providers accepted
export const INSURANCE_PROVIDERS = [
  'Clalit Health Services',
  'Maccabi Healthcare',
  'Meuhedet',
  'Leumit Health Care',
  'Private Insurance',
];
