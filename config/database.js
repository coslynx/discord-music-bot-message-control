const { Sequelize } = require('sequelize');
const {
  DATABASE_HOST,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} = process.env;

const database = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, {
  host: DATABASE_HOST,
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = { database };