const winston = require('winston');

winston.configure({
  level: 'warn',
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple(),
  ),
});

module.exports = winston;