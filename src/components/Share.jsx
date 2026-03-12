import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Share() {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    const url = window.location.origin + window.location.pathname.replace(/\/share$/, '')
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }).catch(() => {
      // Fallback for older browsers
      setCopied(false)
    })
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="share-page">
      <h1>Share & Next Steps</h1>
      <p style={{ color: 'var(--color-brown-light)', marginBottom: 'var(--space-xl)', lineHeight: 1.6 }}>
        You've completed the TRUST-STI assessment. Here's what you can do next.
      </p>

      <div className="share-options">
        <div className="share-card">
          <h3>Share with Your Provider</h3>
          <p>
            Print or save your personalized recommendations to share with your healthcare provider
            during your visit. This can help start the conversation about your health needs.
          </p>
          <button className="btn btn-primary" onClick={handlePrint}>
            Print My Summary
          </button>
        </div>

        <div className="share-card">
          <h3>Share with a Friend</h3>
          <p>
            Know someone who might benefit from learning about sexual health?
            Share the TRUST-STI tool with them. Caring for our community starts with sharing knowledge.
          </p>
          <button className="btn btn-sage" onClick={handleCopyLink}>
            {copied ? 'Link Copied!' : 'Copy Link to Share'}
          </button>
        </div>

        <div className="share-card">
          <h3>View Your Full Summary</h3>
          <p>
            Review all your responses and recommendations in one place.
          </p>
          <button className="btn btn-secondary" onClick={() => navigate('/summary')}>
            View Summary
          </button>
        </div>
      </div>

      <div className="btn-group" style={{ justifyContent: 'space-between' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/recommendations')}>
          Back to Recommendations
        </button>
        <button className="btn btn-primary" onClick={() => navigate('/summary')}>
          View Full Summary
        </button>
      </div>
    </div>
  )
}
