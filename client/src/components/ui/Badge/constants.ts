import { cva, type VariantProps } from 'class-variance-authority';

export const badgeVariants = cva(
  // Base styles
  'inline-flex items-center font-medium rounded-full border',
  {
    variants: {
      variant: {
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
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;
