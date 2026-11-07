const {Sequelize} = require('sequelize');

const dbName = process.env.DB_NAME;
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const port = process.env.DB_PORT;
const host = process.env.DB_HOST;
const dialect = process.env.DB_DIALECT;

const sequelize = new Sequelize(dbName, username, password, {
    host,
    dialect,
    port
});

module.exports = sequelize;