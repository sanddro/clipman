const Store = require('electron-store');

const store = new Store();

const defaultConfig = {
  mainWindowWidth: 300,
  mainWindowHeight: 320,
  settingsWidthWidth: 500,
  settingsWindowHeight: 400,
  showHotkey: 'CommandOrControl+Q',
  maxClips: 500,
};

if (!store.has('config'))
  store.set('config', defaultConfig);

const Config = {
  getConfig() {
    return store.get('config');
  },
  setConfig(changes) {
    let cfg = this.getConfig();
    cfg = {...cfg, ...changes};
    store.set('config', cfg);
    return cfg;
  }
};


module.exports = Config;