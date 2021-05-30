const EventEmitter = require('events');
const winston = require('./logger');

const Config = require('./config');
const Device = require('./device');
const Mqtt = require('./mqtt');
const Serial = require('./serial');

var serialEventEmitter = new EventEmitter();

const config = Config.read('./config.yml')

const serialPort = Serial.createDevice(config.serial.port, serialEventEmitter);
const mqttClient = Mqtt.createClient(config.mqtt.url);

config.devices.forEach(device => {
  const mqttEventEmitter = new EventEmitter();
  mqttClient.createDevice(device.name,
                          `${config.mqtt.discoveryTopic}/${device.type}/${device.id}/config`, 
                          `${config.mqtt.deviceTopic}/${device.id}/state`,
                          `${config.mqtt.deviceTopic}/${device.id}/state/set`,
                          mqttEventEmitter);

  switch (device.type) {
    case 'switch':
      Device.createSwitch(device.name,
                          mqttEventEmitter,
                          serialEventEmitter,
                          device.serial.onValue,
                          device.serial.offValue);
      break;
    default:
      winston.error(`Unknown device type '${device.type}' for device ${device.name} (${device.id})`);
  }
})