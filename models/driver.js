const Sequelize = require('sequelize');
const db = require('../connection');
const DriverAndRoute = require('./driverAndRoute');

const Driver = db.define('driverss', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: Sequelize.STRING,
  surname: Sequelize.STRING,
  totalHours: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

Driver.hasMany(DriverAndRoute);
DriverAndRoute.belongsTo(Driver);

module.exports = Driver;