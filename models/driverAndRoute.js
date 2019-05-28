const Sequelize = require('sequelize');
const db = require('../connection');

const DriverAndRoute = db.define('driverandroutee', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  dateOfRecording: {
    type: Sequelize.DATEONLY,
    defaultValue: Sequelize.NOW
  }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = DriverAndRoute;