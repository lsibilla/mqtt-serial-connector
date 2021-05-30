# mqtt-serial-connector

MQTT client for communicating serial devices.

## Features

Please note, this project is in early development stage.

Features currently available are:
* Subscribing to MQTT topics
* Write predefined value (ON/OFF) to a serial device.

## How-To Use

See config.yml.example.

Config file is composed of 3 sections: `mqtt`, `serial` and `devices`.

### Secion `mqtt`

* `url`: url of the MQTT server. It can be one of the following protocols: `mqtt`, `mqtts`, `tcp`, `tls`, `ws`, `wss`.
* `discoveryTopic`: Topic to publish homassistant compatible discovery messages.
* `deviceTopic`: Topic to send/receive device related messages.

(Authentication is not supported yet)

### Section `serial`

* `port`: Serial port path (e.g. `/dev/ttyUSB0`) or name (e.g. `COM1`).

### Section `devices`

* `name`: Human friendly name of the device
* `id`: Identification of the device. `id` can only be composed of alphanumeric, hyphen and underscore.
* `type`: Device type. See below for currently supported types.

#### Type `switch`

The type `switch` currently support write only serial device.

* `serial`: Serial configuration
  * `onValue`: Value to be written as "On" message
  * `offValue`: Value to be written as "On" message

* `mqtt`: MQTT configuration (Not implemented yet)
  * `onValue`: Value meaning "On" (default: true)
  * `offValue`: Value meaning "On" (default: false)
