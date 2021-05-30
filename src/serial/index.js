const SerialPort = require('serialport');

module.exports = {
  createDevice: function(devicePath, eventEmitter, callback) {
    var device = {
      serialPort: new SerialPort(devicePath)
    }

    if (callback) {
      device.serialPort.on('open', function() {
        callback(device);
      })
    }

    if (eventEmitter) {
      eventEmitter.on("send", (data) => {
        device.serialPort.write(data);
      });
    }

    return device;
  }
}