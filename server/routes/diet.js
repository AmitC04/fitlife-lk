const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getMealTime = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 10.5) return 'Breakfast';
  if (hour >= 10.5 && hour < 15) return 'Lunch';
  if (hour >= 15 && hour < 18) return 'Snacks';
  if (hour >= 18 && hour < 22) return 'Dinner';
  return 'Dinner';
};

const calculateBMR = (user) => {
  const { weightKg, heightCm, age, sex } = user;
  if (sex === 'Male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
};

const calculateCalorieGoal = (user) => {
  const bmr = calculateBMR(user);
  const tdee = bmr * (user.activityFactor || 1.2);
  const goal = user.goal;
  if (goal === 'Weight Loss') return Math.round(tdee - 500);
  if (goal === 'Weight Gain') return Math.round(tdee + 500);
  return Math.round(tdee);
};

// POST /api/diet/generate
router.post('/generate', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { mealTime: requestedMealTime, menuText } = req.body;
    const mealTime = requestedMealTime || getMealTime();
    const calorieGoal = calculateCalorieGoal(user);

    let menuContext = '';
    if (menuText && menuText.trim()) {
      menuContext = `\n\nThe user has uploaded their mess/hostel menu. Here is the extracted text from it:\n"""\n${menuText}\n"""\nPlease suggest specific items FROM this menu with appropriate portions.`;
    } else if (user.uploadedMenuPath && fs.existsSync(user.uploadedMenuPath)) {
      menuContext = `\nNote: User has a menu uploaded but no text was extracted. Suggest general healthy options.`;
    }

    const prompt = `You are a professional nutritionist and dietitian. Create a personalized meal plan.

USER PROFILE:
- Name: ${user.name}
- Age: ${user.age} years
- Sex: ${user.sex}
- Weight: ${user.weightKg} kg
- Height: ${user.heightCm} cm
- Goal: ${user.goal}
- Medical Conditions: ${Array.isArray(user.conditions) ? user.conditions.join(', ') : user.conditions || 'None'}
- Physical Pain/Limitations: ${user.bodyPain || 'None'}
- Daily Calorie Target: ${calorieGoal} kcal
- Current Meal: ${mealTime}
${menuContext}

Please provide:
1. A personalized ${mealTime} meal plan with specific food items and quantities
2. Calorie count for each item and total calories for this meal
3. Macronutrient breakdown (Protein / Carbs / Fats in grams)
4. 2-3 health tips specific to their medical conditions and goal
5. Foods to AVOID for this meal given their conditions

Format your response as JSON with this exact structure:
{
  "mealTime": "${mealTime}",
  "totalCalories": <number>,
  "items": [
    { "name": "<food item>", "quantity": "<quantity>", "calories": <number>, "protein": <number>, "carbs": <number>, "fats": <number> }
  ],
  "macros": { "protein": <total grams>, "carbs": <total grams>, "fats": <total grams> },
  "tips": ["<tip1>", "<tip2>", "<tip3>"],
  "avoid": ["<food1>", "<food2>"],
  "note": "<any special note for this user>"
}`;
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2048,
    });
    const text = completion.choices[0].message.content;

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ message: 'Failed to parse AI response', raw: text });
    }
    const dietPlan = JSON.parse(jsonMatch[0]);
    res.json({ success: true, dietPlan, calorieGoal });
  } catch (err) {
    console.error('Diet generation error:', err);
    res.status(500).json({ message: 'Failed to generate diet plan', error: err.message });
  }
});

module.exports = router;
