const MQTT = require('mqtt');
const EventEmitter = require('events');

const winston = require('./logger');

const MqttClient = require('../src/mqtt');

const mqttTestUrl = "mqtt://test.url";
const mqttConfigTopic = "config_topic";
const mqttStateTopic = "state_topic";
const mqttCommandTopic = "command_topic";
const mqttTestMessage = "testMessage";


jest.mock('mqtt');

describe('MQTT device', () => {
  let mqttInstanceMock;

  beforeEach(() => {
    MQTT.connect.mockImplementation((url) => {
      winston.debug("Creating mocked MQTT client.");

      mqttInstanceMock = {
        eventEmitter: new EventEmitter(),
        on: function() { this.eventEmitter.on.apply(this.eventEmitter, arguments); },
        subscribe: jest.fn((topic, done) => { done() }),
        publish: jest.fn()
      };

      process.nextTick(() => { mqttInstanceMock.eventEmitter.emit('connect') });
      return mqttInstanceMock;
    });
  });
  
  test('Create mqtt client', () => {
    const mqttClient = MqttClient.createClient(mqttTestUrl);

    expect(MQTT.connect).toBeCalledWith(mqttTestUrl)
  });

  test('Create mqtt device', () => {
    const eventEmitter = new EventEmitter();
    const sendDeviceMock = jest.fn();

    eventEmitter.on('receive', sendDeviceMock);
    
    const mqttClient = MqttClient.createClient(mqttTestUrl);
    expect(MQTT.connect.mock.calls).toEqual([[mqttTestUrl]]);

    const mqttDevice = mqttClient.createDevice('test', mqttConfigTopic, mqttStateTopic, mqttCommandTopic, eventEmitter)
    expect(mqttInstanceMock.subscribe).toBeCalledWith(mqttCommandTopic, expect.anything());

    mqttInstanceMock.eventEmitter.emit('message', mqttCommandTopic, mqttTestMessage)    
    expect(sendDeviceMock).toBeCalledWith(mqttTestMessage);
    
    eventEmitter.emit('send', mqttTestMessage)    
    expect(mqttInstanceMock.publish).toBeCalledWith(mqttStateTopic, mqttTestMessage);
  });
});
