import { MapPin, Phone, Clock, Award, Users, Star, MessageCircle, PhoneCall } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TEAM, STATS, CLINIC_INFO } from '@/constants';

const About = () => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const handleOpenChat = () => {
    const chatButton = document.querySelector('[aria-label="Open chat"]') as HTMLButtonElement;
    chatButton?.click();
  };

  return (
    <PageLayout>
      {/* Header with Decorative Elements */}
      <Section background="gradient" padding="lg" className="relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 border border-white/10 rounded-full" />
          <div className="absolute bottom-20 right-10 w-96 h-96 border border-white/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -top-20 -right-20 w-80 h-80 border border-white/5 rounded-full" />
        </div>

        <Container className="relative z-10">
          <div className="max-w-3xl">
            <Badge variant="primary" className="mb-4 bg-white/20 text-white border-white/30">
              Est. 2004 • Tel Aviv
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Our Clinic</h1>
            <p className="text-teal-100 text-lg max-w-2xl mb-8">
              Dr. Ilan Ofeck's dental clinic has been providing exceptional care in Tel Aviv
              for over 20 years. Our team of specialists ensures every patient receives
              personalized treatment with the latest techniques.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-white">4.9 Google Rating</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Users className="w-4 h-4 text-white" />
                <span className="text-sm text-white">10,000+ Happy Patients</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Award className="w-4 h-4 text-white" />
                <span className="text-sm text-white">20+ Years Experience</span>
              </div>
            </div>
          </div>

          {/* Floating Stats Card */}
          <div className="hidden lg:block absolute -bottom-12 right-8 xl:right-16">
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-clinic-teal/10 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-clinic-teal" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">20+</p>
                    <p className="text-sm text-gray-500">Years</p>
                  </div>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-clinic-teal/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-clinic-teal" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">10k+</p>
                    <p className="text-sm text-gray-500">Patients</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto" preserveAspectRatio="none">
            <path
              d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
              fill="white"
            />
          </svg>
        </div>
      </Section>

      {/* Stats Section */}
      <Section background="white" padding="lg" className="pt-20 lg:pt-24">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STATS.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-clinic-teal/20 to-clinic-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-clinic-teal" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Team Section */}
      <Section background="white" padding="lg" className="relative">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-clinic-teal/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <Container className="relative z-10">
          <div className="text-center mb-12">
            <Badge variant="primary" className="mb-4">Our Specialists</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our team of experienced dental professionals is dedicated to providing you with the highest quality care in a comfortable environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM.map((member) => (
              <Card
                key={member.id}
                variant="outlined"
                padding="none"
                className="group overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                {/* Photo Container - Fixed with object-top */}
                <div className="relative h-64 overflow-hidden bg-clinic-teal/10">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-clinic-teal/20 to-clinic-teal/10">
                          <span class="text-7xl">👨‍⚕️</span>
                        </div>
                      `;
                    }}
                  />
                  {/* Hover Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Specialty Badge */}
                  <Badge
                    variant="primary"
                    size="sm"
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-clinic-teal border-white/50"
                  >
                    {member.specialty}
                  </Badge>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-clinic-teal font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{member.bio}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {member.services.slice(0, 3).map((service) => (
                      <span
                        key={service}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                    {member.services.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                        +{member.services.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Contact Info Section */}
      <Section background="gray" padding="lg">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Visit Us Card */}
            <Card variant="elevated" padding="lg" className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-clinic-teal/5 rounded-full -translate-y-1/2 translate-x-1/2" />

              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-clinic-teal/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-clinic-teal" />
                </div>
                Visit Us
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-clinic-teal/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-clinic-teal" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Address</p>
                    <p className="text-gray-600">{CLINIC_INFO.address}</p>
                    <a
                      href={CLINIC_INFO.location.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-clinic-teal hover:underline mt-1 inline-block"
                    >
                      Get Directions →
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-clinic-teal/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-clinic-teal" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Phone</p>
                    <a
                      href={`tel:${CLINIC_INFO.phone}`}
                      className="text-gray-600 hover:text-clinic-teal transition-colors"
                    >
                      {CLINIC_INFO.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Map Preview */}
              <div className="mt-6 rounded-xl overflow-hidden border border-gray-200">
                <iframe
                  src={CLINIC_INFO.location.mapEmbedUrl}
                  width="100%"
                  height="150"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Clinic Location"
                  className="grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </Card>

            {/* Hours Card */}
            <Card variant="elevated" padding="lg" className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-clinic-teal/5 rounded-full -translate-y-1/2 translate-x-1/2" />

              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-clinic-teal/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-clinic-teal" />
                </div>
                Opening Hours
              </h2>

              <div className="space-y-2">
                {CLINIC_INFO.hours.map((item) => {
                  const isToday = item.day === today;
                  return (
                    <div
                      key={item.day}
                      className={`flex justify-between py-3 px-4 rounded-lg transition-colors ${
                        isToday
                          ? 'bg-clinic-teal/10 border border-clinic-teal/20'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className={`font-medium ${isToday ? 'text-clinic-teal' : 'text-gray-900'}`}>
                        {item.day}
                        {isToday && (
                          <span className="ml-2 text-xs bg-clinic-teal text-white px-2 py-0.5 rounded-full">
                            Today
                          </span>
                        )}
                      </span>
                      <span className={item.isOpen ? (isToday ? 'text-clinic-teal font-medium' : 'text-gray-600') : 'text-gray-400'}>
                        {item.hours}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section background="gradient" padding="lg" className="relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-40 h-40 border border-white/10 rounded-full" />
          <div className="absolute bottom-10 right-10 w-60 h-60 border border-white/10 rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/5 rounded-full blur-xl" />
        </div>

        <Container className="relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Schedule Your Visit?</h2>
            <p className="text-teal-100 text-lg mb-8">
              Our friendly team is here to help you achieve your perfect smile. Book your appointment today or chat with our AI assistant for instant answers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={handleOpenChat}
                className="group"
              >
                <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Chat with AI Assistant
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={() => window.location.href = `tel:${CLINIC_INFO.phone}`}
              >
                <PhoneCall className="w-5 h-5 mr-2" />
                Call {CLINIC_INFO.phone}
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </PageLayout>
  );
};

export default About;
