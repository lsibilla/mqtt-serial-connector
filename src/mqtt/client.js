const MQTT = require('mqtt');
const winston = require('winston');

const Device = require('./device');

function ensureCleanUpOnExit(mqttClient) {
  function exitHandler(options, exitCode) {
    if (options.cleanup)
      mqttClient.end()

    if (options.exit) process.exit();
  }

  //do something when app is closing
  process.on('exit', exitHandler.bind(null,{cleanup:true}));

  //catches ctrl+c event
  process.on('SIGINT', exitHandler.bind(null, {exit:true}));
}

module.exports = {
  createClient: (url) => {
    const _mqttClient = MQTT.connect(url);
    const client = {
      mqttClient: _mqttClient,

      isConnected: false,
      devices: []
    }

    _mqttClient.on('connect', function () {
      winston.verbose(`Connected to ${url}.`)

      client.isConnected = true;
    })
    
    _mqttClient.on('message', function (topic, message) {
      winston.verbose(`Received MQTT message '${message}' on topic ${topic}.`)
      client.devices
        .filter(device => device.commandTopic == topic)
        .forEach(device => device.receive(message));
    });
    
    ensureCleanUpOnExit(_mqttClient);

    client.createDevice = (name, configTopic, stateTopic, commandTopic, eventEmitter) => {
      return Device.createDevice(client, name, configTopic, stateTopic, commandTopic, eventEmitter);
    }

    return client;
  }
}
