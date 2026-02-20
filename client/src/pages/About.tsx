import { Award, Users, Heart, MapPin, Phone, Mail } from 'lucide-react'
import Navbar from '../components/clinic/Navbar'
import Footer from '../components/clinic/Footer'

const team = [
  {
    name: 'Dr. Amit Opek',
    role: 'Lead Dentist & Founder',
    bio: 'Dr. Opek has over 15 years of experience in general and cosmetic dentistry. He graduated from Tel Aviv University School of Dental Medicine and is passionate about creating beautiful, healthy smiles.',
    image: '👨‍⚕️',
  },
  {
    name: 'Dr. Sarah Cohen',
    role: 'Orthodontist',
    bio: 'Specializing in Invisalign and traditional braces, Dr. Cohen helps patients of all ages achieve their dream smiles. She completed her orthodontic residency at Hebrew University.',
    image: '👩‍⚕️',
  },
  {
    name: 'Maya Levy',
    role: 'Dental Hygienist',
    bio: 'Maya is dedicated to patient comfort and education. With her gentle approach, she makes every cleaning a pleasant experience while ensuring optimal oral health.',
    image: '👩‍⚕️',
  },
]

const stats = [
  { icon: Users, value: '5,000+', label: 'Happy Patients' },
  { icon: Award, value: '15+', label: 'Years Experience' },
  { icon: Heart, value: '98%', label: 'Patient Satisfaction' },
]

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-clinic-teal to-clinic-teal-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">About Our Clinic</h1>
          <p className="text-teal-100 max-w-2xl">
            Since 2009, we've been providing exceptional dental care to our
            community. Our mission is to make every patient feel comfortable
            while delivering the highest quality treatment.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-12 h-12 bg-clinic-teal/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-clinic-teal" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Meet Our Team
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-24 h-24 bg-clinic-teal/10 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                  {member.image}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-clinic-teal font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Visit Us</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-clinic-teal mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-gray-600">123 Smile Street, Tel Aviv, Israel</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-clinic-teal mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-gray-600">(555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-clinic-teal mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">info@dropek-dental.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Hours</h2>
              <div className="space-y-2">
                {[
                  { day: 'Sunday – Thursday', hours: '8:00 AM – 5:00 PM' },
                  { day: 'Friday', hours: '8:00 AM – 1:00 PM' },
                  { day: 'Saturday', hours: 'Closed' },
                ].map((item) => (
                  <div
                    key={item.day}
                    className="flex justify-between py-2 border-b border-gray-200"
                  >
                    <span className="text-gray-900">{item.day}</span>
                    <span className="text-gray-600">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
