import React, { useEffect, useState } from 'react';
import Clipboard from '../utils/clipboard';
import { ipcRenderer } from '../utils/electron';
import ClipsList from './ClipsList';
import Search from './Search';

function App() {
  const [clips, setClips] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClips = clips && clips.filter(clip => {
    // disable files temporarily until write to clipboard works
    // if (clip.type === 'file') return false;
    if (searchTerm === '') return true;

    return clip.type !== 'image' && clip.value.toLowerCase().includes(searchTerm.toLowerCase())
  });

  useEffect(() => {
    setClips(Clipboard.getSavedClips());

    const clipboardChanged = clips => {
      setClips(clips);
    };
    Clipboard.unsubscribe(clipboardChanged);
    Clipboard.subscribe(clipboardChanged);

    return () => {
      Clipboard.unsubscribe(clipboardChanged)
    }
  }, []);

  const onClipChosen = clip => {
    setSearchTerm('');
    ipcRenderer.send('chooseClip', clip);
  };

  const onSearch = term => {
    setSearchTerm(term);
  };

  const onSettingsClick = () => {
    ipcRenderer.send('openSettings');
  };

  return (
    <div className="wrapper">
      <ClipsList clips={filteredClips} onClipChosen={onClipChosen} />
      <Search onSearch={onSearch} searchTerm={searchTerm} onSettingsClick={onSettingsClick}/>
    </div>
);
}

export default App;
