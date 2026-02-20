import { MapPin, Phone } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { TEAM, STATS, CLINIC_INFO } from '@/constants';

const About = () => {
  return (
    <PageLayout>
      {/* Header */}
      <Section background="gradient" padding="lg">
        <Container>
          <h1 className="text-4xl font-bold mb-4">About Our Clinic</h1>
          <p className="text-teal-100 max-w-2xl">
            Dr. Ilan Ofeck's dental clinic has been providing exceptional care in Tel Aviv
            for over 30 years. Our team of specialists ensures every patient receives
            personalized treatment with the latest techniques.
          </p>
        </Container>
      </Section>

      {/* Stats */}
      <Section background="white" padding="md">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STATS.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="w-12 h-12 bg-clinic-teal/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <IconComponent className="w-6 h-6 text-clinic-teal" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Team */}
      <Section background="white" padding="lg">
        <Container>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Meet Our Team
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM.map((member) => (
              <Card
                key={member.id}
                variant="outlined"
                padding="none"
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-clinic-teal/10 flex items-center justify-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = '<span class="text-6xl">👨‍⚕️</span>';
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
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Contact Info */}
      <Section background="gray" padding="lg">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Visit Us</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-clinic-teal mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-gray-600">{CLINIC_INFO.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-clinic-teal mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-gray-600">{CLINIC_INFO.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Hours</h2>
              <div className="space-y-2">
                {CLINIC_INFO.hours.map((item) => (
                  <div
                    key={item.day}
                    className="flex justify-between py-2 border-b border-gray-200"
                  >
                    <span className="text-gray-900">{item.day}</span>
                    <span className={item.isOpen ? 'text-gray-600' : 'text-gray-400'}>
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </PageLayout>
  );
};

export default About;
