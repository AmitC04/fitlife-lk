const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Hardcoded YouTube video IDs for common exercises
// ============================================================
// CHANGE THIS: Replace with real YouTube video IDs if needed
// ============================================================
const exerciseVideos = {
  'Push-ups': 'IODxDxX7oi4',
  'Squats': 'aclHkVaku9U',
  'Plank': 'ASdvSqZdv2s',
  'Lunges': 'QOVaHwm-Q6U',
  'Deadlift': 'op9kVnSso6Q',
  'Bicep Curls': 'ykJmrZ5v0Oo',
  'Shoulder Press': 'qEwKCR5JCog',
  'Mountain Climbers': 'nmwgirgXLYM',
  'Jumping Jacks': 'c4DAnQ6DtF8',
  'Pull-ups': 'eGo4IYlbE5g',
  'Tricep Dips': '6kALZikXxLc',
  'Crunches': 'MKmrqcoCZ-M',
  'Leg Raises': 'JB2oyawG9KQ',
  'Glute Bridge': 'OUgsJ8-Vi0E',
  'Burpees': 'dZgVxmf6jkA',
  'Yoga': 'v7AYKMP6rOE',
  'Stretching': 'L_xrDAtykMI',
  'Swimming': 'gh5mAtmeR3Y',
  'Cycling': 'LFfApT_7CJ0',
  'Walking': 'njeZ29umqVE',
  'default': 'aclHkVaku9U',
};

const getVideoId = (exerciseName) => {
  const keys = Object.keys(exerciseVideos);
  for (const key of keys) {
    if (exerciseName.toLowerCase().includes(key.toLowerCase())) return exerciseVideos[key];
  }
  return exerciseVideos['default'];
};

// POST /api/exercise/generate
router.post('/generate', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { difficulty = 'Beginner' } = req.body;

    const prompt = `You are a certified personal trainer. Create a safe and effective workout plan.

USER PROFILE:
- Age: ${user.age}
- Sex: ${user.sex}
- Weight: ${user.weightKg} kg
- Height: ${user.heightCm} cm
- Goal: ${user.goal}
- Body Parts to Strengthen: ${Array.isArray(user.strengthenParts) ? user.strengthenParts.join(', ') : user.strengthenParts || 'Full Body'}
- Physical Pain/Limitations: ${user.bodyPain || 'None'}
- Medical Conditions: ${Array.isArray(user.conditions) ? user.conditions.join(', ') : user.conditions || 'None'}
- Difficulty Level: ${difficulty}

Provide exactly 6 exercises tailored to this person. For each exercise, give safe modifications if they have pain.

Respond ONLY with valid JSON in this exact format:
{
  "difficulty": "${difficulty}",
  "totalDuration": "<e.g. 40-50 minutes>",
  "exercises": [
    {
      "name": "<Exercise Name>",
      "sets": <number>,
      "reps": "<e.g. 12 or 30 seconds>",
      "description": "<2-3 sentence description of how to perform>",
      "targetMuscles": ["<muscle1>", "<muscle2>"],
      "modification": "<modification if user has pain or limitation>",
      "calories": <estimated calories burned>
    }
  ],
  "warmup": "<2-3 sentence warmup recommendation>",
  "cooldown": "<2-3 sentence cooldown recommendation>",
  "tips": ["<tip1>", "<tip2>"]
}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2048,
    });
    const text = completion.choices[0].message.content;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ message: 'Failed to parse AI response', raw: text });
    }
    const workoutPlan = JSON.parse(jsonMatch[0]);

    // Add YouTube video IDs
    workoutPlan.exercises = workoutPlan.exercises.map(ex => ({
      ...ex,
      videoId: getVideoId(ex.name),
    }));

    res.json({ success: true, workoutPlan });
  } catch (err) {
    console.error('Exercise generation error:', err);
    res.status(500).json({ message: 'Failed to generate exercise plan', error: err.message });
  }
});

module.exports = router;
