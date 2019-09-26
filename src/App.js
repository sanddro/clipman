import React, { useEffect, useState } from 'react';
import './App.css';
import { Electron } from './utils/electron';
import Clipboard from './utils/clipboard';
import Config from './config';

function App() {

  const [clipboard, setClipboard] = useState('');

  const clipboardChanged = text => {
    setClipboard(text);
  };

  useEffect(() => {
    Electron.globalShortcut.register(Config.showHotkey, () => {
      Electron.getCurrentWindow().show();
    });

    Clipboard.subscribe(clipboardChanged);

    return () => {
      Clipboard.unsubscribe(clipboardChanged)
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Last copied: {clipboard}
        </p>
      </header>
    </div>
  );
}

export default App;
