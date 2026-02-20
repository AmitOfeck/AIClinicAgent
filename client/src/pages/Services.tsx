import { Clock, DollarSign } from 'lucide-react'
import Navbar from '../components/clinic/Navbar'
import Footer from '../components/clinic/Footer'

const services = [
  {
    name: 'Routine Checkup & Cleaning',
    duration: '30 minutes',
    price: '$80',
    description:
      'Comprehensive oral examination and professional cleaning to maintain your dental health. Includes X-rays if needed and personalized care recommendations.',
    includes: ['Oral examination', 'Professional cleaning', 'Fluoride treatment', 'Care recommendations'],
  },
  {
    name: 'Teeth Whitening',
    duration: '60 minutes',
    price: '$250',
    description:
      'Professional in-office whitening treatment for a brighter, more confident smile. See results in just one session.',
    includes: ['Consultation', 'Professional whitening gel', 'LED activation', 'Post-care kit'],
  },
  {
    name: 'Dental Implant Consultation',
    duration: '45 minutes',
    price: '$120',
    description:
      'Evaluation and planning for dental implants, including X-rays and discussion of treatment options.',
    includes: ['Comprehensive exam', 'Digital X-rays', 'Treatment planning', 'Cost estimate'],
  },
  {
    name: 'Root Canal Treatment',
    duration: '90 minutes',
    price: '$600',
    description:
      'Treatment to save an infected tooth by removing the damaged pulp and sealing the canal. Modern techniques ensure minimal discomfort.',
    includes: ['Local anesthesia', 'Pulp removal', 'Canal cleaning', 'Permanent filling'],
  },
  {
    name: 'Orthodontic Consultation',
    duration: '45 minutes',
    price: '$100',
    description:
      'Assessment for braces or clear aligners to straighten your teeth. We offer both traditional braces and Invisalign.',
    includes: ['Bite analysis', 'Digital impressions', 'Treatment options', 'Timeline & cost'],
  },
  {
    name: 'Emergency Dental Care',
    duration: 'Varies',
    price: 'Starting at $150',
    description:
      'Immediate care for dental emergencies like severe pain, broken teeth, or infections. Same-day appointments available.',
    includes: ['Pain relief', 'Diagnosis', 'Immediate treatment', 'Follow-up plan'],
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
            We offer a comprehensive range of dental services using the latest
            technology and techniques. Your comfort and care are our top priorities.
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
                      <DollarSign className="w-4 h-4" />
                      <span>{service.price.replace('$', '')}</span>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Insurance</h2>
          <p className="text-gray-600 mb-4">We accept most major insurance providers:</p>
          <div className="flex flex-wrap gap-3">
            {[
              'Maccabi Healthcare',
              'Clalit Health Services',
              'Meuhedet',
              'Leumit Health Fund',
              'Most private insurance',
            ].map((insurance) => (
              <span
                key={insurance}
                className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-700"
              >
                {insurance}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
