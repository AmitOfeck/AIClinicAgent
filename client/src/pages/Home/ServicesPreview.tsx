import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Users } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useChatContext } from '@/context/ChatContext';
import { HIGHLIGHTED_SERVICES, CATEGORY_COLORS } from '@/constants/services';

export const ServicesPreview = () => {
  const { openWithMessage } = useChatContext();

  const handleBookService = (serviceName: string) => {
    openWithMessage(`I'd like to book an appointment for ${serviceName}`);
  };

  return (
    <Section background="gray" padding="lg">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Our Services
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-xl">
              Comprehensive dental care from routine cleanings to advanced procedures,
              all under one roof.
            </p>
          </div>
          <Link to="/services">
            <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Services
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {HIGHLIGHTED_SERVICES.map((service) => (
            <Card
              key={service.id}
              variant="default"
              padding="lg"
              hover
              className="group"
            >
              <div className="flex items-start justify-between mb-4">
                <Badge
                  className={CATEGORY_COLORS[service.category]}
                  size="sm"
                >
                  {service.category}
                </Badge>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-clinic-teal transition-colors">
                {service.name}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {service.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{service.duration} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{service.staff.length} specialist{service.staff.length > 1 ? 's' : ''}</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBookService(service.name)}
                className="w-full justify-center group-hover:bg-clinic-teal group-hover:text-white transition-all"
              >
                Book Appointment
              </Button>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default ServicesPreview;
