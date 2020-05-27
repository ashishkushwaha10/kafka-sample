const bunyan = require('bunyan');
const RotatingFileStream = require('bunyan-rotating-file-stream');
const fs = require('fs');

const filename = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}.log`
let path = './logs/';

function loggerInit() {
  if (!fs.existsSync(`${path}`)) { // checking if `logs` directory exists.
      fs.mkdirSync(`${path}`); // creating logs directory if doesn't exists.
  }
}

var logger = bunyan.createLogger({
  name: 'test-logger',
  streams: [{
      stream: new RotatingFileStream({
          path: `${path}%d-%b-%y.log`,
          period: '1d',
          threshold: '10m',
          rotateExisting: true,
          startNewFile: true,
          gzip: true
      })
  }]
});

module.exports = {
  logger,
  loggerInit
};