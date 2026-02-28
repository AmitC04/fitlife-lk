const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const {
      name, email, password, age, sex, weightKg, heightCm,
      conditions, bodyPain, strengthenParts, goal
    } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name, email, passwordHash, age, sex,
      weightKg: parseFloat(weightKg),
      heightCm: parseFloat(heightCm),
      conditions: conditions || [],
      bodyPain: bodyPain || 'None',
      strengthenParts: strengthenParts || [],
      goal,
    });

    const token = generateToken(user.id);
    res.status(201).json({
      token,
      user: {
        id: user.id, name: user.name, email: user.email,
        age: user.age, sex: user.sex, weightKg: user.weightKg,
        heightCm: user.heightCm, conditions: user.conditions,
        bodyPain: user.bodyPain, strengthenParts: user.strengthenParts,
        goal: user.goal, activityFactor: user.activityFactor,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user.id);
    res.json({
      token,
      user: {
        id: user.id, name: user.name, email: user.email,
        age: user.age, sex: user.sex, weightKg: user.weightKg,
        heightCm: user.heightCm, conditions: user.conditions,
        bodyPain: user.bodyPain, strengthenParts: user.strengthenParts,
        goal: user.goal, activityFactor: user.activityFactor,
        uploadedMenuPath: user.uploadedMenuPath,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
