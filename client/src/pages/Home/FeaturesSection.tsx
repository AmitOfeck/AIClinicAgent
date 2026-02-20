import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { FEATURES } from '@/constants/features';

export const FeaturesSection = () => {
  return (
    <Section background="white" padding="lg">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Why Choose Us
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the future of dental care with our AI-powered booking system
            and personalized treatment approach.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.id}
                variant="outlined"
                padding="lg"
                hover
                className="text-center group"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-clinic-teal/10 flex items-center justify-center group-hover:bg-clinic-teal group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-7 h-7 text-clinic-teal group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
};

export default FeaturesSection;
