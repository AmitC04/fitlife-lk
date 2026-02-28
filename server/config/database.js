const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Using SQLite — no MySQL/password required, data stored in fitlife.db file
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../fitlife.db'),
  logging: false,
});

module.exports = sequelize;
