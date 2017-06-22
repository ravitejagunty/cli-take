const config = require('../config')
const request = require('request')



// send anonymous usage stats to the tank team
function track(evt, data, fn) {
  if(process.env.TANK_ENV === 'development') {
    return
  }
  fn = fn || function() {}
  request.put(config.server + 'track', {
    json: true,
    body: {
      evt: evt,
      data: data
    }
  }, function(err) {
      if(!err) {
        fn()
      }
  })
}

module.exports = track
