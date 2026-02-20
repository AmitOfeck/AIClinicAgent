import { Award, Users, Heart, MapPin, Phone } from 'lucide-react'
import Navbar from '../components/clinic/Navbar'
import Footer from '../components/clinic/Footer'

const team = [
  {
    name: 'Dr. Ilan Ofeck',
    role: 'Chief Dentist & Clinic Director',
    bio: 'Graduated from Tel Aviv University School of Dental Medicine. Over 30 years of experience in general and aesthetic dentistry, specializing in prosthodontics and smile design.',
    image: '/images/staff/dr-ilan-ofeck.jpg',
    services: ['Restorations', 'Veneers', 'Crowns', 'Botox'],
  },
  {
    name: 'Katy Fridman',
    role: 'Dental Hygienist',
    bio: 'Licensed dental hygienist specializing in tartar removal and patient education on proper oral care. Known for her gentle and thorough approach.',
    image: '/images/staff/katy-fridman.jpg',
    services: ['Dental Hygiene', 'Teeth Whitening'],
  },
  {
    name: 'Dr. Sahar Nadel',
    role: 'Oral & Maxillofacial Surgeon',
    bio: 'Graduated from Hebrew University School of Dental Medicine (2010). Completed specialized training in oral surgery, focusing on implants and periodontal procedures.',
    image: '/images/staff/dr-sahar-nadel.jpg',
    services: ['Dental Implants', 'Periodontal Surgery'],
  },
  {
    name: 'Dr. Maayan Granit',
    role: 'Endodontist',
    bio: 'Completed endodontics residency at Hebrew University in Jerusalem (2013). Specialist in root canal treatments using advanced techniques for patient comfort.',
    image: '/images/staff/dr-maayan-granit.jpg',
    services: ['Root Canal Treatment'],
  },
  {
    name: 'Dr. Dan Zitoni',
    role: 'Dentist',
    bio: 'General dentist providing comprehensive dental care and restorative treatments. Focused on patient comfort and quality results.',
    image: '/images/staff/dr-dan-zitoni.jpg',
    services: ['Composite Restorations'],
  },
  {
    name: 'Shir Formoza',
    role: 'Dental Hygienist',
    bio: 'Licensed dental hygienist with a unique approach using natural treatment methods. Dedicated to patient education and preventive care.',
    image: '/images/staff/shir-formoza.jpg',
    services: ['Dental Hygiene', 'Teeth Whitening'],
  },
]

const stats = [
  { icon: Users, value: '10,000+', label: 'Happy Patients' },
  { icon: Award, value: '30+', label: 'Years Experience' },
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
            Dr. Ilan Ofeck's dental clinic has been providing exceptional care in Tel Aviv
            for over 30 years. Our team of specialists ensures every patient receives
            personalized treatment with the latest techniques.
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
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-clinic-teal/10 flex items-center justify-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.parentElement!.innerHTML = '<span class="text-6xl">👨‍⚕️</span>'
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-clinic-teal font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-3">{member.bio}</p>
                  <div className="flex flex-wrap gap-1">
                    {member.services.map((service) => (
                      <span
                        key={service}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
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
                    <p className="text-gray-600">Basel 35, Tel Aviv</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-clinic-teal mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-gray-600">03-5467032</p>
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
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
