import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'

export default function Navbar() {
  const location = useLocation()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
  ]

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🦷</span>
            <span className="font-bold text-xl text-gray-900">
              Dr. Ilan Ofeck <span className="text-clinic-teal">Dental</span>
            </span>
          </Link>

          <div className="flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  location.pathname === link.href
                    ? 'text-clinic-teal'
                    : 'text-gray-600 hover:text-clinic-teal'
                )}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="tel:03-5467032"
              className="bg-clinic-teal hover:bg-clinic-teal-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              03-5467032
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
