import React, { useEffect, useState } from 'react';
import Config from '../config';
import { Electron, ipcRenderer } from '../utils/electron';

const Settings = () => {
  const [keyCombination, setKeyCombination] = useState('');
  const [maxClipsNumber, setMaxClipsNumber] = useState(0);

  useEffect(() => {
    setKeyCombination(Config.getConfig().showHotkey);
    setMaxClipsNumber(Config.getConfig().maxClips);
  }, []);

  const validKeys = ['HOME', 'INSERT', 'DELETE', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
    '1', '2', '3', '4', '5', '6', '7','8', '9', '0', '`', '~', '-', '=', '+'
  ];

  const isValidKey = key => {
    key = key.toUpperCase();
    return (key.length === 1 && key.match(/[a-z]/i)) || validKeys.includes(key);
  };

  const onKeyCombinationDown = e => {
    let key = e.key;
    if (!isValidKey(key)) return;

    const newKeyCombination = (e.ctrlKey ? 'CommandOrControl+' : '')
                            + (e.altKey ? 'Alt+' : '')
                            + (e.shiftKey ? 'Shift+' : '')
                            + e.key.toUpperCase();
    setKeyCombination(newKeyCombination);
  };

  const onClipsNumberChange = e => {
    let num = e.target.value;
    if (num > 2000) num = 2000;
    setMaxClipsNumber(num);
    if (num >= 1)
      Config.setConfig({maxClips: num});
  };

  const onClipNumberBlur = e => {
    if (!(+maxClipsNumber))
      setMaxClipsNumber(Config.getConfig().maxClips);
  };

  const onClose = () => {
    Electron.getCurrentWindow().close();
  };

  const onSave = () => {
    if (maxClipsNumber > 0 && maxClipsNumber < 2001)
      Config.setConfig({maxClips: maxClipsNumber});

    ipcRenderer.send('changeHotkey', { oldValue: Config.getConfig().showHotkey, newValue: keyCombination });

    Config.setConfig({showHotkey: keyCombination});

    Electron.getCurrentWindow().close();
  };

  return (
    <div className="settings">
      <div className="settings-wrapper">
        <div className="setting-item">
          <div className="setting-label">Keyboard shortcut</div>
          <div className="setting-block">
            <i className="far fa-keyboard setting-icon" />
            <input className="inp" type="text"
                   value={keyCombination.replace('CommandOrControl', 'Ctrl')}
                   onKeyDown={onKeyCombinationDown}/>
          </div>
        </div>
        <div className="setting-item">
          <div className="setting-label">Maximum number of saved clips</div>
          <div className="setting-block">
            <i className="fab fa-stack-overflow setting-icon" />
            <input className="inp" type="number" value={maxClipsNumber} min={1} onChange={onClipsNumberChange} onBlur={onClipNumberBlur} />
          </div>
        </div>
      </div>
      <div className="setting-buttons">
        <button className="setting-button blue" onClick={onSave}>Save</button>
        <button className="setting-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Settings;