import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

interface KnowledgeBase {
  clinic: {
    name: string
    address: string
    phone: string
    email: string
    website: string
  }
  hours: {
    [key: string]: string
  }
  services: Array<{
    name: string
    duration: string
    price: string
    description: string
  }>
  team: Array<{
    name: string
    role: string
    bio: string
  }>
  insurance: string[]
  faqs: Array<{
    question: string
    answer: string
  }>
  policies: {
    cancellation: string
    payment: string
    emergency: string
  }
}

let knowledgeBase: KnowledgeBase | null = null

function loadKnowledgeBase(): KnowledgeBase {
  if (knowledgeBase) return knowledgeBase

  const knowledgePath = path.join(__dirname, '../data/clinic-knowledge.json')

  try {
    const data = fs.readFileSync(knowledgePath, 'utf-8')
    knowledgeBase = JSON.parse(data)
    return knowledgeBase!
  } catch (error) {
    console.error('Failed to load knowledge base:', error)
    // Return default knowledge base
    return getDefaultKnowledgeBase()
  }
}

function getDefaultKnowledgeBase(): KnowledgeBase {
  return {
    clinic: {
      name: "Dr. Opek's Dental Clinic",
      address: '123 Smile Street, Tel Aviv, Israel',
      phone: '(555) 123-4567',
      email: 'info@dropek-dental.com',
      website: 'https://dropek-dental.com',
    },
    hours: {
      'Sunday': '8:00 AM - 5:00 PM',
      'Monday': '8:00 AM - 5:00 PM',
      'Tuesday': '8:00 AM - 5:00 PM',
      'Wednesday': '8:00 AM - 5:00 PM',
      'Thursday': '8:00 AM - 5:00 PM',
      'Friday': '8:00 AM - 1:00 PM',
      'Saturday': 'Closed',
    },
    services: [
      {
        name: 'Routine Checkup & Cleaning',
        duration: '30 minutes',
        price: '$80',
        description: 'Comprehensive oral examination and professional cleaning to maintain your dental health.',
      },
      {
        name: 'Teeth Whitening',
        duration: '60 minutes',
        price: '$250',
        description: 'Professional in-office whitening treatment for a brighter, more confident smile.',
      },
      {
        name: 'Dental Implant Consultation',
        duration: '45 minutes',
        price: '$120',
        description: 'Evaluation and planning for dental implants, including X-rays and treatment options.',
      },
      {
        name: 'Root Canal Treatment',
        duration: '90 minutes',
        price: '$600',
        description: 'Treatment to save an infected tooth by removing the damaged pulp and sealing the canal.',
      },
      {
        name: 'Orthodontic Consultation',
        duration: '45 minutes',
        price: '$100',
        description: 'Assessment for braces or clear aligners to straighten your teeth.',
      },
      {
        name: 'Emergency Dental Care',
        duration: 'Varies',
        price: 'Starting at $150',
        description: 'Immediate care for dental emergencies like severe pain, broken teeth, or infections.',
      },
    ],
    team: [
      {
        name: 'Dr. Amit Opek',
        role: 'Lead Dentist & Founder',
        bio: 'Dr. Opek has over 15 years of experience in general and cosmetic dentistry. He graduated from Tel Aviv University School of Dental Medicine.',
      },
      {
        name: 'Dr. Sarah Cohen',
        role: 'Orthodontist',
        bio: 'Specializing in Invisalign and traditional braces, Dr. Cohen helps patients of all ages achieve beautiful smiles.',
      },
      {
        name: 'Maya Levy',
        role: 'Dental Hygienist',
        bio: 'Maya is dedicated to patient comfort and education, making every cleaning a pleasant experience.',
      },
    ],
    insurance: [
      'Maccabi Healthcare',
      'Clalit Health Services',
      'Meuhedet',
      'Leumit Health Fund',
      'Most private insurance plans',
    ],
    faqs: [
      {
        question: 'Do you accept walk-ins?',
        answer: 'We primarily see patients by appointment, but we do our best to accommodate emergencies. Please call ahead.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept cash, credit cards, and direct billing to most insurance providers.',
      },
      {
        question: 'Is parking available?',
        answer: 'Yes, free parking is available in the building lot.',
      },
      {
        question: 'Do you treat children?',
        answer: 'Yes, we welcome patients of all ages, including children. We have a kid-friendly waiting area.',
      },
    ],
    policies: {
      cancellation: 'Please provide at least 24 hours notice for cancellations to avoid a cancellation fee.',
      payment: 'Payment is due at the time of service. We can provide documentation for insurance reimbursement.',
      emergency: 'For after-hours emergencies, call our main line and follow the prompts for emergency care.',
    },
  }
}

export function searchKnowledge(query: string): any {
  const kb = loadKnowledgeBase()
  const queryLower = query.toLowerCase()
  const results: any = {}

  // Search services
  if (queryLower.includes('service') || queryLower.includes('treatment') || queryLower.includes('price') || queryLower.includes('cost')) {
    results.services = kb.services
  }

  // Search for specific service
  for (const service of kb.services) {
    if (queryLower.includes(service.name.toLowerCase())) {
      results.matchedService = service
    }
  }

  // Search hours
  if (queryLower.includes('hour') || queryLower.includes('open') || queryLower.includes('close') || queryLower.includes('when')) {
    results.hours = kb.hours
  }

  // Search team
  if (queryLower.includes('doctor') || queryLower.includes('dentist') || queryLower.includes('team') || queryLower.includes('staff')) {
    results.team = kb.team
  }

  // Search insurance
  if (queryLower.includes('insurance') || queryLower.includes('coverage') || queryLower.includes('accept')) {
    results.insurance = kb.insurance
  }

  // Search contact/location
  if (queryLower.includes('contact') || queryLower.includes('address') || queryLower.includes('location') || queryLower.includes('phone')) {
    results.contact = kb.clinic
  }

  // Search FAQs
  for (const faq of kb.faqs) {
    if (queryLower.includes(faq.question.toLowerCase().split(' ').slice(0, 3).join(' '))) {
      results.faq = faq
    }
  }

  // Search policies
  if (queryLower.includes('cancel') || queryLower.includes('policy')) {
    results.policies = kb.policies
  }

  // If no specific match, return general clinic info
  if (Object.keys(results).length === 0) {
    results.clinic = kb.clinic
    results.hours = kb.hours
  }

  return results
}
