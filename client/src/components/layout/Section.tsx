import { cn } from '@/lib/utils';

export type SectionBackground = 'white' | 'gray' | 'dark' | 'gradient' | 'transparent';
export type SectionPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  background?: SectionBackground;
  padding?: SectionPadding;
}

const SECTION_BACKGROUNDS: Record<SectionBackground, string> = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  dark: 'bg-gray-900 text-white',
  gradient: 'bg-gradient-to-br from-clinic-teal via-clinic-teal-dark to-blue-900 text-white',
  transparent: 'bg-transparent',
};

const SECTION_PADDING: Record<SectionPadding, string> = {
  none: '',
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-16',
  lg: 'py-16 md:py-24',
  xl: 'py-20 md:py-32',
};

export const Section = ({
  children,
  background = 'white',
  padding = 'lg',
  className,
  ...props
}: SectionProps) => {
  return (
    <section
      className={cn(
        'relative',
        SECTION_BACKGROUNDS[background],
        SECTION_PADDING[padding],
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
};

export default Section;
