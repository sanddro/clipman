import React, { useEffect, useState } from 'react';
import './App.css';
import { Electron } from './utils/electron';
import Clipboard from './utils/clipboard';
import Config from './config';
import ClipsList from './components/ClipsList';
import { showWindowWithoutFlicker } from './utils/window';

function App() {
  const [clips, setClips] = useState([]);

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
    Electron.globalShortcut.register(Config.showHotkey, () => {
        showWindowWithoutFlicker(Electron.getCurrentWindow());
    });

    let savedClips = localStorage.getItem('clips');
    if (savedClips)
      setClips(JSON.parse(savedClips));

    return () => {
      Electron.globalShortcut.unregister(Config.showHotkey);
    }
  }, []);

  const onClipChosen = clip => {
    Clipboard.writeText(clip);
    Electron.getCurrentWindow().hide();
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
