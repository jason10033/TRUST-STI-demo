/**
 * Recommendation Engine
 *
 * Generates personalized recommendations based on sexual health
 * and SDOH assessment responses.
 */

import recommendationsContent from '../content/recommendations.json'
import resourcesContent from '../content/resources.json'

export function generateRecommendations(sexualHealthResponses, sdohResponses) {
  const results = {
    testing: null,
    prevention: [],
    supportServices: [],
    resources: [],
  }

  // --- STI Testing Recommendation ---
  const sh = sexualHealthResponses
  const recs = recommendationsContent.categories.sti_testing.recommendations

  // Pregnancy = highest priority
  if (sh.sh_05 === 'pregnant' || sh.sh_05 === 'planning') {
    results.testing = { ...recs.pregnancy_priority, priority: 'high' }
  }
  // Symptoms, not tested recently, multiple partners, or history of STI
  else if (
    (sh.sh_04 && sh.sh_04.length > 0 && !sh.sh_04.includes('none')) ||
    sh.sh_01 === 'no' ||
    sh.sh_01 === 'unsure' ||
    sh.sh_02 === '2-4' ||
    sh.sh_02 === '5+' ||
    sh.sh_06 === 'yes'
  ) {
    results.testing = { ...recs.high_priority, priority: 'high' }
  }
  // Recently tested but other risk factors
  else if (sh.sh_01 === 'yes' && (sh.sh_03 === 'sometimes' || sh.sh_03 === 'rarely' || sh.sh_03 === 'never')) {
    results.testing = { ...recs.moderate_priority, priority: 'moderate' }
  }
  // All good
  else {
    results.testing = { ...recs.routine, priority: 'low' }
  }

  // --- Prevention Recommendations ---
  const prevention = recommendationsContent.categories.prevention.recommendations

  if (['sometimes', 'rarely', 'never'].includes(sh.sh_03)) {
    results.prevention.push(prevention.condom_use)
  }

  if (sh.sh_02 === '2-4' || sh.sh_02 === '5+') {
    results.prevention.push(prevention.prep_info)
  }

  // --- Support Service Recommendations ---
  const support = recommendationsContent.categories.support_services.recommendations
  const sdoh = sdohResponses

  // Mental health
  if (sdoh.sdoh_07 === 'more_than_half' || sdoh.sdoh_07 === 'nearly_every_day') {
    results.supportServices.push({ ...support.mental_health, urgent: sdoh.sdoh_07 === 'nearly_every_day' })
  }

  // Substance use
  if (sdoh.sdoh_08 === 'yes') {
    results.supportServices.push(support.substance_use)
  }

  // Safety
  if (sdoh.sdoh_06 === 'no' || sdoh.sdoh_06 === 'sometimes') {
    results.supportServices.push({ ...support.safety, urgent: true })
  }

  // Basic needs (food, housing, transportation)
  if (
    sdoh.sdoh_03 === 'often' || sdoh.sdoh_03 === 'always' ||
    sdoh.sdoh_04 === 'serious' ||
    sdoh.sdoh_05 === 'rarely'
  ) {
    results.supportServices.push(support.basic_needs)
  }

  // --- Gather relevant resources ---
  const resourceIds = new Set(['sti_testing'])

  if (results.prevention.length > 0) resourceIds.add('hiv_prevention')
  if (results.supportServices.some(s => s === support.mental_health || s?.heading === 'Mental Health Support')) {
    resourceIds.add('mental_health')
  }
  if (results.supportServices.some(s => s === support.substance_use || s?.heading === 'Substance Use Support')) {
    resourceIds.add('substance_use')
  }
  if (results.supportServices.some(s => s?.urgent && s?.heading === 'Safety Resources')) {
    resourceIds.add('safety')
  }
  if (results.supportServices.some(s => s === support.basic_needs || s?.heading === 'Community Resources')) {
    resourceIds.add('basic_needs')
  }

  results.resources = resourcesContent.categories.filter(c => resourceIds.has(c.id))

  return results
}
