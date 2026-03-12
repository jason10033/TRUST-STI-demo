import { useNavigate } from 'react-router-dom'
import siteContent from '../content/site.json'

export default function Welcome() {
  const navigate = useNavigate()
  const { welcome } = siteContent

  return (
    <div className="welcome-page">
      <img src="/logo.png" alt="TRUST-STI" className="welcome-logo" />
      <div className="welcome-badge">{siteContent.subtitle}</div>
      <h1>{welcome.heading}</h1>
      <h2>{welcome.subheading}</h2>
      <p className="welcome-description">{welcome.description}</p>

      <div className="how-it-works">
        <h3>{welcome.howItWorks.heading}</h3>
        <div className="steps-grid">
          {welcome.howItWorks.steps.map(step => (
            <div key={step.number} className="step-card">
              <div className="step-number">{step.number}</div>
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="welcome-disclaimer">{welcome.disclaimer}</p>

      <button
        className="btn btn-primary btn-lg"
        onClick={() => navigate('/education')}
      >
        {welcome.startButton}
      </button>
    </div>
  )
}
