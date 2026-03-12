/**
 * REDCap API Service
 *
 * In mock mode: stores data in localStorage and logs to console.
 * In live mode: sends data through Netlify Function proxy to REDCap API.
 *
 * Toggle via VITE_REDCAP_MODE environment variable ("mock" or "live").
 */

const MODE = import.meta.env.VITE_REDCAP_MODE || 'mock'

function generateRecordId() {
  return 'TRUST_' + Date.now().toString(36).toUpperCase()
}

// --- Mock Implementation ---
const mockService = {
  async submitAssessment(assessmentType, data) {
    const recordId = generateRecordId()
    const record = {
      record_id: recordId,
      assessment_type: assessmentType,
      timestamp: new Date().toISOString(),
      ...data,
    }

    // Store in localStorage
    const stored = JSON.parse(localStorage.getItem('trust_sti_records') || '[]')
    stored.push(record)
    localStorage.setItem('trust_sti_records', JSON.stringify(stored))

    console.log(`[REDCap Mock] Submitted ${assessmentType} assessment:`, record)
    return { success: true, record_id: recordId }
  },

  async getRecord(recordId) {
    const stored = JSON.parse(localStorage.getItem('trust_sti_records') || '[]')
    return stored.filter(r => r.record_id === recordId)
  },

  async getAllRecords() {
    return JSON.parse(localStorage.getItem('trust_sti_records') || '[]')
  },
}

// --- Live Implementation ---
const liveService = {
  async submitAssessment(assessmentType, data) {
    const response = await fetch('/.netlify/functions/redcap-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'submit',
        assessment_type: assessmentType,
        data,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to submit to REDCap')
    }

    return response.json()
  },

  async getRecord(recordId) {
    const response = await fetch('/.netlify/functions/redcap-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'get',
        record_id: recordId,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch from REDCap')
    }

    return response.json()
  },
}

const redcapService = MODE === 'live' ? liveService : mockService

export default redcapService
