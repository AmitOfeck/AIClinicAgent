import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { badgeVariants, type BadgeVariants } from './constants';

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    BadgeVariants {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant, size, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Re-export types for backward compatibility
export type BadgeVariant = NonNullable<BadgeVariants['variant']>;
export type BadgeSize = NonNullable<BadgeVariants['size']>;

export default Badge;
