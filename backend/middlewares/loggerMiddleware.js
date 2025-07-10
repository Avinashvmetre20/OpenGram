// middleware/loggerMiddleware.js
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');

// Create log directory
const logDirectory = path.join(__dirname, '../../logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// Create a rotating write stream for requests
const requestLogStream = rfs.createStream('requests.log', {
  interval: '1d', // rotate daily
  path: logDirectory
});

// Standard Apache combined log output
const requestLogger = morgan('combined', { stream: requestLogStream });

// Dev logging middleware
const devLogger = morgan('dev');

module.exports = {
  requestLogger,
  devLogger
};