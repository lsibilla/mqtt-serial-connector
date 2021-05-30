const winston = require('winston');
const validator = require('validator');

const createDevice = (name, mqttEventEmitter, serialEventEmitter, middleware) => {
  mqttEventEmitter.on('receive', middleware)

  return {}
}

module.exports = {
  createDevice: createDevice,
  
  createSwitch: (name,
                  mqttEventEmitter,
                  serialEventEmitter,
                  serialOnValue,
                  serialOffValue,
                  mqttOnValue = 'true',
                  mqttOffValue = 'false') => {

    var middleware = (data) => {
      if (data == mqttOnValue) {
        winston.verbose(`Device '${name}' received On`)
        serialEventEmitter.emit('send', serialOnValue);
        mqttEventEmitter.emit('send', mqttOnValue);
      } else if (data == mqttOffValue) {
        winston.verbose(`Device '${name}' received Off`)
        serialEventEmitter.emit('send', serialOffValue);
        mqttEventEmitter.emit('send', mqttOffValue);
      } else if (validator.isAlphanumeric(data) && data.length <= 50) {
        winston.info(`Device '${name}' received invalid value: ${data}`)
      } else {
        winston.info(`Device '${name}' received unhealthy value`)
      }
    }

    return createDevice(name, mqttEventEmitter, serialEventEmitter, middleware);
  }
}
