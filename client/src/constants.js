// ============================================================
// CHANGE THIS: App name and branding
// ============================================================
export const APP_NAME = 'FitLife';
export const APP_TAGLINE = 'Your AI-Powered Health & Fitness Companion';

// ============================================================
// CHANGE THIS: API base URL (update for production deployment)
// ============================================================
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const GOALS = ['Weight Loss', 'Weight Gain', 'Maintain Fitness', 'Build Muscle'];
export const CONDITIONS = ['Diabetes', 'Hypertension', 'PCOD', 'Thyroid', 'Heart Disease', 'Asthma', 'None'];
export const BODY_PARTS = ['Core', 'Arms', 'Legs', 'Back', 'Chest', 'Full Body'];
export const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export const ACTIVITY_FACTORS = {
  'Sedentary (desk job, little exercise)': 1.2,
  'Lightly Active (light exercise 1-3 days/week)': 1.375,
  'Moderately Active (moderate exercise 3-5 days/week)': 1.55,
  'Very Active (hard exercise 6-7 days/week)': 1.725,
};
