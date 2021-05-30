const yaml = require('js-yaml');
const fs = require('fs');

module.exports = {
  read: (configPath) => {
    return yaml.load(fs.readFileSync(configPath, 'utf8'));
  }
}