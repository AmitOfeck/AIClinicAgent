import { Clock } from 'lucide-react'
import Navbar from '../components/clinic/Navbar'
import Footer from '../components/clinic/Footer'

const services = [
  {
    name: 'Dental Hygiene & Cleaning',
    category: 'Preventive',
    duration: '45 minutes',
    description: 'Professional cleaning to remove plaque and tartar buildup, stain removal, and oral hygiene guidance.',
    includes: ['Tartar removal', 'Stain removal', 'Polishing', 'Oral hygiene tips'],
    staff: ['Katy Fridman', 'Shir Formoza'],
  },
  {
    name: 'Teeth Whitening',
    category: 'Aesthetic',
    duration: '60 minutes',
    description: 'Professional whitening treatment available both in-office and at-home options for a brighter smile.',
    includes: ['Consultation', 'Professional whitening', 'At-home kit option', 'Follow-up care'],
    staff: ['Katy Fridman', 'Shir Formoza'],
  },
  {
    name: 'Composite Restorations',
    category: 'Restorative',
    duration: '45 minutes',
    description: 'White composite fillings replacing old amalgam restorations with better aesthetics and durability.',
    includes: ['Old filling removal', 'Tooth preparation', 'Composite filling', 'Bite adjustment'],
    staff: ['Dr. Ilan Ofeck', 'Dr. Dan Zitoni'],
  },
  {
    name: 'Composite Veneers',
    category: 'Aesthetic',
    duration: '60 minutes',
    description: 'Modern tooth reshaping technique with pre-visualization of results before treatment begins.',
    includes: ['Smile design', 'Pre-visualization', 'Veneer application', 'Final polishing'],
    staff: ['Dr. Ilan Ofeck'],
  },
  {
    name: 'Porcelain Veneers',
    category: 'Aesthetic',
    duration: '60 minutes',
    description: 'Thin porcelain shells to close gaps, whiten, reshape, and dramatically improve smile aesthetics.',
    includes: ['Consultation', 'Impressions', 'Custom fabrication', 'Bonding'],
    staff: ['Dr. Ilan Ofeck'],
  },
  {
    name: 'Porcelain Crowns',
    category: 'Restorative',
    duration: '60 minutes',
    description: 'Complete tooth coverage for structural restoration and aesthetic improvement of damaged teeth.',
    includes: ['Tooth preparation', 'Impressions', 'Temporary crown', 'Permanent crown fitting'],
    staff: ['Dr. Ilan Ofeck'],
  },
  {
    name: 'Root Canal Treatment',
    category: 'Endodontics',
    duration: '90 minutes',
    description: 'Deep cleaning and filling of root canals to treat decay and inflammation, preserving the natural tooth.',
    includes: ['Diagnosis', 'Anesthesia', 'Canal cleaning', 'Permanent sealing'],
    staff: ['Dr. Maayan Granit'],
  },
  {
    name: 'Periodontal Surgery',
    category: 'Surgery',
    duration: '90 minutes',
    description: 'Treatment for gum disease, bacterial infections, gum recession, and bone loss around teeth.',
    includes: ['Assessment', 'Gum treatment', 'Bone grafting if needed', 'Post-op care'],
    staff: ['Dr. Sahar Nadel'],
  },
  {
    name: 'Dental Implants',
    category: 'Surgery',
    duration: '120 minutes',
    description: 'Titanium or zirconia implants as artificial tooth roots with over 95% success rates.',
    includes: ['CT scan planning', 'Implant placement', 'Healing period', 'Crown restoration'],
    staff: ['Dr. Sahar Nadel'],
  },
  {
    name: 'Botox Treatment',
    category: 'Aesthetic',
    duration: '30 minutes',
    description: 'Relaxes jaw muscles to reduce teeth grinding, clenching, and associated pain or headaches.',
    includes: ['Consultation', 'Treatment planning', 'Botox injection', 'Follow-up'],
    staff: ['Dr. Ilan Ofeck'],
  },
]

const categoryColors: Record<string, string> = {
  Preventive: 'bg-green-100 text-green-800',
  Aesthetic: 'bg-purple-100 text-purple-800',
  Restorative: 'bg-blue-100 text-blue-800',
  Endodontics: 'bg-orange-100 text-orange-800',
  Surgery: 'bg-red-100 text-red-800',
}

export default function Services() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-clinic-teal to-clinic-teal-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-teal-100 max-w-2xl">
            Dr. Ilan Ofeck's clinic offers comprehensive dental care with a team of
            specialists. Each treatment is matched with the right professional for optimal results.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6">
            {services.map((service) => (
              <div
                key={service.name}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-gray-900">
                        {service.name}
                      </h2>
                      <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[service.category]}`}>
                        {service.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{service.description}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {service.includes.map((item) => (
                        <span
                          key={item}
                          className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Performed by:</span>{' '}
                      {service.staff.join(', ')}
                    </p>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-3">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{service.duration}</span>
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
