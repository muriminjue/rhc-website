const logger = require("./logger");


const config = {
  development: {
    username: process.env.DBuser0,
    password: process.env.DBpass0,
    database: process.env.DBname0,
    host: process.env.DBhost0,
    dialect: "mysql",
    logging: (msg) => logger.info(msg),
  },
  production: {
    username: process.env.DBuser,
    password: process.env.DBpass,
    database: process.env.DBname,
    host: process.env.DBhost,
    dialect: "mysql",
    logging: (msg) => logger.info(msg),
  },
};

module.exports = config;