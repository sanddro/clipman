import electron, { remote } from 'electron';

export const Electron = remote;
export const ipcRenderer = electron.ipcRenderer;
