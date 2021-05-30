const winston = require('winston');

winston.configure({
  level: 'info',
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple(),
  ),
});

/*
transports: [
  new winston.transports.File({ filename: './data/error.log', level: 'error' }),
  new winston.transports.File({ filename: './data/combined.log' }),
],
exceptionHandlers: [
  new winston.transports.File({ filename: './data/exceptions.log' })
]
*/

module.exports = winston;
