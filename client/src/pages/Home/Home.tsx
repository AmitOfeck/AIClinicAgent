import { PageLayout } from '@/components/layout/PageLayout';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { ServicesPreview } from './ServicesPreview';
import { VideoSection } from './VideoSection';
import { LocationSection } from './LocationSection';
import { CTASection } from './CTASection';

export const Home = () => {
  return (
    <PageLayout>
      <HeroSection />
      <FeaturesSection />
      <ServicesPreview />
      <VideoSection />
      <LocationSection />
      <CTASection />
    </PageLayout>
  );
};

export default Home;
