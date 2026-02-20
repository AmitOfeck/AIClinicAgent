import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🦷</span>
              <span className="font-bold text-xl text-white">
                Dr. Ilan Ofeck
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Over 30 years of professional dental care in Tel Aviv.
              Your smile is our priority.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-clinic-teal" />
                Bazal Street 35, Tel Aviv
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-clinic-teal" />
                03-5467032
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-clinic-teal" />
                drofeck@gmail.com
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold text-white mb-4">Hours</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-clinic-teal" />
                Sun–Thu: 8AM – 6PM
              </li>
              <li className="pl-6">Fri: 8AM – 1PM</li>
              <li className="pl-6">Sat: Closed</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/services" className="hover:text-clinic-teal transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-clinic-teal transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="https://dr-ofeck.co.il" target="_blank" rel="noopener noreferrer" className="hover:text-clinic-teal transition-colors">
                  Hebrew Website
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Dr. Ilan Ofeck Dental Clinic. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
