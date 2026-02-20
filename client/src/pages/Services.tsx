import { Clock } from 'lucide-react'
import Navbar from '../components/clinic/Navbar'
import Footer from '../components/clinic/Footer'

const services = [
  {
    name: 'Routine Checkup & Cleaning',
    duration: '30 minutes',
    price: '₪250',
    description:
      'Comprehensive oral examination and professional cleaning by our dental hygienist. Includes plaque removal, polishing, and personalized care recommendations.',
    includes: ['Oral examination', 'Professional cleaning', 'Fluoride treatment', 'Care recommendations'],
  },
  {
    name: 'Teeth Whitening',
    duration: '60 minutes',
    price: '₪800',
    description:
      'Professional in-office whitening treatment for a brighter, more confident smile. Safe and effective results in just one session.',
    includes: ['Consultation', 'Professional whitening gel', 'LED activation', 'Post-care instructions'],
  },
  {
    name: 'Root Canal Treatment',
    duration: '90 minutes',
    price: '₪1,500',
    description:
      'Expert endodontic treatment by our specialist to save an infected tooth. Modern techniques ensure minimal discomfort and excellent outcomes.',
    includes: ['Local anesthesia', 'Pulp removal', 'Canal cleaning & shaping', 'Permanent filling'],
  },
  {
    name: 'Dental Implants',
    duration: 'Multiple visits',
    price: 'From ₪4,500',
    description:
      'State-of-the-art implant placement by our oral surgeon. A permanent solution to replace missing teeth that looks and feels natural.',
    includes: ['Consultation & planning', '3D imaging', 'Implant surgery', 'Crown placement'],
  },
  {
    name: 'Gum Disease Treatment',
    duration: '45-90 minutes',
    price: 'From ₪400',
    description:
      'Periodontal therapy by our specialist, including natural herbal treatments. We treat all stages of gum disease to restore your oral health.',
    includes: ['Deep cleaning', 'Scaling & root planing', 'Herbal treatments', 'Maintenance plan'],
  },
  {
    name: 'Pediatric Dentistry',
    duration: '30 minutes',
    price: '₪200',
    description:
      'Gentle, child-friendly dental care by our pediatric dentist. We make dental visits fun and stress-free for your little ones.',
    includes: ['Kid-friendly exam', 'Gentle cleaning', 'Fluoride treatment', 'Parent guidance'],
  },
  {
    name: 'Aesthetic Dentistry',
    duration: 'Varies',
    price: 'From ₪1,200',
    description:
      'Transform your smile with crowns, veneers, and other cosmetic treatments. Custom-designed for natural, beautiful results.',
    includes: ['Smile design', 'Porcelain veneers', 'Dental crowns', 'Composite bonding'],
  },
  {
    name: 'Oral Surgery',
    duration: 'Varies',
    price: 'From ₪500',
    description:
      'Expert surgical procedures by our oral and maxillofacial surgeon. From wisdom teeth removal to complex extractions.',
    includes: ['Wisdom teeth removal', 'Complex extractions', 'Bone grafting', 'Post-op care'],
  },
  {
    name: 'Anxiety Management',
    duration: 'Added to any service',
    price: '₪150',
    description:
      'Nitrous oxide (laughing gas) sedation for anxious patients. Relax and feel comfortable during your dental treatment.',
    includes: ['Nitrous oxide sedation', 'Calm environment', 'Patient monitoring', 'Gentle approach'],
  },
]

export default function Services() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-clinic-teal to-clinic-teal-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-teal-100 max-w-2xl">
            Comprehensive dental care with a team of specialists. From routine checkups
            to advanced procedures, we've got you covered.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8">
            {services.map((service) => (
              <div
                key={service.name}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {service.name}
                    </h2>
                    <p className="text-gray-600 mb-4">{service.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {service.includes.map((item) => (
                        <span
                          key={item}
                          className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-2">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{service.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-clinic-teal font-bold text-lg">
                      <span>{service.price}</span>
                    </div>
                    <button
                      onClick={() => {
                        const chatButton = document.querySelector(
                          '[aria-label="Open chat"]'
                        ) as HTMLButtonElement
                        chatButton?.click()
                      }}
                      className="bg-clinic-teal hover:bg-clinic-teal-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Insurance & Payment</h2>
          <p className="text-gray-600 mb-4">We work with most major health funds and insurance providers:</p>
          <div className="flex flex-wrap gap-3">
            {[
              'Maccabi Healthcare',
              'Clalit Health Services',
              'Meuhedet',
              'Leumit Health Fund',
              'Private Insurance',
              'Credit Card Payments',
            ].map((item) => (
              <span
                key={item}
                className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-700"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
