import React, { useEffect, useState } from 'react';
import Clipboard from './utils/clipboard';
import Config from './config';
import ClipsList from './components/ClipsList';
import { Electron, ipcRenderer } from './utils/electron';
import Search from './components/Search';

function App() {
  const [clips, setClips] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClips = clips.filter(clip => {
    // disable files temporarily until write to clipboard works
    // if (clip.type === 'file') return false;
    if (searchTerm === '') return true;

    return clip.type !== 'image' && clip.value.toLowerCase().includes(searchTerm.toLowerCase())
  });

  window.onload = e => {
    Electron.globalShortcut.register(Config.showHotkey, () => {
      ipcRenderer.send('showMainWindow');
    });
  };

  window.onbeforeunload = e => {
    Electron.globalShortcut.unregister(Config.showHotkey);
  };

  useEffect(() => {
    const findClipIdx = clip => {
      for (let i = 0; i < clips.length; i++)
        if (clips[i].type === clip.type && clips[i].value === clip.value)
          return i;

      return -1;
    };

    const clipboardChanged = newClip => {
      const foundIdx = findClipIdx(newClip);
      if (foundIdx !== -1)
        clips.splice(foundIdx, 1);

      let updatedClips = [newClip, ...clips];

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
    Clipboard.writeToClipboard(clip);
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
