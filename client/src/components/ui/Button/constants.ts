import type { ButtonVariant, ButtonSize } from './types';

export const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-clinic-teal text-white hover:bg-clinic-teal-dark active:bg-clinic-teal-dark shadow-sm',
  secondary:
    'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300',
  outline:
    'border-2 border-clinic-teal text-clinic-teal hover:bg-clinic-teal hover:text-white',
  ghost:
    'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  white:
    'bg-white text-clinic-teal hover:bg-gray-50 shadow-sm',
  'outline-white':
    'border-2 border-white text-white hover:bg-white hover:text-clinic-teal',
};

export const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
  xl: 'px-6 py-3 text-lg',
};
