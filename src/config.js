import Store from 'electron-store';

const store = new Store();

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

export default Config;