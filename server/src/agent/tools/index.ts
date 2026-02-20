import { tool } from 'ai'
import { z } from 'zod'
import { checkCalendarAvailability, createCalendarEvent } from '../../services/calendar.js'
import { sendOwnerNotification } from '../../services/telegram.js'
import { searchKnowledge } from '../../services/knowledge.js'
import {
  createAppointment,
  getAppointmentById,
  getAppointmentsByEmail,
  getAppointmentsByStaffAndDate,
} from '../../db/appointments.js'
import { getPatientByEmail, upsertPatientPreferences } from '../../db/patients.js'
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
  isStaffAvailable,
  getStaffWithServices,
} from '../../db/staff.js'

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
        return { success: false, error: 'Unable to fetch services' }
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
            message: `Service "${serviceName}" not found. Please ask the patient to clarify which treatment they need.`,
          }
        }

        const staff = getStaffForServiceById(service.id)
        if (staff.length === 0) {
          return {
            success: false,
            message: `No staff members available for ${service.name}`,
          }
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
        return { success: false, error: 'Unable to find staff for this service' }
      }
    },
  }),

  checkAvailability: tool({
    description: 'Check available appointment slots for a staff member on a specific date. Always get the staff member first using getStaffForService.',
    parameters: z.object({
      staffId: z.number().describe('ID of the staff member'),
      date: z.string().describe('Date to check in YYYY-MM-DD format'),
      serviceDuration: z.number().optional().describe('Duration of the service in minutes (default 30)'),
    }),
    execute: async ({ staffId, date, serviceDuration = 30 }) => {
      try {
        const staff = getStaffById(staffId)
        if (!staff) {
          return { available: false, message: 'Staff member not found', slots: [] }
        }

        const dateObj = new Date(date)
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        const dayOfWeek = dayNames[dateObj.getDay()]

        const workingHours = getStaffWorkingHours(staffId)
        if (!workingHours || !workingHours[dayOfWeek] || workingHours[dayOfWeek].length === 0) {
          return {
            available: false,
            message: `${staff.name} does not work on ${dayOfWeek}s`,
            slots: [],
            staffName: staff.name,
          }
        }

        // Get existing appointments for this staff on this date
        const existingAppointments = getAppointmentsByStaffAndDate(staffId, date)

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

              // Check if this slot conflicts with existing appointments
              const slotStart = new Date(`${date}T${timeStr}:00`)
              const slotEndTime = new Date(slotStart.getTime() + serviceDuration * 60000)

              const hasConflict = existingAppointments.some((apt) => {
                const aptStart = new Date(apt.date_time)
                const aptEnd = new Date(aptStart.getTime() + 60 * 60000) // Assume 60 min
                return slotStart < aptEnd && slotEndTime > aptStart
              })

              if (!hasConflict) {
                slots.push(timeStr)
              }
            }
          }
        }

        if (slots.length === 0) {
          return {
            available: false,
            message: `No available slots for ${staff.name} on ${date}`,
            slots: [],
            staffName: staff.name,
          }
        }

        return {
          available: true,
          slots: slots.slice(0, 8), // Return max 8 slots
          date,
          staffId,
          staffName: staff.name,
        }
      } catch (error) {
        console.error('Check availability error:', error)
        return {
          available: false,
          error: 'Unable to check availability. Please try again.',
          slots: [],
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
        return { success: false, error: 'Unable to fetch team information' }
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
          return { success: false, error: 'Staff member not found' }
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

        // Store/update patient preferences
        upsertPatientPreferences(patientEmail, { name: patientName })

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
          error: 'Failed to create appointment. Please try again or call us directly.',
        }
      }
    },
  }),

  searchKnowledgeBase: tool({
    description: 'Search the clinic knowledge base for information about services, pricing, hours, insurance, team, etc.',
    parameters: z.object({
      query: z.string().describe('What information to search for'),
    }),
    execute: async ({ query }) => {
      try {
        const results = searchKnowledge(query)
        return { found: true, results }
      } catch (error) {
        console.error('Knowledge search error:', error)
        return { found: false, error: 'Unable to search knowledge base' }
      }
    },
  }),

  getPatientHistory: tool({
    description: 'Get patient history and preferences if they have visited before. Use this to personalize the conversation.',
    parameters: z.object({
      email: z.string().email().describe('Patient email to look up'),
    }),
    execute: async ({ email }) => {
      try {
        const patient = getPatientByEmail(email)
        const appointments = getAppointmentsByEmail(email)

        if (!patient && appointments.length === 0) {
          return { found: false, message: 'New patient - no previous history' }
        }

        return {
          found: true,
          patient: patient || null,
          previousAppointments: appointments.slice(0, 5),
        }
      } catch (error) {
        console.error('Patient history error:', error)
        return { found: false, error: 'Unable to retrieve patient history' }
      }
    },
  }),

  savePatientPreference: tool({
    description: 'Save a patient preference or note for future reference (e.g., "prefers morning appointments", "allergic to latex")',
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

        return { success: true, message: 'Preference saved' }
      } catch (error) {
        console.error('Save preference error:', error)
        return { success: false, error: 'Unable to save preference' }
      }
    },
  }),
}
