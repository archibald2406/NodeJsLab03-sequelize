const Sequelize = require('sequelize');

const db = new Sequelize('nodejslabs', 'root', 'pass123', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false
});

module.exports = db;