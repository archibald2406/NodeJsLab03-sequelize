const Sequelize = require('sequelize');
const db = require('../connection');
const DriverAndRoute = require('./driverAndRoute');

const Route = db.define('routess', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  title: Sequelize.STRING,
  time: Sequelize.INTEGER
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

Route.hasMany(DriverAndRoute);
DriverAndRoute.belongsTo(Route);

module.exports = Route;