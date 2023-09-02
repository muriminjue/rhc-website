const winston = require("winston") // import wiston frmaework to help with logs

// configure logging to console and to file app.log
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' })
    ]
});

module.exports = logger