const path = require('path');
const isDev = require('electron-is-dev');

const electron = require('electron');
const { app, BrowserWindow, Tray,  Menu, ipcMain } = electron;
const { showMainWindow, hideMainWindow } = require('./electron/utils/window');
const Config = require('./electron/config');

const { exec } = require('child_process');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

let tray;

function init() {
  createWindow();
  createTray();
}

function createWindow () {
  let { mainWindowWidth, mainWindowHeight } = Config;
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

  const menu = Menu.buildFromTemplate([{
    label: 'View',
    submenu: [{
      label: 'Reload',
      accelerator: 'CommandOrControl+R',
      click() {
        win.reload()
      }
    }, {
      label: 'Toggle Developer Tools',
      accelerator: 'F12',

      click() {
        win.toggleDevTools();
      }
    }, {
      label: 'Close',
      accelerator: 'Escape',
      click() {
        hideMainWindow(win);
      }
    }]
  }]);

  Menu.setApplicationMenu(menu);

  // and load the index.html of the app.
  win.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '/index.html')}`);

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  });

  win.on('close', event => {
    if(!app.isQuiting){
      event.preventDefault();
      hideMainWindow(win);
    }

    return false;
  });

  win.on('blur', () => {
    hideMainWindow(win);
  });

  ipcMain.on('hideAndPaste', () => {
    hideMainWindow(win);
    if (process.platform === 'win32') {
      setTimeout(() => {
        let scriptLocation = isDev
          ? `${__dirname}/electron/shell-scripts`
          : path.join(__dirname, '/../../app.asar.unpacked/build/electron/shell-scripts');
        exec(`wscript ${scriptLocation}/paste.vbs`);
      }, 100);
    } else {
      setTimeout(() => {
        exec('xdotool key ctrl+v');
      }, 100);
    }
  });

  ipcMain.on('showMainWindow', () => {
    showMainWindow(win, electron.screen);
  });
}

function createTray() {
  tray = new Tray(__dirname + '/logo512.png');

  const contextMenu = Menu.buildFromTemplate([{
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', init);