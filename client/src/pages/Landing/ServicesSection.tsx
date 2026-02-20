import { Clock } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useChatContext } from '@/context/ChatContext';
import { SERVICES, CATEGORY_COLORS } from '@/constants';
import type { Service } from '@/types';

interface ServiceCardProps {
  service: Service;
  onBook: (serviceName: string) => void;
}

const ServiceCard = ({ service, onBook }: ServiceCardProps) => (
  <Card variant="outlined" padding="lg" hover className="group">
    <div className="flex items-start justify-between mb-4">
      <Badge className={CATEGORY_COLORS[service.category]} size="sm">
        {service.category}
      </Badge>
      <div className="flex items-center gap-1 text-gray-500 text-sm">
        <Clock className="w-4 h-4" />
        <span>{service.duration} min</span>
      </div>
    </div>

    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-clinic-teal transition-colors">
      {service.name}
    </h3>

    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
      {service.description}
    </p>

    <Button
      variant="ghost"
      size="sm"
      onClick={() => onBook(service.name)}
      className="w-full justify-center group-hover:bg-clinic-teal group-hover:text-white transition-all"
    >
      Book Now
    </Button>
  </Card>
);

export const ServicesSection = () => {
  const { openWithMessage } = useChatContext();

  const handleBook = (serviceName: string) => {
    openWithMessage(`I'd like to book an appointment for ${serviceName}`);
  };

  return (
    <Section background="white" padding="lg" id="services">
      <Container>
        <div className="text-center mb-12">
          <Badge variant="primary" className="mb-4">Our Services</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Comprehensive Dental Care
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            From routine cleanings to advanced procedures, our specialists provide
            personalized care for every dental need.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} onBook={handleBook} />
          ))}
        </div>
      </Container>
    </Section>
  );
};
