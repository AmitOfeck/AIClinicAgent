import { PageLayout } from '@/components/layout/PageLayout';
import {
  HeroSection,
  ServicesSection,
  TeamSection,
  WhyChooseUsSection,
  VideoSection,
  ContactSection,
  CTASection,
} from './Landing';

const LandingPage = () => {
  return (
    <PageLayout>
      <HeroSection />
      <ServicesSection />
      <TeamSection />
      <WhyChooseUsSection />
      <VideoSection />
      <ContactSection />
      <CTASection />
    </PageLayout>
  );
};

export default LandingPage;
