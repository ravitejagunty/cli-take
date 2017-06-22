var c = require('colors')

function log(type, str) {
  switch (type) {
    case 'error':
      console.log(c.red(str))
      break;
    default:

  }
}

module.exports = log;
