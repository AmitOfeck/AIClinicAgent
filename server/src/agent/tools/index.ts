import { tool } from 'ai'
import { z } from 'zod'
import { sendOwnerNotification } from '../../services/telegram.js'
import { searchKnowledge } from '../../services/knowledge.js'
import { createAppointment, getAppointmentById, getAppointmentsByEmail, getAppointmentsByStaffAndDate } from '../../db/appointments.js'
import { getPatientByEmail, upsertPatientPreferences } from '../../db/patients.js'
import { getStaffForService, getAllStaff, getStaffById, isStaffAvailable, getStaffWorkingHours } from '../../db/staff.js'
import { findServiceByKeywords, getServiceById, getAllServices, getServicesWithStaff } from '../../db/services.js'

export const tools = {
  // Find which staff member handles a specific service
  getStaffForService: tool({
    description: 'Find which staff member(s) can perform a specific service. Use this BEFORE checking availability to know whose schedule to check.',
    parameters: z.object({
      serviceName: z.string().describe('Name or keywords of the service (e.g., "root canal", "cleaning", "implants")'),
    }),
    execute: async ({ serviceName }) => {
      try {
        // First find the service
        const service = findServiceByKeywords(serviceName)
        if (!service) {
          return {
            found: false,
            message: `Service "${serviceName}" not found. Available services: Routine Checkup & Cleaning, Teeth Whitening, Root Canal Treatment, Dental Implants, Gum Disease Treatment, Pediatric Dentistry, Aesthetic Dentistry, Oral Surgery, Anxiety Management, General Consultation.`
          }
        }

        // Get staff who can do this service
        const staff = getStaffForService(service.name)
        if (staff.length === 0) {
          return {
            found: false,
            message: `No staff found for service "${service.name}".`
          }
        }

        return {
          found: true,
          service: {
            id: service.id,
            name: service.name,
            duration: service.duration_minutes,
            price: service.price,
          },
          staff: staff.map(s => ({
            id: s.id,
            name: s.name,
            role: s.role,
            specialty: s.specialty,
          })),
          message: `${service.name} is performed by: ${staff.map(s => s.name).join(', ')}`
        }
      } catch (error) {
        console.error('getStaffForService error:', error)
        return { found: false, error: 'Unable to find staff for this service.' }
      }
    },
  }),

  // Check availability for a specific staff member
  checkAvailability: tool({
    description: 'Check available appointment slots for a specific staff member on a given date. Returns available time slots.',
    parameters: z.object({
      date: z.string().describe('Date to check in YYYY-MM-DD format'),
      staffId: z.number().describe('ID of the staff member to check availability for'),
      durationMinutes: z.number().optional().describe('Duration of the appointment in minutes (default: 30)'),
    }),
    execute: async ({ date, staffId, durationMinutes = 30 }) => {
      try {
        const staff = getStaffById(staffId)
        if (!staff) {
          return { available: false, error: 'Staff member not found', slots: [] }
        }

        // Get day of week
        const dateObj = new Date(date)
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        const dayOfWeek = days[dateObj.getDay()]

        // Get staff working hours
        const workingHours = getStaffWorkingHours(staffId)
        if (!workingHours || !workingHours[dayOfWeek] || workingHours[dayOfWeek].length === 0) {
          return {
            available: false,
            staffName: staff.name,
            message: `${staff.name} does not work on ${dayOfWeek}s.`,
            slots: []
          }
        }

        // Get existing appointments for this staff on this date
        const existingAppointments = getAppointmentsByStaffAndDate(staffId, date)
        const bookedTimes = existingAppointments.map(a => {
          const time = a.date_time.split('T')[1]?.substring(0, 5) || ''
          return time
        })

        // Generate available slots
        const slots: string[] = []
        for (const range of workingHours[dayOfWeek]) {
          const [start, end] = range.split('-')
          let currentHour = parseInt(start.split(':')[0])
          let currentMinute = parseInt(start.split(':')[1])
          const endHour = parseInt(end.split(':')[0])
          const endMinute = parseInt(end.split(':')[1])

          while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
            const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`

            // Check if slot is not already booked
            if (!bookedTimes.includes(timeStr)) {
              slots.push(timeStr)
            }

            // Move to next slot (30 min intervals)
            currentMinute += 30
            if (currentMinute >= 60) {
              currentMinute = 0
              currentHour++
            }
          }
        }

        if (slots.length === 0) {
          return {
            available: false,
            staffName: staff.name,
            date,
            message: `${staff.name} has no available slots on ${date}.`,
            slots: []
          }
        }

        return {
          available: true,
          staffId,
          staffName: staff.name,
          date,
          slots,
          message: `${staff.name} has ${slots.length} available slots on ${date}.`
        }
      } catch (error) {
        console.error('checkAvailability error:', error)
        return {
          available: false,
          error: 'Unable to check availability. Please try again or call us at 03-5467032.',
          slots: []
        }
      }
    },
  }),

  // Create appointment with staff assignment
  createAppointment: tool({
    description: 'Create a new pending appointment with a specific staff member. This will notify the clinic owner for approval.',
    parameters: z.object({
      patientName: z.string().describe('Full name of the patient'),
      patientEmail: z.string().email().describe('Email address for confirmation'),
      patientPhone: z.string().optional().describe('Phone number (optional)'),
      serviceId: z.number().describe('ID of the service'),
      serviceName: z.string().describe('Name of the service'),
      staffId: z.number().describe('ID of the staff member who will perform the service'),
      dateTime: z.string().describe('Appointment date and time in ISO format (YYYY-MM-DDTHH:MM:SS)'),
    }),
    execute: async ({ patientName, patientEmail, patientPhone, serviceId, serviceName, staffId, dateTime }) => {
      try {
        const staff = getStaffById(staffId)
        if (!staff) {
          return { success: false, error: 'Staff member not found.' }
        }

        // Create the appointment in the database
        const appointment = createAppointment({
          patientName,
          patientEmail,
          patientPhone,
          serviceId,
          service: serviceName,
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
          service: serviceName,
          staffName: staff.name,
          dateTime,
        })

        return {
          success: true,
          appointmentId: appointment.id,
          status: 'PENDING',
          staffName: staff.name,
          message: `Appointment request created for ${serviceName} with ${staff.name}. The clinic owner will review and confirm shortly. You'll receive an email at ${patientEmail} once approved.`,
        }
      } catch (error) {
        console.error('createAppointment error:', error)
        return {
          success: false,
          error: 'Failed to create appointment. Please try again or call us at 03-5467032.',
        }
      }
    },
  }),

  // Search knowledge base
  searchKnowledgeBase: tool({
    description: 'Search the clinic knowledge base for information about services, pricing, hours, insurance, team, policies, etc.',
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

  // Get patient history
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

  // Save patient preference
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

  // List all services
  listServices: tool({
    description: 'Get a list of all available services with their prices and which staff performs them.',
    parameters: z.object({}),
    execute: async () => {
      try {
        const services = getServicesWithStaff()
        return {
          success: true,
          services: services.map(s => ({
            id: s.id,
            name: s.name,
            duration: s.duration_minutes,
            price: s.price,
            category: s.category,
            staff: s.staff.map(st => st.name),
          }))
        }
      } catch (error) {
        console.error('listServices error:', error)
        return { success: false, error: 'Unable to list services' }
      }
    },
  }),

  // List all staff
  listStaff: tool({
    description: 'Get a list of all staff members with their roles and specialties.',
    parameters: z.object({}),
    execute: async () => {
      try {
        const staff = getAllStaff()
        return {
          success: true,
          staff: staff.map(s => ({
            id: s.id,
            name: s.name,
            role: s.role,
            specialty: s.specialty,
          }))
        }
      } catch (error) {
        console.error('listStaff error:', error)
        return { success: false, error: 'Unable to list staff' }
      }
    },
  }),
}
