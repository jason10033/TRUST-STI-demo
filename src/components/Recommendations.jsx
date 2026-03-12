import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateRecommendations } from '../services/recommendations'
import recommendationsContent from '../content/recommendations.json'

export default function Recommendations({ sexualHealthResponses, sdohResponses }) {
  const navigate = useNavigate()

  const results = useMemo(
    () => generateRecommendations(sexualHealthResponses, sdohResponses),
    [sexualHealthResponses, sdohResponses]
  )

  return (
    <div className="recommendations-page">
      <h1>{recommendationsContent.title}</h1>
      <p className="recommendations-intro">{recommendationsContent.intro}</p>

      {/* STI Testing Recommendation */}
      {results.testing && (
        <div className={`recommendation-card testing`}>
          <h2>{recommendationsContent.categories.sti_testing.title}</h2>
          <h3>{results.testing.heading}</h3>
          <p>{results.testing.message}</p>
          {results.testing.actions && (
            <ul className="action-items">
              {results.testing.actions.map((action, i) => (
                <li key={i}>{action}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Prevention */}
      {results.prevention.length > 0 && (
        <div className="recommendation-card">
          <h2>{recommendationsContent.categories.prevention.title}</h2>
          {results.prevention.map((rec, i) => (
            <div key={i} style={{ marginBottom: 'var(--space-md)' }}>
              <h3>{rec.heading}</h3>
              <p>{rec.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Support Services */}
      {results.supportServices.length > 0 && (
        <div className={`recommendation-card ${results.supportServices.some(s => s.urgent) ? 'urgent' : ''}`}>
          <h2>{recommendationsContent.categories.support_services.title}</h2>
          {results.supportServices.map((rec, i) => (
            <div key={i} style={{ marginBottom: 'var(--space-md)' }}>
              <h3>{rec.heading}</h3>
              <p>{rec.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Resources */}
      {results.resources.length > 0 && (
        <div className="recommendation-card">
          <h2>Helpful Resources</h2>
          {results.resources.map(category => (
            <div key={category.id} style={{ marginBottom: 'var(--space-lg)' }}>
              <h3>{category.title}</h3>
              <div className="resources-list">
                {category.resources.map((resource, i) => (
                  <div key={i} className="resource-item">
                    <div>
                      <div className="name">{resource.name}</div>
                      <div className="description">{resource.description}</div>
                      {resource.phone && (
                        <div style={{ marginTop: '0.25rem' }}>
                          <a href={`tel:${resource.phone}`}>{resource.phone}</a>
                        </div>
                      )}
                      {resource.url && (
                        <div style={{ marginTop: '0.25rem' }}>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            Visit website
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Talk to Your Provider */}
      <div className="provider-section">
        <h2>{recommendationsContent.providerSection.title}</h2>
        <p style={{ marginBottom: 'var(--space-md)', color: 'var(--color-brown-light)' }}>
          {recommendationsContent.providerSection.message}
        </p>
        <ul className="provider-tips">
          {recommendationsContent.providerSection.tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="btn-group" style={{ justifyContent: 'space-between' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/assessment/sdoh')}>
          {recommendationsContent.backButton}
        </button>
        <button className="btn btn-primary" onClick={() => navigate('/share')}>
          {recommendationsContent.nextButton}
        </button>
      </div>
    </div>
  )
}
