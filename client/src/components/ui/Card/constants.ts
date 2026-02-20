import { cva, type VariantProps } from 'class-variance-authority';

export const cardVariants = cva(
  // Base styles
  'rounded-xl transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-white shadow-sm border border-gray-100',
        elevated: 'bg-white shadow-lg',
        outlined: 'bg-white border-2 border-gray-200',
        ghost: 'bg-gray-50',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      hover: {
        true: 'hover:shadow-md hover:-translate-y-1 cursor-pointer',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      hover: false,
    },
  }
);

export type CardVariants = VariantProps<typeof cardVariants>;
