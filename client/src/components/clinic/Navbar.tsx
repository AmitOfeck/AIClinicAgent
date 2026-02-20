import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CLINIC_INFO } from '@/constants';

interface NavLinkProps {
  id: string;
  label: string;
  onClick: () => void;
}

const NavLink = ({ label, onClick }: NavLinkProps) => (
  <button
    onClick={onClick}
    className="text-sm font-medium text-gray-600 hover:text-clinic-teal transition-colors"
  >
    {label}
  </button>
);

const MobileNavLink = ({ label, onClick }: NavLinkProps) => (
  <button
    onClick={onClick}
    className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-clinic-teal transition-colors"
  >
    {label}
  </button>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setIsOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { id: 'services', label: 'Services' },
    { id: 'team', label: 'Team' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🦷</span>
            <span className="font-bold text-lg sm:text-xl text-gray-900">
              Dr. Ofeck's <span className="text-clinic-teal">Dental</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.id}
                id={link.id}
                label={link.label}
                onClick={() => scrollToSection(link.id)}
              />
            ))}
            <a
              href={`tel:${CLINIC_INFO.phone}`}
              className="inline-flex items-center gap-2 bg-clinic-teal hover:bg-clinic-teal-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden lg:inline">{CLINIC_INFO.phone}</span>
              <span className="lg:hidden">Call</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <a
              href={`tel:${CLINIC_INFO.phone}`}
              className="inline-flex items-center justify-center w-10 h-10 bg-clinic-teal hover:bg-clinic-teal-dark text-white rounded-lg transition-colors"
              aria-label="Call clinic"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center w-10 h-10 text-gray-600 hover:text-clinic-teal hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-64 border-t border-gray-100' : 'max-h-0'
        )}
      >
        <div className="py-2">
          {navLinks.map((link) => (
            <MobileNavLink
              key={link.id}
              id={link.id}
              label={link.label}
              onClick={() => scrollToSection(link.id)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
