import { Bot, Calendar, Clock, Shield } from 'lucide-react';
import type { Feature } from '@/types/clinic';

export const FEATURES: Feature[] = [
  {
    id: 'ai-booking',
    icon: Bot,
    title: 'AI-Powered Booking',
    description: 'Chat with our intelligent assistant 24/7 to schedule appointments, ask questions, and get instant responses.',
  },
  {
    id: 'smart-scheduling',
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Our system automatically matches you with the right specialist and finds the perfect time slot for your needs.',
  },
  {
    id: 'instant-confirmation',
    icon: Clock,
    title: 'Quick Confirmation',
    description: 'Receive instant appointment confirmations via email. No waiting, no phone tag.',
  },
  {
    id: 'personalized-care',
    icon: Shield,
    title: 'Personalized Care',
    description: 'We remember your preferences and history to provide tailored recommendations for your dental health.',
  },
];

// Why choose us items
export const WHY_CHOOSE_US = [
  'State-of-the-art equipment and technology',
  'Experienced team of specialists',
  'Comfortable and modern facility',
  'Flexible appointment times',
  'Insurance-friendly payment options',
  'Emergency care available',
];
