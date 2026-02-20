import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'outline'
  | 'preventive'
  | 'aesthetic'
  | 'restorative'
  | 'endodontics'
  | 'surgery';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const BADGE_VARIANTS: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  primary: 'bg-clinic-teal/10 text-clinic-teal border-clinic-teal/20',
  secondary: 'bg-gray-100 text-gray-600 border-gray-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  outline: 'bg-transparent text-gray-700 border-gray-300',
  // Service category variants
  preventive: 'bg-green-100 text-green-800 border-green-200',
  aesthetic: 'bg-purple-100 text-purple-800 border-purple-200',
  restorative: 'bg-blue-100 text-blue-800 border-blue-200',
  endodontics: 'bg-orange-100 text-orange-800 border-orange-200',
  surgery: 'bg-red-100 text-red-800 border-red-200',
};

const BADGE_SIZES: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-sm',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'default', size = 'md', className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full border',
          BADGE_VARIANTS[variant],
          BADGE_SIZES[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
