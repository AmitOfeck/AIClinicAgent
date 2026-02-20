import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TEAM } from '@/constants';
import type { TeamMember } from '@/types';

interface TeamCardProps {
  member: TeamMember;
}

const TeamCard = ({ member }: TeamCardProps) => (
  <Card
    variant="default"
    padding="none"
    className="group overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
  >
    <div className="relative h-64 overflow-hidden bg-gray-100">
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover object-[center_25%] group-hover:scale-105 transition-transform duration-500"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.parentElement!.innerHTML = `
            <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-clinic-teal/20 to-clinic-teal/10">
              <span class="text-6xl">👨‍⚕️</span>
            </div>
          `;
        }}
      />
      <Badge
        variant="primary"
        size="sm"
        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-clinic-teal border-white/50"
      >
        {member.specialty}
      </Badge>
    </div>

    <div className="p-5">
      <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
      <p className="text-clinic-teal font-medium text-sm mb-2">{member.role}</p>
      <div className="flex flex-wrap gap-1">
        {member.services.slice(0, 2).map((service) => (
          <span
            key={service}
            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
          >
            {service}
          </span>
        ))}
        {member.services.length > 2 && (
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
            +{member.services.length - 2}
          </span>
        )}
      </div>
    </div>
  </Card>
);

export const TeamSection = () => {
  return (
    <Section background="gray" padding="lg" id="team">
      <Container>
        <div className="text-center mb-12">
          <Badge variant="primary" className="mb-4">Our Specialists</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Meet Our Team
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            Our team of experienced dental professionals is dedicated to providing
            you with the highest quality care.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAM.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      </Container>
    </Section>
  );
};
