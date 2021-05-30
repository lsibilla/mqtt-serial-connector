const EventEmitter = require('events');
const SerialPort = require('serialport')
const MockBinding = require('@serialport/binding-mock')
const winston = require('./logger');

const Serial = require('../src/serial');

describe('Serial device', () => {
  beforeEach(() => {
    SerialPort.Binding = MockBinding
    MockBinding.createPort('/dev/ROBOT', { echo: true, record: true })
  });
  
  test('Create serial device', () => {
    const eventEmitter = new EventEmitter();

    Serial.createDevice('/dev/ROBOT', eventEmitter, (device) => {    
      expect(device).toBeDefined();
    })
  });

  test('Process events', () => {
    const eventEmitter = new EventEmitter();
    const writeMock = jest.fn();

    Serial.createDevice('/dev/ROBOT', eventEmitter, (device) => {    
      device.serialPort.write = writeMock;
      
      eventEmitter.emit('send', 'true');
      
      expect(writeMock).toBeCalledWith('true');
    })
  });
});