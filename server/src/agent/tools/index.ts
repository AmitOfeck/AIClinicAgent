import { tool } from 'ai'
import { z } from 'zod'
import { checkCalendarAvailability } from '../../services/calendar.js'
import { sendOwnerNotification } from '../../services/telegram.js'
import { searchKnowledge } from '../../services/knowledge.js'
import {
  createAppointment,
  getAppointmentById,
  getAppointmentsByEmail,
  getAppointmentsByStaffAndDate,
} from '../../db/appointments.js'
import {
  getPatientByEmail,
  upsertPatientPreferences,
  addPatientInterest,
  markPatientConverted,
  trackPatientInteraction,
} from '../../db/patients.js'
import {
  getAllServices,
  getServiceById,
  findServiceByKeywords,
  getServicesWithStaff,
} from '../../db/services.js'
import {
  getAllStaff,
  getStaffById,
  getStaffForServiceById,
  getStaffWorkingHours,
  getStaffWithServices,
} from '../../db/staff.js'

// Structured error types for self-correction
export type ToolErrorType =
  | 'NOT_FOUND'           // Entity not found (service, staff, patient)
  | 'NO_SLOTS'            // No available appointment slots
  | 'STAFF_NOT_WORKING'   // Staff doesn't work on requested day
  | 'VALIDATION_ERROR'    // Invalid input parameters
  | 'API_ERROR'           // External API failure
  | 'DATABASE_ERROR'      // Database operation failed

export interface ToolError {
  success: false
  errorType: ToolErrorType
  message: string
  suggestion?: string
  retryable?: boolean
}

