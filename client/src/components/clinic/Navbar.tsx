import { Link } from 'react-router-dom'
import { CLINIC_INFO } from '@/constants'

export default function Navbar() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const links = [
    { id: 'services', label: 'Services' },
    { id: 'team', label: 'Team' },
    { id: 'contact', label: 'Contact' },
  ]

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🦷</span>
            <span className="font-bold text-xl text-gray-900">
              Dr. Ofeck's <span className="text-clinic-teal">Dental</span>
            </span>
          </Link>

          <div className="flex items-center gap-8">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-sm font-medium text-gray-600 hover:text-clinic-teal transition-colors"
              >
                {link.label}
              </button>
            ))}
            <a
              href={`tel:${CLINIC_INFO.phone}`}
              className="bg-clinic-teal hover:bg-clinic-teal-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {CLINIC_INFO.phone}
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
