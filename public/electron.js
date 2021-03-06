const path = require('path');
const isDev = require('electron-is-dev');

const electron = require('electron');
const { app, BrowserWindow, Tray, Menu, ipcMain, Notification } = electron;
const { showMainWindow, hideMainWindow } = require('./electron/utils/window');
const Config = require('./electron/config');

const { exec } = require('child_process');

const Clipboard = require('./electron/utils/clipboard');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let settingsWin;
let not;

let tray;

let pasteTimeout;

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus()
    }
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', init);
}

function init() {
  createWindow();
}

function createWindow () {
  let { mainWindowWidth, mainWindowHeight } = Config.getConfig();
  // Create the browser window.
  win = new BrowserWindow({
    width: mainWindowWidth,
    height: mainWindowHeight,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false,
    skipTaskbar: true,
    fullscreenable: false,
    resizable: false,
    useContentSize: true,
    show: false
  });

  let submenu = [{
    label: 'Close',
    accelerator: 'Escape',
    click() {
      hideMainWindow(win);
    }
  }];

  if (isDev) {
    submenu = [...submenu, {
      label: 'Reload',
      accelerator: 'CommandOrControl+R',
      click() {
        win.reload();
      }
    }, {
      label: 'Toggle Developer Tools',
      accelerator: 'F12',

      click() {
        win.toggleDevTools();
      }
    }];
  }

  const menu = Menu.buildFromTemplate([{
    label: 'View',
    submenu,
  }]);

  Menu.setApplicationMenu(menu);

  // and load the index.html of the app.
  win.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '/index.html')}`).then(async () => {
    await Clipboard.startListening(win);

    electron.globalShortcut.register(Config.getConfig().showHotkey, () => {
      showMainWindow(win, electron.screen);
    });

    createTray();

    if (Notification.isSupported()) {
      not = new Notification({
        title: 'Clipman',
        body: `Clipman is running minimized in tray. Press ${Config.getConfig().showHotkey.replace('CommandOrControl', 'Ctrl')} to open.`,
        icon: __dirname + '/logo512.png'
      });
      not.show();
    }


  });

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    electron.globalShortcut.unregister(Config.getConfig().showHotkey);
    Clipboard.stopListening();
    win = null;
  });

  win.on('close', event => {
    if (!app.isQuiting) {
      event.preventDefault();
      hideMainWindow(win);
    }

    return false;
  });

  win.on('blur', () => {
    hideMainWindow(win);
  });

  ipcMain.on('chooseClip', (event, clip) => {
    Clipboard.writeToClipboard(clip);

    if (process.platform === 'win32') {
      pasteTimeout = setTimeout(() => {
        let scriptLocation = isDev
          ? `${__dirname}/electron/shell-scripts`
          : path.join(__dirname, '/../../app.asar.unpacked/build/electron/shell-scripts');
        exec(`wscript ${scriptLocation}/paste.vbs`);
      }, 100);
    } else {
      pasteTimeout = setTimeout(() => {
        exec('xdotool key ctrl+v');
      }, 300);
    }
    hideMainWindow(win);
  });

  ipcMain.on('changeHotkey', (event, {oldValue, newValue}) => {
    electron.globalShortcut.unregister(oldValue);
    electron.globalShortcut.register(newValue, () => {
      showMainWindow(win, electron.screen);
    });
  });

  ipcMain.on('openSettings', () => {
    createSettingsWindow();
  });
}

function createTray() {
  tray = new Tray(__dirname + '/logo512.png');

  const contextMenu = Menu.buildFromTemplate([{
    label: 'Settings',
    click() {
      if (settingsWin) {
        settingsWin.show();
        return;
      }
      createSettingsWindow();
    }
  }, {
    label: 'Quit',
    click() {
      app.isQuiting = true;
      app.quit();
    }
  }]);
  tray.setContextMenu(contextMenu);
  tray.setToolTip('Clipman');

  tray.on('click', () => {
    showMainWindow(win, electron.screen);
  });
}

function createSettingsWindow() {
  settingsWin = new BrowserWindow({
    title: 'Settings',
    width: Config.getConfig().settingsWidthWidth,
    height: Config.getConfig().settingsWindowHeight,
    webPreferences: {
      nodeIntegration: true
    },
    fullscreenable: false,
    resizable: false,
    useContentSize: true,
    show: true
  });
  !isDev && settingsWin.setMenu(null);

  settingsWin.loadURL((isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '/index.html')}`) + '#/settings');

  settingsWin.on('closed', () => {
    settingsWin = null;
  });
}
