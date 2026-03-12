import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateRecommendations } from '../services/recommendations'
import sexualHealthContent from '../content/sexual-health.json'
import sdohContent from '../content/sdoh.json'

function getAnswerLabel(questions, questionId, value) {
  const question = questions.find(q => q.id === questionId)
  if (!question) return value
  if (Array.isArray(value)) {
    return value.map(v => {
      const opt = question.options.find(o => o.value === v)
      return opt ? opt.label : v
    }).join(', ')
  }
  const option = question.options.find(o => o.value === value)
  return option ? option.label : value
}

export default function Summary({ sexualHealthResponses, sdohResponses }) {
  const navigate = useNavigate()

  const results = useMemo(
    () => generateRecommendations(sexualHealthResponses, sdohResponses),
    [sexualHealthResponses, sdohResponses]
  )

  const hasResponses = Object.keys(sexualHealthResponses).length > 0

  return (
    <div className="summary-page">
      <h1>Your TRUST-STI Summary</h1>
      <p style={{ color: 'var(--color-brown-light)', marginBottom: 'var(--space-xl)' }}>
        This is a summary of your assessment and personalized recommendations.
        You can print this page to share with your healthcare provider.
      </p>

      {/* Testing Recommendation Summary */}
      {results.testing && (
        <div className="summary-card">
          <h2>Testing Recommendation</h2>
          <p style={{ fontWeight: 600, color: 'var(--color-terracotta-dark)' }}>
            {results.testing.heading}
          </p>
          <p style={{ color: 'var(--color-brown-light)', marginTop: 'var(--space-sm)' }}>
            {results.testing.message}
          </p>
        </div>
      )}

      {/* Support Services */}
      {results.supportServices.length > 0 && (
        <div className="summary-card">
          <h2>Recommended Support Services</h2>
          {results.supportServices.map((service, i) => (
            <div key={i} style={{ marginBottom: 'var(--space-md)' }}>
              <p style={{ fontWeight: 600 }}>{service.heading}</p>
              <p style={{ color: 'var(--color-brown-light)', fontSize: 'var(--font-size-sm)' }}>
                {service.message}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Sexual Health Responses */}
      {hasResponses && (
        <div className="summary-card">
          <h2>Sexual Health Assessment Responses</h2>
          {sexualHealthContent.questions.map(q => {
            const answer = sexualHealthResponses[q.id]
            if (!answer) return null
            return (
              <div key={q.id} style={{ marginBottom: 'var(--space-md)', paddingBottom: 'var(--space-md)', borderBottom: '1px solid var(--color-sand)' }}>
                <p style={{ fontWeight: 500, fontSize: 'var(--font-size-sm)' }}>{q.text}</p>
                <p style={{ color: 'var(--color-terracotta)', fontSize: 'var(--font-size-sm)' }}>
                  {getAnswerLabel(sexualHealthContent.questions, q.id, answer)}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* SDOH Responses */}
      {Object.keys(sdohResponses).length > 0 && (
        <div className="summary-card">
          <h2>Well-Being Assessment Responses</h2>
          {sdohContent.questions.map(q => {
            const answer = sdohResponses[q.id]
            if (!answer) return null
            return (
              <div key={q.id} style={{ marginBottom: 'var(--space-md)', paddingBottom: 'var(--space-md)', borderBottom: '1px solid var(--color-sand)' }}>
                <p style={{ fontWeight: 500, fontSize: 'var(--font-size-sm)' }}>{q.text}</p>
                <p style={{ color: 'var(--color-terracotta)', fontSize: 'var(--font-size-sm)' }}>
                  {getAnswerLabel(sdohContent.questions, q.id, answer)}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* Resources */}
      {results.resources.length > 0 && (
        <div className="summary-card">
          <h2>Resources</h2>
          {results.resources.map(category => (
            <div key={category.id} style={{ marginBottom: 'var(--space-lg)' }}>
              <p style={{ fontWeight: 600, marginBottom: 'var(--space-sm)' }}>{category.title}</p>
              {category.resources.map((resource, i) => (
                <div key={i} style={{ marginBottom: 'var(--space-sm)', paddingLeft: 'var(--space-md)' }}>
                  <span style={{ fontWeight: 500 }}>{resource.name}</span>
                  {resource.phone && <span> — {resource.phone}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: 'center', margin: 'var(--space-2xl) 0' }}>
        <p style={{ color: 'var(--color-brown-light)', marginBottom: 'var(--space-lg)', fontStyle: 'italic' }}>
          Thank you for completing TRUST-STI. Your health matters, and taking this step shows strength and self-care.
        </p>
        <div className="btn-group" style={{ justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            Print Summary
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Return Home
          </button>
        </div>
      </div>
    </div>
  )
}
