import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import educationContent from '../content/education.json'

const ICONS = {
  info: '\u2139\uFE0F',
  bacteria: '\uD83E\uDDA0',
  shield: '\uD83D\uDEE1\uFE0F',
  heart: '\u2764\uFE0F',
  community: '\uD83E\uDD1D',
}

export default function Education() {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(new Set([educationContent.sections[0]?.id]))

  const toggleSection = (id) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="education-page">
      <h1>{educationContent.title}</h1>
      <p className="education-intro">{educationContent.intro}</p>

      {educationContent.sections.map(section => (
        <div key={section.id} className="education-section">
          <h2 onClick={() => toggleSection(section.id)}>
            <span className={`section-icon ${section.icon}`}>
              {ICONS[section.icon] || '\u2139\uFE0F'}
            </span>
            {section.title}
            <span style={{ marginLeft: 'auto', fontSize: '1rem', opacity: 0.5 }}>
              {expanded.has(section.id) ? '\u25B2' : '\u25BC'}
            </span>
          </h2>

          {expanded.has(section.id) && (
            <>
              <p className="content">{section.content}</p>

              {section.keyPoints && (
                <ul className="key-points">
                  {section.keyPoints.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              )}

              {section.details && (
                <div className="sti-details">
                  {section.details.map(detail => (
                    <div key={detail.name} className="sti-card">
                      <h3>{detail.name}</h3>
                      <p>{detail.description}</p>
                      {detail.treatable && (
                        <span className="treatable-badge">Treatable with antibiotics</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ))}

      <div className="education-note">
        <p>{educationContent.note}</p>
      </div>

      <div className="btn-group" style={{ justifyContent: 'space-between' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          Back
        </button>
        <button className="btn btn-primary" onClick={() => navigate('/assessment/sexual-health')}>
          {educationContent.nextButton}
        </button>
      </div>
    </div>
  )
}
