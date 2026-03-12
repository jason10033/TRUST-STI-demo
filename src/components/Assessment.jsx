import { useNavigate } from 'react-router-dom'

export default function Assessment({ content, responses, onAnswer, onToggleMulti, nextPath, backPath }) {
  const navigate = useNavigate()

  return (
    <div className="assessment-page">
      <h1>{content.title}</h1>
      <p className="assessment-description">{content.description}</p>
      <p className="assessment-reassurance">{content.reassurance}</p>

      {content.questions.map((question, idx) => (
        <div key={question.id} className="question-card">
          <div className="question-number">Question {idx + 1} of {content.questions.length}</div>
          <div className="question-text">{question.text}</div>

          <div className="options-list">
            {question.options.map(option => {
              const isSelected = question.type === 'multi_choice'
                ? (responses[question.id] || []).includes(option.value)
                : responses[question.id] === option.value

              return (
                <label
                  key={option.value}
                  className={`option-label ${isSelected ? 'selected' : ''}`}
                >
                  <input
                    type={question.type === 'multi_choice' ? 'checkbox' : 'radio'}
                    name={question.id}
                    checked={isSelected}
                    onChange={() => {
                      if (question.type === 'multi_choice') {
                        onToggleMulti(question.id, option.value)
                      } else {
                        onAnswer(question.id, option.value)
                      }
                    }}
                  />
                  <span>{option.label}</span>
                </label>
              )
            })}
          </div>
          <button
            className="skip-btn"
            onClick={() => onAnswer(question.id, 'skipped')}
          >
            Skip this question
          </button>
        </div>
      ))}

      <div className="btn-group" style={{ justifyContent: 'space-between' }}>
        <button className="btn btn-secondary" onClick={() => navigate(backPath)}>
          {content.backButton}
        </button>
        <button
          className="btn btn-primary"
          onClick={() => navigate(nextPath)}
        >
          {content.nextButton}
        </button>
      </div>
    </div>
  )
}
