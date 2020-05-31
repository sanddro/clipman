import { ipcRenderer } from './electron';

let callbacks = [];

let clips = [];

function getSavedClips() {
  let savedClips = localStorage.getItem('clips');
  if (savedClips) {
    try {
      const parsed = JSON.parse(savedClips);
      clips = parsed;
    } catch (e) {
      console.error('Could not parse clips from localStorage');
    }
  }
  return clips;
}

ipcRenderer.on('clipsChanged', (event, newClips) => {
  if (newClips) {
    clips = newClips;
    localStorage.setItem('clips', JSON.stringify(clips));
    callbacks.forEach(cb => cb(clips));
  }
});


function subscribe(callback) {
  callbacks.push(callback);
  callback(clips);
}

function unsubscribe(callback) {
  callbacks = callbacks.filter(elem => elem.toString() !== callback.toString());
}

const Clipboard = {
  subscribe,
  unsubscribe,
  getSavedClips
};

export default Clipboard;



