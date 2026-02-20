import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { CLINIC_INFO } from '@/constants';

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🦷</span>
              <span className="font-bold text-xl text-white">
                Dr. Ofeck's Dental
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Professional dental care in a modern, comfortable environment.
              Your smile is our priority.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={CLINIC_INFO.location.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-clinic-teal transition-colors"
                >
                  <MapPin className="w-4 h-4 text-clinic-teal flex-shrink-0" />
                  {CLINIC_INFO.address}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CLINIC_INFO.phone}`}
                  className="flex items-center gap-2 hover:text-clinic-teal transition-colors"
                >
                  <Phone className="w-4 h-4 text-clinic-teal" />
                  {CLINIC_INFO.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CLINIC_INFO.email}`}
                  className="flex items-center gap-2 hover:text-clinic-teal transition-colors"
                >
                  <Mail className="w-4 h-4 text-clinic-teal" />
                  {CLINIC_INFO.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold text-white mb-4">Hours</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-clinic-teal mt-0.5" />
                <div>
                  {CLINIC_INFO.hours.slice(0, 5).map((h) => (
                    <div key={h.day} className="flex justify-between gap-4">
                      <span>{h.day.slice(0, 3)}:</span>
                      <span className={h.isOpen ? '' : 'text-gray-500'}>{h.hours}</span>
                    </div>
                  ))}
                </div>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="hover:text-clinic-teal transition-colors"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('team')}
                  className="hover:text-clinic-teal transition-colors"
                >
                  Our Team
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="hover:text-clinic-teal transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('why-us')}
                  className="hover:text-clinic-teal transition-colors"
                >
                  Insurance
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Dr. Ilan Ofeck's Dental Clinic. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
