import { MessageCircle, Phone, ArrowRight } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { useChatContext } from '@/context/ChatContext';
import { useTranslation } from '@/i18n';
import { CLINIC_INFO } from '@/constants';

export const CTASection = () => {
  const { open } = useChatContext();
  const { t } = useTranslation();

  return (
    <Section background="gradient" padding="xl" className="relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2" />

      <Container size="lg" className="relative z-10">
        <div className="text-center">
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm">
            <span className="text-4xl">🦷</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            {t.cta.title}
          </h2>

          <p className="mt-6 text-xl text-white/80 max-w-2xl mx-auto">
            {t.cta.subtitle}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="white"
              size="xl"
              onClick={open}
              leftIcon={<MessageCircle className="w-5 h-5" />}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              {t.cta.chatButton}
            </Button>

            <Button
              variant="outline-white"
              size="xl"
              onClick={() => window.location.href = `tel:${CLINIC_INFO.phone}`}
              leftIcon={<Phone className="w-5 h-5" />}
            >
              {t.common.call} {CLINIC_INFO.phone}
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-white/60 text-sm">
            <span>✓ {t.cta.features.noWaiting}</span>
            <span>✓ {t.cta.features.instant}</span>
            <span>✓ {t.cta.features.available}</span>
          </div>
        </div>
      </Container>
    </Section>
  );
};
