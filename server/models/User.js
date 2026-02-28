const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sex: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: false,
  },
  weightKg: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  heightCm: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  // Stored as JSON string in MySQL
  conditions: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const val = this.getDataValue('conditions');
      return val ? JSON.parse(val) : [];
    },
    set(val) {
      this.setDataValue('conditions', JSON.stringify(val));
    },
  },
  bodyPain: {
    type: DataTypes.TEXT,
    defaultValue: 'None',
  },
  strengthenParts: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const val = this.getDataValue('strengthenParts');
      return val ? JSON.parse(val) : [];
    },
    set(val) {
      this.setDataValue('strengthenParts', JSON.stringify(val));
    },
  },
  goal: {
    type: DataTypes.ENUM('Weight Loss', 'Weight Gain', 'Maintain Fitness', 'Build Muscle'),
    allowNull: false,
  },
  uploadedMenuPath: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  activityFactor: {
    // ============================================================
    // CHANGE THIS: Activity factor multiplier
    // 1.2 = Sedentary, 1.375 = Light, 1.55 = Moderate, 1.725 = Very Active
    // ============================================================
    type: DataTypes.FLOAT,
    defaultValue: 1.2,
  },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
