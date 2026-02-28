// Mifflin-St Jeor Formula
export const calculateBMR = ({ weightKg, heightCm, age, sex }) => {
  if (sex === 'Male') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
  }
  return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
};

export const calculateBMI = ({ weightKg, heightCm }) => {
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
};

export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return { label: 'Underweight', color: '#60a5fa' };
  if (bmi < 25) return { label: 'Normal', color: '#4ade80' };
  if (bmi < 30) return { label: 'Overweight', color: '#facc15' };
  return { label: 'Obese', color: '#f87171' };
};

export const calculateTDEE = (bmr, activityFactor = 1.2) => {
  return Math.round(bmr * activityFactor);
};

export const calculateDailyCalories = (tdee, goal) => {
  if (goal === 'Weight Loss') return tdee - 500;
  if (goal === 'Weight Gain') return tdee + 500;
  return tdee;
};

export const getMealTime = () => {
  const hour = new Date().getHours() + new Date().getMinutes() / 60;
  if (hour >= 6 && hour < 10.5) return 'Breakfast';
  if (hour >= 10.5 && hour < 15) return 'Lunch';
  if (hour >= 15 && hour < 18) return 'Snacks';
  if (hour >= 18 && hour < 22) return 'Dinner';
  return 'Dinner';
};
