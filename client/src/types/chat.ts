import type { LucideIcon } from 'lucide-react';

// Tool types
export type ToolName =
  | 'checkAvailability'
  | 'createAppointment'
  | 'searchKnowledgeBase'
  | 'getPatientHistory'
  | 'savePatientPreference'
  | 'getStaffForService'
  | 'getServices'
  | 'getClinicTeam';

export type ToolState = 'pending' | 'result';

export interface ToolInvocation {
  toolName: ToolName;
  state: ToolState;
  toolCallId: string;
  args?: Record<string, unknown>;
  result?: unknown;
}

// Message types
export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  toolInvocations?: ToolInvocation[];
  createdAt?: Date;
}

// Tool icon mapping type
export interface ToolIconMapping {
  icon: LucideIcon;
  label: string;
  color: string;
}

export type ToolIconMap = Record<ToolName, ToolIconMapping>;

// Chat state types
export interface ChatState {
  isOpen: boolean;
  isMinimized: boolean;
  isLoading: boolean;
  error: Error | null;
}
