import { MessageCircle, Phone, Shield, Users, Award, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/layout/Container';
import { useChatContext } from '@/context/ChatContext';
import { useTranslation } from '@/i18n';
import { CLINIC_INFO } from '@/constants';

interface TrustBadgeProps {
  icon: React.ElementType;
  text: string;
}

const TrustBadge = ({ icon: Icon, text }: TrustBadgeProps) => (
  <div className="flex items-center gap-2 text-white/80">
    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
      <Icon className="w-4 h-4" />
    </div>
    <span className="text-sm font-medium">{text}</span>
  </div>
);

export const HeroSection = () => {
  const { open } = useChatContext();
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-clinic-teal via-clinic-teal-dark to-blue-900" />

      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 border border-white/10 rounded-full" />
        <div className="absolute top-40 left-32 w-32 h-32 border border-white/5 rounded-full" />
        <div className="absolute bottom-20 right-10 w-96 h-96 border border-white/10 rounded-full" />
        <div className="absolute bottom-40 right-40 w-48 h-48 border border-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl" />
      </div>

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-white">
            <Badge variant="primary" className="mb-6 bg-white/10 border-white/20 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              {t.hero.badge}
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              {t.hero.title}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-teal-200">
                {t.hero.titleHighlight}
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-lg">
              {t.hero.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                variant="white"
                size="lg"
                onClick={open}
                leftIcon={<MessageCircle className="w-5 h-5" />}
              >
                {t.hero.cta}
              </Button>
              <Button
                variant="outline-white"
                size="lg"
                onClick={() => window.location.href = `tel:${CLINIC_INFO.phone}`}
                leftIcon={<Phone className="w-5 h-5" />}
              >
                {CLINIC_INFO.phone}
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center gap-6 lg:gap-8">
              <TrustBadge icon={Award} text={t.hero.trustBadges.experience} />
              <TrustBadge icon={Users} text={t.hero.trustBadges.patients} />
              <TrustBadge icon={Shield} text={t.hero.trustBadges.topRated} />
            </div>
          </div>

          {/* Right content - Hero image */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="group relative rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-500 hover:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.4)] hover:border-white/40">
                <img
                  src="/images/staff/team.jpg"
                  alt="Dr. Ilan Ofeck's Dental Clinic Team"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Floating card - AI booking */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t.hero.floatingCards.aiBooking}</p>
                    <p className="text-sm text-gray-500">{t.hero.floatingCards.available}</p>
                  </div>
                </div>
              </div>

              {/* Floating card - Rating */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {'★★★★★'.split('').map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                  <span className="font-bold text-gray-900">4.9</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{t.hero.floatingCards.googleReviews}</p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};
