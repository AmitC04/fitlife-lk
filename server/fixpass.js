const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'fitlife.db'),
  logging: false,
});

async function fix() {
  const newPassword = '12345678';
  const hash = await bcrypt.hash(newPassword, 12);
  const [rows] = await sequelize.query('SELECT id, name, email FROM Users');
  console.log('All users:', JSON.stringify(rows));
  if (rows.length === 0) {
    console.log('No users found in DB!');
  } else {
    await sequelize.query(`UPDATE Users SET passwordHash = '${hash}'`);
    console.log(`✅ All user passwords reset to: ${newPassword}`);
  }
  process.exit(0);
}

fix().catch(e => { console.error('Error:', e.message); process.exit(1); });
