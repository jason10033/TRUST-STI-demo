/**
 * Netlify Serverless Function: REDCap API Proxy
 *
 * Proxies requests to REDCap API, keeping the API token server-side.
 * Configure REDCAP_API_URL and REDCAP_API_TOKEN in Netlify environment variables.
 */

export async function handler(event) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const { REDCAP_API_URL, REDCAP_API_TOKEN } = process.env

  if (!REDCAP_API_URL || !REDCAP_API_TOKEN) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'REDCap not configured. Set REDCAP_API_URL and REDCAP_API_TOKEN in Netlify environment variables.' }),
    }
  }

  try {
    const { action, data, record_id, assessment_type } = JSON.parse(event.body)

    if (action === 'submit') {
      // Import record to REDCap
      const record = [{
        record_id: `TRUST_${Date.now()}`,
        ...data,
      }]

      const formData = new URLSearchParams()
      formData.append('token', REDCAP_API_TOKEN)
      formData.append('content', 'record')
      formData.append('format', 'json')
      formData.append('type', 'flat')
      formData.append('data', JSON.stringify(record))

      const response = await fetch(REDCAP_API_URL, {
        method: 'POST',
        body: formData,
      })

      const result = await response.text()
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, result }),
      }
    }

    if (action === 'get' && record_id) {
      const formData = new URLSearchParams()
      formData.append('token', REDCAP_API_TOKEN)
      formData.append('content', 'record')
      formData.append('format', 'json')
      formData.append('records', record_id)

      const response = await fetch(REDCAP_API_URL, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      }
    }

    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid action' }) }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    }
  }
}
