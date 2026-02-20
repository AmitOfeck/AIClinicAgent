import { Play } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { YOUTUBE_EMBED_URL } from '@/constants';

export const VideoSection = () => {
  return (
    <Section background="gray" padding="lg" id="video">
      <Container size="lg">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-clinic-teal font-medium mb-4">
            <Play className="w-5 h-5" />
            <span>Watch Our Video</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Experience Our Clinic
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Take a virtual tour of our modern dental facility and meet our dedicated team
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Decorative blurs */}
          <div className="absolute -z-10 -top-8 -left-8 w-72 h-72 bg-clinic-teal/10 rounded-full blur-3xl" />
          <div className="absolute -z-10 -bottom-8 -right-8 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />

          {/* Video container */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
            <div className="aspect-video">
              <iframe
                src={YOUTUBE_EMBED_URL}
                title="Dr. Ilan Ofeck Dental Clinic"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Decorative frame */}
          <div className="absolute -inset-4 -z-10 rounded-3xl border-2 border-clinic-teal/20" />
        </div>
      </Container>
    </Section>
  );
};
