import { Clock } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SERVICES, CATEGORY_COLORS, INSURANCE_PROVIDERS } from '@/constants';

const Services = () => {
  const handleBookNow = () => {
    const chatButton = document.querySelector('[aria-label="Open chat"]') as HTMLButtonElement;
    chatButton?.click();
  };

  return (
    <PageLayout>
      {/* Header */}
      <Section background="gradient" padding="lg">
        <Container>
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-teal-100 max-w-2xl">
            Dr. Ilan Ofeck's clinic offers comprehensive dental care with a team of
            specialists. Each treatment is matched with the right professional for optimal results.
          </p>
        </Container>
      </Section>

      {/* Services List */}
      <Section background="white" padding="lg">
        <Container>
          <div className="grid gap-6">
            {SERVICES.map((service) => (
              <Card key={service.id} variant="outlined" padding="lg" className="hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-gray-900">
                        {service.name}
                      </h2>
                      <Badge variant={CATEGORY_COLORS[service.category] || 'default'}>
                        {service.category}
                      </Badge>
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
                      <span className="text-sm">{service.duration} min</span>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleBookNow}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Insurance Section */}
      <Section background="gray" padding="md">
        <Container>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Insurance</h2>
          <p className="text-gray-600 mb-4">We accept most major insurance providers:</p>
          <div className="flex flex-wrap gap-3">
            {INSURANCE_PROVIDERS.map((insurance) => (
              <span
                key={insurance}
                className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-700"
              >
                {insurance}
              </span>
            ))}
          </div>
        </Container>
      </Section>
    </PageLayout>
  );
};

export default Services;
