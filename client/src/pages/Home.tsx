import { Link } from 'react-router-dom'
import { Calendar, Shield, Heart, Star, ArrowRight, CheckCircle, Smile } from 'lucide-react'
import Navbar from '../components/clinic/Navbar'
import Footer from '../components/clinic/Footer'

const features = [
  {
    icon: Calendar,
    title: 'Easy Online Booking',
    description: 'Book your appointment instantly with our AI assistant',
  },
  {
    icon: Shield,
    title: '30+ Years Experience',
    description: 'Trusted dental care since 1994',
  },
  {
    icon: Heart,
    title: 'Anxiety-Free Care',
    description: 'Nitrous oxide available for nervous patients',
  },
  {
    icon: Star,
    title: 'Expert Specialists',
    description: 'Full team of dental specialists on-site',
  },
]

const services = [
  { name: 'Routine Checkup & Cleaning', price: '₪250' },
  { name: 'Teeth Whitening', price: '₪800' },
  { name: 'Root Canal Treatment', price: '₪1,500' },
  { name: 'Dental Implants', price: '₪4,500' },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-clinic-teal to-clinic-teal-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Dr. Ilan Ofeck
              <br />
              <span className="text-teal-200">Dental Clinic</span>
            </h1>
            <p className="text-lg text-teal-100 mb-8">
              Over 30 years of excellence in dental care. Experience compassionate,
              professional treatment with our expert team in the heart of Tel Aviv.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  const chatButton = document.querySelector('[aria-label="Open chat"]') as HTMLButtonElement
                  chatButton?.click()
                }}
                className="bg-white text-clinic-teal hover:bg-teal-50 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                Book with AI Assistant
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="tel:03-5467032"
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive dental care for the whole family - from routine checkups
              to advanced procedures, all under one roof.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {services.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-clinic-teal" />
                  <span className="font-medium text-gray-900">{service.name}</span>
                </div>
                <span className="text-clinic-teal font-semibold">{service.price}</span>
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

      {/* Anxiety Free Section */}
      <section className="py-16 bg-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="w-16 h-16 bg-clinic-teal/10 rounded-full flex items-center justify-center mb-4">
                <Smile className="w-8 h-8 text-clinic-teal" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Nervous About Dental Visits?
              </h2>
              <p className="text-gray-600 mb-4">
                We understand dental anxiety. Our clinic offers nitrous oxide (laughing gas)
                and a calming environment to make your experience as comfortable as possible.
              </p>
              <p className="text-gray-600">
                Dr. Ofeck and his team specialize in treating anxious patients with care
                and patience. You're in good hands.
              </p>
            </div>
            <div className="flex-1 text-center">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <p className="text-5xl mb-4">😌</p>
                <p className="text-lg font-medium text-gray-900">Relaxed Atmosphere</p>
                <p className="text-gray-600">Modern techniques for pain-free treatment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-clinic-teal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Book Your Appointment?
          </h2>
          <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
            Chat with our AI assistant to find the perfect appointment time, or
            give us a call. We're located in Tel Aviv, Bazal Street 35.
          </p>
          <button
            onClick={() => {
              const chatButton = document.querySelector('[aria-label="Open chat"]') as HTMLButtonElement
              chatButton?.click()
            }}
            className="bg-white text-clinic-teal hover:bg-teal-50 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Start Chat Now
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
