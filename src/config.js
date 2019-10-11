import { ipcRenderer } from './utils/electron';

const Config = {
  getConfig() {
    return ipcRenderer.sendSync('getConfig');
  },
  setConfig(changes) {
    return ipcRenderer.sendSync('changeConfig', changes);
  }
};

export default Config;