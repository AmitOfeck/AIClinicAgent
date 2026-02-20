import { Award, Users, Heart, MapPin, Phone, Mail, Clock } from 'lucide-react'
import Navbar from '../components/clinic/Navbar'
import Footer from '../components/clinic/Footer'

const team = [
  {
    name: 'Dr. Ilan Ofeck',
    role: 'Lead Dentist & Founder',
    bio: 'Graduate of Tel Aviv University School of Dental Medicine with over 30 years of experience. Specializes in general dentistry and prosthodontics with a gentle, patient-focused approach.',
    image: '👨‍⚕️',
  },
  {
    name: 'Endodontic Specialist',
    role: 'Root Canal Expert',
    bio: 'Our endodontic specialist handles all root canal treatments with precision and care, using the latest techniques for optimal outcomes.',
    image: '🦷',
  },
  {
    name: 'Periodontal Specialist',
    role: 'Gum Disease Expert',
    bio: 'Specializing in gum disease treatment and prevention, including natural herbal therapies for healthier gums.',
    image: '🦷',
  },
  {
    name: 'Oral Surgeon',
    role: 'Surgical Specialist',
    bio: 'Our oral and maxillofacial surgeon performs implants, extractions, and other surgical procedures with expertise.',
    image: '👨‍⚕️',
  },
  {
    name: 'Pediatric Dentist',
    role: 'Children\'s Specialist',
    bio: 'Making dental visits fun for kids! Our pediatric dentist creates positive experiences for young patients.',
    image: '👩‍⚕️',
  },
  {
    name: 'Dental Hygienist',
    role: 'Cleaning Specialist',
    bio: 'Dedicated to patient comfort and education, providing thorough cleanings and personalized oral health guidance.',
    image: '👩‍⚕️',
  },
]

const stats = [
  { icon: Users, value: '10,000+', label: 'Happy Patients' },
  { icon: Award, value: '30+', label: 'Years Experience' },
  { icon: Heart, value: '99%', label: 'Patient Satisfaction' },
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
            Since 1994, Dr. Ilan Ofeck's Dental Clinic has been providing exceptional
            dental care to families in Tel Aviv. Our mission is to deliver the highest
            quality treatment in a comfortable, caring environment.
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-20 h-20 bg-clinic-teal/10 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  {member.image}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
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
                    <p className="text-gray-600">Bazal Street 35, Tel Aviv</p>
                    <p className="text-gray-600">Marom Bazal Medical Building</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-clinic-teal mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-gray-600">03-5467032</p>
                    <p className="text-gray-600">054-8667032</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-clinic-teal mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">drofeck@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Hours</h2>
              <div className="space-y-2">
                {[
                  { day: 'Sunday – Thursday', hours: '8:00 AM – 6:00 PM' },
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
              <div className="mt-6 p-4 bg-clinic-teal/10 rounded-lg">
                <div className="flex items-center gap-2 text-clinic-teal font-medium">
                  <Clock className="w-5 h-5" />
                  <span>Emergency appointments available</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Call us for urgent dental issues - we'll do our best to see you the same day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