export const tools = {
  getServices: tool({
    description: 'Get all available dental services with their details. Use this when a patient asks about services or treatments.',
    parameters: z.object({}),
    execute: async () => {
      try {
        const services = getServicesWithStaff()
        return {
          success: true,
          services: services.map((s) => ({
            id: s.id,
            name: s.name,
            description: s.description,
            durationMinutes: s.duration_minutes,
            category: s.category,
            staff: s.staff.map((st) => st.name),
          })),
        }
      } catch (error) {
        console.error('Get services error:', error)
        return {
          success: false,
          errorType: 'DATABASE_ERROR',
          message: 'Unable to fetch services',
          suggestion: 'Please try again or call the clinic directly at (555) 123-4567',
          retryable: true,
        } as ToolError
      }
    },
  }),

  getStaffForService: tool({
    description: 'Find which staff members can perform a specific service. Use this before checking availability.',
    parameters: z.object({
      serviceName: z.string().describe('Name or keywords of the service (e.g., "root canal", "cleaning", "implant")'),
    }),
    execute: async ({ serviceName }) => {
      try {
        const service = findServiceByKeywords(serviceName)
        if (!service) {
          return {
            success: false,
            errorType: 'NOT_FOUND',
            message: `Service "${serviceName}" not found`,
            suggestion: 'Ask the patient to clarify which treatment they need, or use getServices to show all available services',
            retryable: false,
          } as ToolError
        }

        const staff = getStaffForServiceById(service.id)
        if (staff.length === 0) {
          return {
            success: false,
            errorType: 'NOT_FOUND',
            message: `No staff members available for ${service.name}`,
            suggestion: 'This service may not be currently offered. Use getServices to find alternative treatments',
            retryable: false,
          } as ToolError
        }

        return {
          success: true,
          service: {
            id: service.id,
            name: service.name,
            durationMinutes: service.duration_minutes,
            category: service.category,
          },
          staff: staff.map((s) => ({
            id: s.id,
            name: s.name,
            role: s.role,
            specialty: s.specialty,
          })),
        }
      } catch (error) {
        console.error('Get staff for service error:', error)
        return {
          success: false,
          errorType: 'DATABASE_ERROR',
          message: 'Unable to find staff for this service',
          suggestion: 'Please try again or call the clinic directly',
          retryable: true,
        } as ToolError
      }
    },
  }),

  checkAvailability: tool({
    description: 'Check available appointment slots for a staff member on a specific date. Always get the staff member first using getStaffForService.',
    parameters: z.object({
      staffId: z.number().describe('ID of the staff member'),
      date: z.string().describe('Date to check in YYYY-MM-DD format'),
      serviceDuration: z.number().optional().describe('Duration of the service in minutes (default 30)'),
      serviceName: z.string().optional().describe('Name of the service (for calendar integration)'),
    }),
    execute: async ({ staffId, date, serviceDuration = 30, serviceName }) => {
      try {
        const staff = getStaffById(staffId)
        if (!staff) {
          return {
            available: false,
            errorType: 'NOT_FOUND',
            message: 'Staff member not found',
            suggestion: 'Use getStaffForService to find valid staff members for the requested service',
            slots: [],
            retryable: false,
          }
        }

        const dateObj = new Date(date)
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        const dayOfWeek = dayNames[dateObj.getDay()]

        const workingHours = getStaffWorkingHours(staffId)
        if (!workingHours || !workingHours[dayOfWeek] || workingHours[dayOfWeek].length === 0) {
          // Get staff's actual working days to provide helpful suggestion
          const workingDays = workingHours
            ? Object.entries(workingHours)
                .filter(([_, hours]) => hours && hours.length > 0)
                .map(([day]) => day)
            : []
          return {
            available: false,
            errorType: 'STAFF_NOT_WORKING',
            message: `${staff.name} does not work on ${dayOfWeek}s`,
            suggestion: workingDays.length > 0
              ? `${staff.name} works on: ${workingDays.join(', ')}. Try one of these days instead.`
              : 'Try a different staff member using getStaffForService',
            slots: [],
            staffName: staff.name,
            workingDays,
            retryable: false,
          }
        }

        // Get existing appointments for this staff on this date
        const existingAppointments = getAppointmentsByStaffAndDate(staffId, date)

        // Check Google Calendar for busy slots (clinic-wide events, vacations, etc.)
        const calendarResult = await checkCalendarAvailability(date, serviceName)
        const calendarAvailableSlots = new Set(calendarResult.slots)

        // Generate available slots based on working hours
        const slots: string[] = []
        for (const period of workingHours[dayOfWeek]) {
          const [startTime, endTime] = period.split('-')
          const [startHour, startMin] = startTime.split(':').map(Number)
          const [endHour, endMin] = endTime.split(':').map(Number)

          for (let h = startHour; h < endHour || (h === endHour && 0 < endMin); h++) {
            for (let m = 0; m < 60; m += 30) {
              if (h === startHour && m < startMin) continue
              const slotEnd = h * 60 + m + serviceDuration
              if (slotEnd > endHour * 60 + endMin) continue

              const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`

              // Check if this slot conflicts with existing DB appointments
              const slotStart = new Date(`${date}T${timeStr}:00`)
              const slotEndTime = new Date(slotStart.getTime() + serviceDuration * 60000)

              const hasDbConflict = existingAppointments.some((apt) => {
                const aptStart = new Date(apt.date_time)
                const aptEnd = new Date(aptStart.getTime() + 60 * 60000) // Assume 60 min
                return slotStart < aptEnd && slotEndTime > aptStart
              })

              // Check if slot is available in Google Calendar
              // If calendar is configured and returns slots, the slot must be in the available list
              // If calendar is not configured (fromCalendar=false), we skip calendar check
              const isCalendarAvailable = !calendarResult.fromCalendar || calendarAvailableSlots.has(timeStr)

              if (!hasDbConflict && isCalendarAvailable) {
                slots.push(timeStr)
              }
            }
          }
        }

        if (slots.length === 0) {
          return {
            available: false,
            errorType: 'NO_SLOTS',
            message: `No available slots for ${staff.name} on ${date}`,
            suggestion: 'Try a different date, or use getStaffForService to find another staff member who can perform this service',
            slots: [],
            staffName: staff.name,
            calendarChecked: calendarResult.fromCalendar,
            retryable: false,
          }
        }

        return {
          available: true,
          slots: slots.slice(0, 8), // Return max 8 slots
          date,
          staffId,
          staffName: staff.name,
          calendarChecked: calendarResult.fromCalendar,
        }
      } catch (error) {
        console.error('Check availability error:', error)
        return {
          available: false,
          errorType: 'DATABASE_ERROR',
          message: 'Unable to check availability',
          suggestion: 'Please try again or call the clinic directly at (555) 123-4567',
          slots: [],
          retryable: true,
        }
      }
    },
  }),

  getClinicTeam: tool({
    description: 'Get information about the clinic team and staff members.',
    parameters: z.object({}),
    execute: async () => {
      try {
        const staff = getStaffWithServices()
        return {
          success: true,
          team: staff.map((s) => ({
            id: s.id,
            name: s.name,
            role: s.role,
            specialty: s.specialty,
            services: s.services,
          })),
        }
      } catch (error) {
        console.error('Get clinic team error:', error)
        return {
          success: false,
          errorType: 'DATABASE_ERROR',
          message: 'Unable to fetch team information',
          suggestion: 'Please try again or call the clinic directly',
          retryable: true,
        } as ToolError
      }
    },
  }),

  createAppointment: tool({
    description: 'Create a new pending appointment. This will notify the clinic owner for approval.',
    parameters: z.object({
      patientName: z.string().describe('Full name of the patient'),
      patientEmail: z.string().email().describe('Email address for confirmation'),
      patientPhone: z.string().optional().describe('Phone number (optional)'),
      serviceId: z.number().describe('ID of the service'),
      service: z.string().describe('Name of the dental service'),
      staffId: z.number().describe('ID of the staff member'),
      dateTime: z.string().describe('Appointment date and time in ISO format (e.g., 2024-01-15T10:00:00)'),
    }),
    execute: async ({ patientName, patientEmail, patientPhone, serviceId, service, staffId, dateTime }) => {
      try {
        const staff = getStaffById(staffId)
        if (!staff) {
          return {
            success: false,
            errorType: 'NOT_FOUND',
            message: 'Staff member not found',
            suggestion: 'Use getStaffForService to find valid staff members for the requested service',
            retryable: false,
          } as ToolError
        }

        // Create the appointment in the database
        const appointment = createAppointment({
          patientName,
          patientEmail,
          patientPhone,
          serviceId,
          service,
          staffId,
          dateTime,
        })

        // Store/update patient preferences and track conversion
        upsertPatientPreferences(patientEmail, { name: patientName, phone: patientPhone })
        addPatientInterest(patientEmail, service)
        markPatientConverted(patientEmail)

        // Notify clinic owner via Telegram
        await sendOwnerNotification({
          appointmentId: appointment.id,
          patientName,
          patientEmail,
          service,
          dateTime,
          staffName: staff.name,
        })

        return {
          success: true,
          appointmentId: appointment.id,
          status: 'PENDING',
          staffName: staff.name,
          message: `Appointment request created with ${staff.name}. The clinic will review and confirm shortly. You'll receive an email at ${patientEmail} once approved.`,
        }
      } catch (error) {
        console.error('Create appointment error:', error)
        return {
          success: false,
          errorType: 'DATABASE_ERROR',
          message: 'Failed to create appointment',
          suggestion: 'Please try again or call the clinic directly at (555) 123-4567',
          retryable: true,
        } as ToolError
      }
    },
  }),

  searchKnowledgeBase: tool({
    description: 'Search the clinic knowledge base for information about services, pricing, hours, insurance, team, etc. Use this when patients ask about clinic policies, pricing, insurance, emergency procedures, or any general clinic information.',
    parameters: z.object({
      query: z.string().describe('What information to search for'),
    }),
    execute: async ({ query }) => {
      try {
        const results = searchKnowledge(query)
        if (!results || results.length === 0) {
          return {
            found: false,
            errorType: 'NOT_FOUND',
            message: `No information found for: "${query}"`,
            suggestion: 'Try different keywords or ask the patient to rephrase their question',
            retryable: false,
          }
        }
        return { found: true, results }
      } catch (error) {
        console.error('Knowledge search error:', error)
        return {
          found: false,
          errorType: 'DATABASE_ERROR',
          message: 'Unable to search knowledge base',
          suggestion: 'Please try again or contact the clinic directly for this information',
          retryable: true,
        }
      }
    },
  }),

  getPatientHistory: tool({
    description: 'Get patient history and preferences if they have visited before. ALWAYS use this when a patient provides their email to personalize the conversation and remember their preferences.',
    parameters: z.object({
      email: z.string().email().describe('Patient email to look up'),
    }),
    execute: async ({ email }) => {
      try {
        // Track that this patient interacted with us
        trackPatientInteraction(email)

        const patient = getPatientByEmail(email)
        const allAppointments = getAppointmentsByEmail(email)

        // Filter to only active appointments (PENDING/APPROVED)
        // DECLINED and CANCELLED appointments should not block new bookings
        const activeAppointments = allAppointments.filter(
          (apt) => apt.status === 'PENDING' || apt.status === 'APPROVED'
        )

        if (!patient && allAppointments.length === 0) {
          return {
            found: false,
            isNewPatient: true,
            message: 'New patient - no previous history',
            suggestion: 'Welcome them as a new patient and offer to help them book their first appointment',
          }
        }

        return {
          found: true,
          isNewPatient: allAppointments.length === 0,
          patient: patient || null,
          // Only return active appointments to avoid blocking re-bookings of declined slots
          activeAppointments: activeAppointments.slice(0, 5),
          // Include count of past appointments for context
          totalPastAppointments: allAppointments.filter(
            (apt) => apt.status === 'APPROVED'
          ).length,
        }
      } catch (error) {
        console.error('Patient history error:', error)
        return {
          found: false,
          errorType: 'DATABASE_ERROR',
          message: 'Unable to retrieve patient history',
          suggestion: 'Continue with the conversation - treat as a new patient',
          retryable: true,
        }
      }
    },
  }),

  savePatientPreference: tool({
    description: 'Save a patient preference or note for future reference (e.g., "prefers morning appointments", "allergic to latex"). Use this when a patient mentions any preference, allergy, or special requirement.',
    parameters: z.object({
      email: z.string().email().describe('Patient email'),
      preference: z.string().describe('Preference or note to save'),
    }),
    execute: async ({ email, preference }) => {
      try {
        const patient = getPatientByEmail(email)
        const existingPrefs = patient?.preferences ? JSON.parse(patient.preferences) : []
        existingPrefs.push(preference)

        upsertPatientPreferences(email, { preferences: JSON.stringify(existingPrefs) })

        return {
          success: true,
          message: 'Preference saved',
          totalPreferences: existingPrefs.length,
        }
      } catch (error) {
        console.error('Save preference error:', error)
        return {
          success: false,
          errorType: 'DATABASE_ERROR',
          message: 'Unable to save preference',
          suggestion: 'The preference was not saved but the conversation can continue',
          retryable: true,
        } as ToolError
      }
    },
  }),
}
