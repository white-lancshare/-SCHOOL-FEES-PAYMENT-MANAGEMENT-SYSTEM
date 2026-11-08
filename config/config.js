require('dotenv').config();

const dbName = process.env.DB_NAME;
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const port = process.env.DB_PORT;
const host = process.env.DB_HOST;
const dialect = process.env.DB_DIALECT;


module.exports = {
  development: {
    username: "root",
    password: null,
    database: "database_development",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: username,
    password: password,
    database: dbName,
    host: host,
    dialect: dialect,
    port: port,
  },
};
