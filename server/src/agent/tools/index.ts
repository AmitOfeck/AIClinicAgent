import { tool } from 'ai'
import { z } from 'zod'
import { checkCalendarAvailability, createCalendarEvent } from '../../services/calendar.js'
import { sendOwnerNotification } from '../../services/telegram.js'
import { sendEmail } from '../../services/email.js'
import { searchKnowledge } from '../../services/knowledge.js'
import { createAppointment, getAppointmentById, getAppointmentsByEmail } from '../../db/appointments.js'
import { getPatientByEmail, upsertPatientPreferences } from '../../db/patients.js'

export const tools = {
  checkAvailability: tool({
    description: 'Check available appointment slots for a given date. Returns available time slots within clinic hours.',
    parameters: z.object({
      date: z.string().describe('Date to check in YYYY-MM-DD format'),
      service: z.string().optional().describe('Service type to check duration requirements'),
    }),
    execute: async ({ date, service }) => {
      try {
        const slots = await checkCalendarAvailability(date, service)
        if (slots.length === 0) {
          return { available: false, message: 'No available slots for this date', slots: [] }
        }
        return { available: true, slots, date }
      } catch (error) {
        console.error('Calendar availability error:', error)
        return {
          available: false,
          error: 'Unable to check calendar. Please try again or call the clinic directly at (555) 123-4567.',
          slots: []
        }
      }
    },
  }),

  createAppointment: tool({
    description: 'Create a new pending appointment. This will notify the clinic owner for approval.',
    parameters: z.object({
      patientName: z.string().describe('Full name of the patient'),
      patientEmail: z.string().email().describe('Email address for confirmation'),
      patientPhone: z.string().optional().describe('Phone number (optional)'),
      service: z.string().describe('Type of dental service'),
      dateTime: z.string().describe('Appointment date and time in ISO format'),
    }),
    execute: async ({ patientName, patientEmail, patientPhone, service, dateTime }) => {
      try {
        // Create the appointment in the database
        const appointment = createAppointment({
          patientName,
          patientEmail,
          patientPhone,
          service,
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
        })

        return {
          success: true,
          appointmentId: appointment.id,
          status: 'PENDING',
          message: `Appointment request created. The clinic owner will review and confirm shortly. You'll receive an email at ${patientEmail} once approved.`,
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
          previousAppointments: appointments.slice(0, 5), // Last 5 appointments
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
