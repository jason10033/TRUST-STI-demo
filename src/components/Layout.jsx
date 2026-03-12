import { useLocation, Link } from 'react-router-dom'
import siteContent from '../content/site.json'

const ROUTE_TO_STEP = {
  '/education': 0,
  '/assessment/sexual-health': 1,
  '/assessment/sdoh': 2,
  '/recommendations': 3,
  '/share': 4,
}

export default function Layout({ children }) {
  const location = useLocation()
  const currentStep = ROUTE_TO_STEP[location.pathname]
  const showProgress = currentStep !== undefined

  return (
    <>
      <header className="app-header">
        <div className="header-content">
          <Link to="/" className="header-logo">
            TRUST<span>-STI</span>
          </Link>
          {showProgress && (
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-brown-light)' }}>
              Step {currentStep + 1} of {siteContent.modules.length}
            </span>
          )}
        </div>
        {showProgress && (
          <div className="progress-bar-container">
            <div className="progress-steps">
              <div className="progress-track">
                <div
                  className="progress-track-fill"
                  style={{ width: `${(currentStep / (siteContent.modules.length - 1)) * 100}%` }}
                />
              </div>
              {siteContent.modules.map((mod, i) => (
                <div
                  key={mod.id}
                  className={`progress-step ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}`}
                >
                  <div className="progress-step-dot">
                    {i < currentStep ? '\u2713' : i + 1}
                  </div>
                  <span className="progress-step-label">{mod.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="app-footer">
        <p>{siteContent.footer.text}</p>
        <p style={{ marginTop: '0.5rem', opacity: 0.8 }}>{siteContent.footer.privacyNote}</p>
      </footer>
    </>
  )
}
