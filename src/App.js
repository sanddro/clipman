import React, { useEffect, useState } from 'react';
import Clipboard from './utils/clipboard';
import Config from './config';
import ClipsList from './components/ClipsList';
import { Electron, ipcRenderer } from './utils/electron';
import Search from './components/Search';

function App() {
  const [clips, setClips] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClips = clips.filter(clip => clip.includes(searchTerm));


  window.onload = e => {
    Electron.globalShortcut.register(Config.showHotkey, () => {
      ipcRenderer.send('showMainWindow');
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
    if (savedClips) {
      const parsed = JSON.parse(savedClips);
      setClips(parsed);
    }
  }, []);

  const onClipChosen = clip => {
    Clipboard.writeText(clip);
    ipcRenderer.send('hideAndPaste');
  };

  const onSearch = term => {
    setSearchTerm(term);
  };

  return (
    <div className="wrapper">
        <ClipsList clips={filteredClips} onClipChosen={onClipChosen} />
        <Search onSearch={onSearch}/>
    </div>
  );
}

export default App;
