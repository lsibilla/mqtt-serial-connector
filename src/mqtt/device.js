const winston = require('winston');

module.exports = {
  createDevice: (client, name, configTopic, stateTopic, commandTopic, eventEmitter) => {
    const device = {
      get name() { return name; },
      get configTopic() { return configTopic; },
      get stateTopic() { return stateTopic; },
      get commandTopic() { return commandTopic; },

      subscribe: function() {
        winston.info(`Subscribing ${name} to MQTT topic ${commandTopic}...`);
        client.mqttClient.subscribe(commandTopic, function (err) {
          if (!err) {
            winston.info(`Subscribed ${name} to MQTT topic ${commandTopic}.`);
          }
        });
      },

      receive: message => {
        eventEmitter.emit('receive', message);
      }
    }

    device.subscribe();

    eventEmitter.on('send', (state) => {
      client.mqttClient.publish(stateTopic, state)
    })
    // TODO: Send discovery message

    client.devices.push(device);

    return device;
  }
}
