const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'fitlife.db'),
  logging: false,
});

async function debug() {
  // Raw query to get user
  const [rows] = await sequelize.query('SELECT * FROM Users WHERE email = "amit.chauhan220404@gmail.com"');
  console.log('User found:', rows.length > 0 ? 'YES' : 'NO');
  if (rows.length > 0) {
    const user = rows[0];
    console.log('User keys:', Object.keys(user));
    console.log('passwordHash exists:', !!user.passwordHash);
    const match = await bcrypt.compare('12345678', user.passwordHash);
    console.log('Password match:', match);
  }
  process.exit(0);
}

debug().catch(e => { console.error('Error:', e.message); process.exit(1); });
