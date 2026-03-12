import { useState, useCallback } from 'react'

export function useAssessment() {
  const [responses, setResponses] = useState({})

  const setAnswer = useCallback((questionId, value) => {
    setResponses(prev => ({ ...prev, [questionId]: value }))
  }, [])

  const toggleMultiAnswer = useCallback((questionId, value) => {
    setResponses(prev => {
      const current = prev[questionId] || []
      // If selecting "none" or "prefer_not", clear other selections
      if (value === 'none' || value === 'prefer_not') {
        return { ...prev, [questionId]: [value] }
      }
      // If selecting something else, remove "none" and "prefer_not"
      const filtered = current.filter(v => v !== 'none' && v !== 'prefer_not')
      if (filtered.includes(value)) {
        return { ...prev, [questionId]: filtered.filter(v => v !== value) }
      }
      return { ...prev, [questionId]: [...filtered, value] }
    })
  }, [])

  const getAnswer = useCallback((questionId) => {
    return responses[questionId]
  }, [responses])

  const isComplete = useCallback((questions) => {
    return questions.every(q => {
      const answer = responses[q.id]
      if (q.type === 'multi_choice') return answer && answer.length > 0
      return answer !== undefined && answer !== null && answer !== ''
    })
  }, [responses])

  const reset = useCallback(() => {
    setResponses({})
  }, [])

  return { responses, setAnswer, toggleMultiAnswer, getAnswer, isComplete, reset }
}
