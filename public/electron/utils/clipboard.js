const Electron = require('electron');
const Config = require('../config');
const clipboardListener = require('clipboard-event');

let clipboard = null;

let clips = [];

async function startListening(mainWindow) {
  clipboard = readClipboard();
  let savedClips = await mainWindow.webContents.executeJavaScript('localStorage.getItem("clips");', true);
  if (savedClips) {
    try {
      const parsed = JSON.parse(savedClips);
      clips = parsed;
    } catch (e) {
      console.error('Could not parse clips from localStorage');
    }
  }
  listen(mainWindow).then();
}

async function listen(mainWindow) {
  clipboardListener.startListening();
  clipboardListener.on('change', () => {
    let currClip = readClipboard();
    if (clipBoardChanged(currClip)) {
      const foundIdx = findClipIdx(currClip);
      if (foundIdx !== -1)
        clips.splice(foundIdx, 1);
      let updatedClips = [currClip, ...clips];

      if (updatedClips.length > Config.getConfig().maxClips)
        updatedClips.splice(Config.getConfig().maxClips);

      clips = updatedClips;

      mainWindow.webContents.send('clipsChanged', clips);

      clipboard = currClip;
    }
  });
}

function stopListening() {
  clipboardListener.stopListening();
}

const findClipIdx = clip => {
  for (let i = 0; i < clips.length; i++)
    if (clips[i].type === clip.type && clips[i].value === clip.value)
      return i;

  return -1;
};

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


const Clipboard = {
  startListening,
  stopListening,
  writeToClipboard,
};

module.exports = Clipboard;



