import { Clock, Users, Zap, Shield, MessageCircle, PhoneCall, Sparkles } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useChatContext } from '@/context/ChatContext';
import { SERVICES, CATEGORY_COLORS, CATEGORY_ICONS, INSURANCE_PROVIDERS, CLINIC_INFO } from '@/constants';

// Popular services to highlight
const POPULAR_SERVICE_IDS = ['dental-hygiene', 'teeth-whitening', 'dental-implants'];

const Services = () => {
  const { openWithMessage, open } = useChatContext();

  const handleBookService = (serviceName: string) => {
    openWithMessage(`I'd like to book an appointment for ${serviceName}`);
  };

  const handleOpenChat = () => {
    open();
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
          <div className="absolute -bottom-20 -left-20 w-80 h-80 border border-white/5 rounded-full" />
        </div>

        <Container className="relative z-10">
          <div className="max-w-3xl">
            <Badge variant="primary" className="mb-4 bg-white/20 text-white border-white/30">
              Comprehensive Dental Care
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
            <p className="text-teal-100 text-lg max-w-2xl mb-8">
              Dr. Ilan Ofeck's clinic offers comprehensive dental care with a team of
              specialists. Each treatment is matched with the right professional for optimal results.
            </p>

            {/* Stats Badges */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-white">{SERVICES.length} Services</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Users className="w-4 h-4 text-white" />
                <span className="text-sm text-white">6 Specialists</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Zap className="w-4 h-4 text-white" />
                <span className="text-sm text-white">Book in 30 Seconds</span>
              </div>
            </div>
          </div>

          {/* Floating Quick Book Card */}
          <div className="hidden lg:block absolute -bottom-12 right-8 xl:right-16">
            <div className="bg-white rounded-2xl p-5 shadow-xl">
              <p className="text-sm text-gray-500 mb-2">Ready to book?</p>
              <Button variant="primary" size="md" onClick={handleOpenChat}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat with AI Assistant
              </Button>
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

      {/* Services List */}
      <Section background="white" padding="lg" className="pt-20 lg:pt-24 relative">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 right-20 w-72 h-72 bg-clinic-teal/5 rounded-full blur-3xl" />
          <div className="absolute bottom-40 left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <Container className="relative z-10">
          <div className="grid gap-6">
            {SERVICES.map((service) => {
              const isPopular = POPULAR_SERVICE_IDS.includes(service.id);
              const categoryIcon = CATEGORY_ICONS[service.category];

              return (
                <Card
                  key={service.id}
                  variant="outlined"
                  padding="none"
                  className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="flex">
                    {/* Category Color Accent */}
                    <div
                      className={`w-1.5 flex-shrink-0 ${
                        service.category === 'Preventive' ? 'bg-green-500' :
                        service.category === 'Aesthetic' ? 'bg-purple-500' :
                        service.category === 'Restorative' ? 'bg-blue-500' :
                        service.category === 'Endodontics' ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}
                    />

                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {/* Service Icon */}
                            <span className="text-2xl" role="img" aria-label={service.category}>
                              {categoryIcon}
                            </span>
                            <h2 className="text-xl font-bold text-gray-900 group-hover:text-clinic-teal transition-colors">
                              {service.name}
                            </h2>
                            <Badge variant={CATEGORY_COLORS[service.category] || 'default'} size="sm">
                              {service.category}
                            </Badge>
                            {isPopular && (
                              <Badge variant="warning" size="sm" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                ⭐ Popular
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-4">{service.description}</p>

                          {/* Includes */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {service.includes.map((item) => (
                              <span
                                key={item}
                                className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-clinic-teal/10 hover:text-clinic-teal transition-colors"
                              >
                                {item}
                              </span>
                            ))}
                          </div>

                          {/* Staff */}
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Performed by:</span>{' '}
                            {service.staff.join(', ')}
                          </p>
                        </div>

                        {/* Right Side - Duration & CTA */}
                        <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-3">
                          <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                            <Clock className="w-4 h-4 text-clinic-teal" />
                            <span className="text-sm font-medium">{service.duration} min</span>
                          </div>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleBookService(service.name)}
                            className="group/btn"
                          >
                            <span className="group-hover/btn:mr-1 transition-all">Book Now</span>
                            <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity">→</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Insurance Section */}
      <Section background="gray" padding="lg">
        <Container>
          <div className="text-center mb-8">
            <Badge variant="primary" className="mb-4">Insurance</Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              All Major Providers Accepted
            </h2>
            <p className="text-gray-600">
              We work with most insurance providers to make dental care accessible
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {INSURANCE_PROVIDERS.map((insurance) => (
              <Card
                key={insurance}
                variant="outlined"
                padding="md"
                className="text-center hover:shadow-md hover:border-clinic-teal/30 transition-all group"
              >
                <div className="w-12 h-12 bg-clinic-teal/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-clinic-teal" />
                </div>
                <p className="text-sm font-medium text-gray-700">{insurance}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section background="gradient" padding="lg" className="relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-40 h-40 border border-white/10 rounded-full" />
          <div className="absolute bottom-10 right-10 w-60 h-60 border border-white/10 rounded-full" />
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rounded-full blur-xl" />
        </div>

        <Container className="relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Book Your Treatment?</h2>
            <p className="text-teal-100 text-lg mb-8">
              Our AI assistant can help you find the perfect service and schedule your appointment in seconds. Available 24/7 for your convenience.
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

export default Services;
