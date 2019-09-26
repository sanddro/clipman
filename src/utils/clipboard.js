import { Electron } from './electron';

let clipboard = Electron.clipboard.readText();

let callbacks = [];

setInterval(() => {
  let currClipboard = Electron.clipboard.readText();
  if (clipboard !== currClipboard) {
    callbacks.forEach(cb => cb(currClipboard));
    clipboard = currClipboard
  }
}, 20);

function subscribe(callback) {
  callbacks.push(callback);
  callback(clipboard);
}

function unsubscribe(callback) {
  callbacks = callbacks.filter(elem => elem.toString() !== callback.toString());
}

const Clipboard = {
  subscribe,
  unsubscribe
};

export default Clipboard;



