import { Calendar, Search, Brain, Users, ClipboardList } from 'lucide-react';
import type { ToolIconMap } from '@/types/chat';

export const TOOL_ICONS: ToolIconMap = {
  checkAvailability: {
    icon: Calendar,
    label: 'Checking availability',
    color: 'text-blue-600',
  },
  createAppointment: {
    icon: Calendar,
    label: 'Creating appointment',
    color: 'text-green-600',
  },
  searchKnowledgeBase: {
    icon: Search,
    label: 'Searching information',
    color: 'text-purple-600',
  },
  getPatientHistory: {
    icon: Brain,
    label: 'Looking up your history',
    color: 'text-orange-600',
  },
  savePatientPreference: {
    icon: Brain,
    label: 'Saving your preference',
    color: 'text-orange-600',
  },
  getStaffForService: {
    icon: Users,
    label: 'Finding specialists',
    color: 'text-teal-600',
  },
  getServices: {
    icon: ClipboardList,
    label: 'Loading services',
    color: 'text-indigo-600',
  },
  getClinicTeam: {
    icon: Users,
    label: 'Loading team info',
    color: 'text-teal-600',
  },
};

export const WELCOME_MESSAGE = `Hello! Welcome to Dr. Ilan Ofeck's Dental Clinic. I'm here to help you book appointments, answer questions about our services, or provide information about our clinic. How can I assist you today?`;

export const CHAT_PLACEHOLDER = 'Type your message...';

export const CHAT_API_ENDPOINT = '/api/chat';
