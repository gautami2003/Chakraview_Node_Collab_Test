const { DB_HOST, DB_USER, DB_PORT, DB_PASS, DATABASE, DEBUG } = require('./env.config');
const { Sequelize } = require('sequelize');

const sequelize_connection = new Sequelize(
  DATABASE,
  DB_USER,
  DB_PASS, {
  host: DB_HOST,
  dialect: 'mysql',
  port: DB_PORT,
  logging: DEBUG == 1 ? console.log : false,
  timezone: '+05:30'
});

sequelize_connection.authenticate()
  .then((state) => {
    console.log('MYSQL Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the MYSQL database!!!');
  });

module.exports = sequelize_connection;

