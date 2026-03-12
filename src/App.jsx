import { Routes, Route } from 'react-router-dom'
import { useAssessment } from './hooks/useAssessment'
import Layout from './components/Layout'
import Welcome from './components/Welcome'
import Education from './components/Education'
import Assessment from './components/Assessment'
import Recommendations from './components/Recommendations'
import Share from './components/Share'
import Summary from './components/Summary'
import redcapService from './services/redcap'

import sexualHealthContent from './content/sexual-health.json'
import sdohContent from './content/sdoh.json'

export default function App() {
  const sexualHealth = useAssessment()
  const sdoh = useAssessment()

  const handleSubmitSexualHealth = () => {
    redcapService.submitAssessment('sexual_health', sexualHealth.responses)
  }

  const handleSubmitSdoh = () => {
    redcapService.submitAssessment('sdoh', sdoh.responses)
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/education" element={<Education />} />
        <Route
          path="/assessment/sexual-health"
          element={
            <Assessment
              content={sexualHealthContent}
              responses={sexualHealth.responses}
              onAnswer={(id, val) => {
                sexualHealth.setAnswer(id, val)
              }}
              onToggleMulti={sexualHealth.toggleMultiAnswer}
              nextPath="/assessment/sdoh"
              backPath="/education"
              onNavigateNext={handleSubmitSexualHealth}
            />
          }
        />
        <Route
          path="/assessment/sdoh"
          element={
            <Assessment
              content={sdohContent}
              responses={sdoh.responses}
              onAnswer={sdoh.setAnswer}
              onToggleMulti={sdoh.toggleMultiAnswer}
              nextPath="/recommendations"
              backPath="/assessment/sexual-health"
              onNavigateNext={handleSubmitSdoh}
            />
          }
        />
        <Route
          path="/recommendations"
          element={
            <Recommendations
              sexualHealthResponses={sexualHealth.responses}
              sdohResponses={sdoh.responses}
            />
          }
        />
        <Route path="/share" element={<Share />} />
        <Route
          path="/summary"
          element={
            <Summary
              sexualHealthResponses={sexualHealth.responses}
              sdohResponses={sdoh.responses}
            />
          }
        />
      </Routes>
    </Layout>
  )
}
