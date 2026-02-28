const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
require('dotenv').config();

async function debugLogin() {
  try {
    console.log('Looking up user...');
    const user = await User.findOne({ where: { email: 'amit.chauhan220404@gmail.com' } });
    if (!user) { console.log('NOT FOUND'); return; }
    console.log('User found:', user.name);
    console.log('passwordHash:', user.passwordHash ? 'exists' : 'MISSING');
    const match = await bcrypt.compare('12345678', user.passwordHash);
    console.log('Password match:', match);
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('Token generated:', token ? 'OK' : 'FAILED');
    console.log('✅ Login flow complete');
  } catch(e) {
    console.error('❌ ERROR:', e.message);
    console.error(e.stack);
  }
  process.exit(0);
}

debugLogin();
