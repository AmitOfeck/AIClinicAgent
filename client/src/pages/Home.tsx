import { Link } from 'react-router-dom'
import { Calendar, Shield, Heart, Star, ArrowRight, CheckCircle, Users } from 'lucide-react'
import Navbar from '../components/clinic/Navbar'
import Footer from '../components/clinic/Footer'

const features = [
  {
    icon: Shield,
    title: '30+ Years Experience',
    description: 'Dr. Ilan Ofeck brings three decades of expertise in aesthetic and restorative dentistry',
  },
  {
    icon: Users,
    title: 'Specialist Team',
    description: 'Dedicated specialists for implants, endodontics, and periodontal care',
  },
  {
    icon: Heart,
    title: 'Patient-Centered Care',
    description: 'Personalized treatment plans with focus on comfort and results',
  },
  {
    icon: Calendar,
    title: 'Smart Booking',
    description: 'AI assistant matches you with the right specialist instantly',
  },
]

const highlightedServices = [
  'Porcelain Veneers & Smile Design',
  'Dental Implants',
  'Root Canal Treatment',
  'Teeth Whitening',
  'Composite Restorations',
  'Periodontal Surgery',
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-clinic-teal to-clinic-teal-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <p className="text-teal-200 font-medium mb-3">Dr. Ilan Ofeck Dental Clinic</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Aesthetic Dentistry
              <br />
              <span className="text-teal-200">in Tel Aviv</span>
            </h1>
            <p className="text-lg text-teal-100 mb-8">
              Over 30 years of creating beautiful smiles. Specializing in veneers,
              implants, and comprehensive dental care with a team of dedicated specialists.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  const chatButton = document.querySelector('[aria-label="Open chat"]') as HTMLButtonElement
                  chatButton?.click()
                }}
                className="bg-white text-clinic-teal hover:bg-teal-50 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                Book Appointment
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="tel:+97235467032"
                className="border border-white/30 hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Call 03-5467032
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-clinic-teal/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-clinic-teal" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Treatments</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive dental care from preventive hygiene to complex surgical procedures,
              each performed by the appropriate specialist.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {highlightedServices.map((service) => (
              <div
                key={service}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
              >
                <CheckCircle className="w-5 h-5 text-clinic-teal flex-shrink-0" />
                <span className="font-medium text-gray-900">{service}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-clinic-teal hover:text-clinic-teal-dark font-medium"
            >
              View All Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-clinic-teal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Treatment?
          </h2>
          <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
            Chat with our AI assistant to find the right specialist and book your appointment,
            or call us directly at 03-5467032.
          </p>
          <button
            onClick={() => {
              const chatButton = document.querySelector('[aria-label="Open chat"]') as HTMLButtonElement
              chatButton?.click()
            }}
            className="bg-white text-clinic-teal hover:bg-teal-50 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Book Now
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
