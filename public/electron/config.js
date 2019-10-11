const {LocalStorage} = require('node-localstorage');
const localStorage = new LocalStorage('./config');

const defaultConfig = {
  mainWindowWidth: 300,
  mainWindowHeight: 320,
  settingsWidthWidth: 500,
  settingsWindowHeight: 400,
  showHotkey: 'CommandOrControl+Q',
  maxClips: 500,
};



const Config = {
  getConfig() {
    let cfg = JSON.parse(localStorage.getItem('config'));
    if (!cfg) {
      cfg = defaultConfig;
      localStorage.setItem('config', JSON.stringify(cfg));
    }
    return cfg;
  },
  setConfig(changes) {
    let cfg = this.getConfig();
    cfg = {...cfg, ...changes};
    localStorage.setItem('config', JSON.stringify(cfg));
    return cfg;
  }
};


module.exports = Config;