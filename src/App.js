import React, { useEffect, useState } from 'react';
import './App.css';
import Clipboard from './utils/clipboard';
import Config from './config';
import ClipsList from './components/ClipsList';
import { hideMainWindow, showMainWindow } from './utils/window';
import { Electron, ipcRenderer } from './utils/electron';

function App() {
  const [clips, setClips] = useState([]);

  window.onload = e => {
    Electron.globalShortcut.register(Config.showHotkey, () => {
      showMainWindow(Electron.getCurrentWindow());
    });
  };

  window.onbeforeunload = e => {
    Electron.globalShortcut.unregister(Config.showHotkey);
  };

  useEffect(() => {
    const clipboardChanged = text => {
      const foundIdx = clips.indexOf(text);
      if (foundIdx !== -1)
        clips.splice(foundIdx, 1);

      let updatedClips = [text, ...clips];

      if (updatedClips.length > Config.maxClips)
        updatedClips.splice(Config.maxClips);

      setClips(updatedClips);
      localStorage.setItem('clips', JSON.stringify(updatedClips));
    };
    Clipboard.unsubscribe(clipboardChanged);
    Clipboard.subscribe(clipboardChanged);

    return () => {
      Clipboard.unsubscribe(clipboardChanged)
    }
  }, [clips]);

  useEffect(() => {
    let savedClips = localStorage.getItem('clips');
    if (savedClips)
      setClips(JSON.parse(savedClips));
    }, []);

  const onClipChosen = clip => {
    Clipboard.writeText(clip);

    hideMainWindow(Electron.getCurrentWindow());

    ipcRenderer.send('paste');
  };

  return (
    <div className="wrapper">
      <div className="app">
        <ClipsList clips={clips} onClipChosen={onClipChosen} />
      </div>
    </div>
  );
}

export default App;
