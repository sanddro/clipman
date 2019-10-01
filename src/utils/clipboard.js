import { Electron } from './electron';

let clipboard = readClipboard();

let callbacks = [];

setInterval(() => {
  let currClipboard = readClipboard();
  if (clipBoardChanged(currClipboard)) {
    callbacks.forEach(cb => cb(currClipboard));
    clipboard = currClipboard
  }
}, 20);

function clipBoardChanged(newClipboard) {
  return clipboard.type !== newClipboard.type || clipboard.value !== newClipboard.value;
}

function readClipboard() {
  let rawPath = process.platform === 'win32'
    ? Electron.clipboard.read('FileNameW')
    : Electron.clipboard.read('public.file-url');

  if (rawPath) {
    return {
      type: 'file',
      value: rawPath
    }
  }

  let image = Electron.clipboard.readImage();
  if (!image.isEmpty()) {
    return {
      type: 'image',
      value: image.toDataURL()
    }
  }

  return {
    type: 'text',
    value: Electron.clipboard.readText()
  }
}

function writeToClipboard(clip) {
  if (clip.type === 'text')
    Electron.clipboard.writeText(clip.value);
  else if (clip.type === 'image')
    Electron.clipboard.writeImage(Electron.nativeImage.createFromDataURL(clip.value));
  else if (clip.type === 'file') {
    Electron.clipboard.writeBuffer(
      process.platform === 'win32' ? 'FileNameW' : 'public.file-url',
      Buffer.from(clip.value, 'utf8'));
  }
}

function subscribe(callback) {
  callbacks.push(callback);
}

function unsubscribe(callback) {
  callbacks = callbacks.filter(elem => elem.toString() !== callback.toString());
}

const Clipboard = {
  subscribe,
  unsubscribe,
  readClipboard,
  writeToClipboard,
  ...Electron.clipboard
};

export default Clipboard;



