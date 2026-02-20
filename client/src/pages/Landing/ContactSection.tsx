import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CLINIC_INFO } from '@/constants';

interface ContactItemProps {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  href?: string;
}

const ContactItem = ({ icon: Icon, label, children, href }: ContactItemProps) => {
  const content = (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-clinic-teal/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-clinic-teal" />
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-0.5">{label}</p>
        <p className="font-medium text-gray-900">{children}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block hover:opacity-80 transition-opacity">
        {content}
      </a>
    );
  }

  return content;
};

interface HoursRowProps {
  day: string;
  hours: string;
  isOpen: boolean;
  isToday: boolean;
}

const HoursRow = ({ day, hours, isOpen, isToday }: HoursRowProps) => (
  <div
    className={`flex items-center justify-between py-2 px-3 rounded-lg ${
      isToday ? 'bg-clinic-teal/5 font-medium' : ''
    }`}
  >
    <span className={isToday ? 'text-clinic-teal' : 'text-gray-700'}>
      {day}
      {isToday && (
        <span className="ml-2 text-xs bg-clinic-teal text-white px-2 py-0.5 rounded-full">
          Today
        </span>
      )}
    </span>
    <span className={isOpen ? 'text-gray-900' : 'text-gray-400'}>
      {hours}
    </span>
  </div>
);

export const ContactSection = () => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayHours = CLINIC_INFO.hours.find(h => h.day === today);

  return (
    <Section background="white" padding="lg" id="contact">
      <Container>
        <div className="text-center mb-12">
          <Badge variant="primary" className="mb-4">Contact Us</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Visit Our Clinic
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Conveniently located in the heart of Tel Aviv with easy access and parking
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Map */}
          <Card variant="default" padding="none" className="overflow-hidden">
            <div className="h-[400px] lg:h-[500px]">
              <iframe
                src={CLINIC_INFO.location.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Clinic Location"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </Card>

          {/* Contact info */}
          <div className="space-y-6">
            <Card variant="default" padding="lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Contact Information
              </h3>

              <div className="space-y-6">
                <ContactItem icon={MapPin} label="Address">
                  {CLINIC_INFO.address}
                </ContactItem>

                <ContactItem icon={Phone} label="Phone" href={`tel:${CLINIC_INFO.phone}`}>
                  {CLINIC_INFO.phone}
                </ContactItem>

                <ContactItem icon={Mail} label="Email" href={`mailto:${CLINIC_INFO.email}`}>
                  {CLINIC_INFO.email}
                </ContactItem>

                <ContactItem icon={Clock} label="Today's Hours">
                  {todayHours?.isOpen ? (
                    <span className="text-green-600">{todayHours.hours}</span>
                  ) : (
                    <span className="text-red-600">Closed</span>
                  )}
                </ContactItem>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => window.open(CLINIC_INFO.location.directionsUrl, '_blank')}
                  leftIcon={<Navigation className="w-5 h-5" />}
                >
                  Get Directions
                </Button>
              </div>
            </Card>

            {/* Hours card */}
            <Card variant="outlined" padding="lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-clinic-teal" />
                Opening Hours
              </h3>

              <div className="space-y-2">
                {CLINIC_INFO.hours.map((item) => (
                  <HoursRow
                    key={item.day}
                    day={item.day}
                    hours={item.hours}
                    isOpen={item.isOpen}
                    isToday={item.day === today}
                  />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
};
