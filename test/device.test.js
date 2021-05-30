const EventEmitter = require('events');
const { hasUncaughtExceptionCaptureCallback } = require('process');
const winston = require('./logger');

const Device = require('../src/device');

describe("Device", () => {
  test('Create custom device', () => {
    const mqttEventEmitter = new EventEmitter();
    const serialEventEmitter = new EventEmitter();
    
    const middleware = jest.fn();

    Device.createDevice('test',
                        mqttEventEmitter,
                        serialEventEmitter,
                        middleware
    );

    mqttEventEmitter.emit('receive', 'testData')

    expect(middleware).toBeCalledWith('testData');
  });

  test('Create switch device', () => {
    const mqttSendMock = jest.fn();
    const serialSendMock = jest.fn();
    const mqttEventEmitter = new EventEmitter();
    const serialEventEmitter = new EventEmitter();
    
    mqttEventEmitter.on('send', mqttSendMock);
    serialEventEmitter.on('send', serialSendMock);

    const mqttOnValue = 'true';
    const mqttOffValue = 'false';
    const serialOnValue = 'on';
    const serialOffValue = 'off';

    Device.createSwitch('test',
                        mqttEventEmitter,
                        serialEventEmitter,
                        serialOnValue,
                        serialOffValue,
                        mqttOnValue,
                        mqttOffValue
    );

    mqttEventEmitter.emit('receive', mqttOnValue)
    expect(serialSendMock).toBeCalledWith(serialOnValue);
    expect(mqttSendMock).toBeCalledWith(mqttOnValue);
    
    mqttEventEmitter.emit('receive', mqttOffValue)
    expect(serialSendMock).toBeCalledWith(serialOffValue);
    expect(mqttSendMock).toBeCalledWith(mqttOffValue);
  })
  
  test('Create switch device with custom MQTT values', () => {
    const mqttSendMock = jest.fn();
    const serialSendMock = jest.fn();
    const mqttEventEmitter = new EventEmitter();
    const serialEventEmitter = new EventEmitter();
    
    mqttEventEmitter.on('send', mqttSendMock);
    serialEventEmitter.on('send', serialSendMock);

    const mqttOnValue = '1';
    const mqttOffValue = '0';
    const serialOnValue = 'on';
    const serialOffValue = 'off';

    Device.createSwitch('test',
                        mqttEventEmitter,
                        serialEventEmitter,
                        serialOnValue,
                        serialOffValue,
                        mqttOnValue,
                        mqttOffValue
    );

    mqttEventEmitter.emit('receive', mqttOnValue)
    expect(serialSendMock).toBeCalledWith(serialOnValue);
    expect(mqttSendMock).toBeCalledWith(mqttOnValue);
    
    mqttEventEmitter.emit('receive', mqttOffValue)
    expect(serialSendMock).toBeCalledWith(serialOffValue);
    expect(mqttSendMock).toBeCalledWith(mqttOffValue);
  })
});