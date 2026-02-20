import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/i18n';
import { FEATURES, INSURANCE_PROVIDERS } from '@/constants';
import type { Feature } from '@/types';

interface FeatureCardProps {
  feature: Feature;
}

const FeatureCard = ({ feature }: FeatureCardProps) => {
  const Icon = feature.icon;
  return (
    <Card variant="outlined" padding="lg" hover className="text-center group">
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
};

interface InsuranceBadgeProps {
  provider: string;
}

const InsuranceBadge = ({ provider }: InsuranceBadgeProps) => (
  <div className="px-6 py-3 bg-gray-50 rounded-lg text-gray-700 font-medium hover:bg-clinic-teal/10 hover:text-clinic-teal transition-colors">
    {provider}
  </div>
);

export const WhyChooseUsSection = () => {
  const { t } = useTranslation();

  return (
    <Section background="white" padding="lg" id="why-us">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {t.whyChooseUs.title}
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            {t.whyChooseUs.subtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>

        {/* Insurance */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {t.whyChooseUs.insurance}
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {INSURANCE_PROVIDERS.map((provider) => (
              <InsuranceBadge key={provider} provider={provider} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
};
