/**
 * predictionEngine.js
 * Centralized service for health condition risk assessment and cycle prediction.
 */

/**
 * Predicts the cycle phase for a given day in the current month.
 * Uses the user's cycleLength and periodLength profile settings.
 * 
 * @param {number} day - The day of the month (1-31)
 * @param {Object} user - The user profile object containing cycleLength and periodLength
 * @returns {string} - 'period', 'ovulation', 'fertile', or 'normal'
 */
export const predictCycle = (day, user) => {
  // Default fallbacks if user data is missing
  const periodLen = parseInt(user?.periodLength, 10) || 5;
  const cycleLen = parseInt(user?.cycleLength, 10) || 28;

  // Luteal phase is generally 14 days, so ovulation is roughly (cycleLength - 14)
  const ovulationDay = Math.max(1, cycleLen - 14);
  
  // Fertile window is typically 5 days leading up to ovulation and the day of ovulation
  const fertileStart = Math.max(1, ovulationDay - 5);
  const fertileEnd = ovulationDay;

  // Since we don't have a historical database of past dates yet, 
  // we align the start of the cycle to the 1st of the month for visual demonstration.
  if (day >= 1 && day <= periodLen) {
    return 'period';
  }
  
  if (day === ovulationDay) {
    return 'ovulation';
  }
  
  if (day >= fertileStart && day <= fertileEnd) {
    return 'fertile';
  }

  return 'normal';
};

/**
 * Calculates the risk level for Anaemia based on onboarding responses.
 * 
 * @param {Object} responses - Onboarding questionnaire responses
 * @returns {string} - 'High', 'Moderate', or 'Low'
 */
export const calculateAnaemiaRisk = (responses) => {
  if (!responses) return 'Low';
  
  let riskPoints = 0;
  if (responses.fatigue === 'yes') riskPoints += 2;
  if (responses.dizzy === 'yes') riskPoints += 3;
  if (responses.heavyBleeding === 'yes') riskPoints += 2;
  if (responses.nutrition === 'poor') riskPoints += 1;
  
  if (riskPoints >= 5) return 'High';
  if (riskPoints >= 2) return 'Moderate';
  return 'Low';
};

/**
 * Unified risk calculation for other health conditions.
 * Evaluates risk based on specific severity factors mapped to the condition.
 * 
 * @param {string} conditionKey - e.g., 'pcos', 'endometriosis', 'nutrition'
 * @param {Object} responses - User's onboarding responses
 * @param {Object} user - Full user profile (used to check cross-condition risks like Anaemia)
 * @returns {Object} - { percentage: number, label: string, color: string }
 */
export const calculateConditionRisk = (conditionKey, responses = {}, user = null) => {
  const CONDITION_FACTORS = {
    pcos: ['acne', 'irregularPeriods'],
    endometriosis: ['severeCramps', 'heavyBleeding'],
    nutrition: ['nutrition']
  };

  const severityFactors = CONDITION_FACTORS[conditionKey] || [];
  let score = 0;
  let maxScore = severityFactors.length;

  // No factors defined = low risk
  if (maxScore === 0) {
    return { percentage: 20, label: "Low Risk", color: "text-health-green" };
  }

  severityFactors.forEach(factor => {
    if (responses[factor] === 'yes' || responses[factor] === 'poor') {
      score++;
    }
  });

  // Cross-condition influence: if checking for anaemia directly through this wrapper
  if (conditionKey === 'anaemia' && user) {
    if (user.anaemiaRisk === 'High') score = maxScore;
    else if (user.anaemiaRisk === 'Moderate') score = Math.max(score, Math.ceil(maxScore * 0.5));
  }

  const percentage = Math.round((score / maxScore) * 100);

  if (percentage >= 70) {
    return { percentage, label: "High Risk", color: "text-health-red" };
  }
  if (percentage >= 40) {
    return { percentage, label: "Moderate", color: "text-health-orange" };
  }
  
  // Return minimum 15% to show active tracking even if no symptoms
  return { 
    percentage: Math.max(percentage, 15), 
    label: "Low Risk", 
    color: "text-health-green" 
  };
};
