const path = require('path');
const isDev = require('electron-is-dev');

const { app, BrowserWindow, Tray,  Menu, MenuItem } = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

let tray;

function init() {
  createWindow();
  createTray();
}

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
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
    }]
  }]);

  Menu.setApplicationMenu(menu);

  // and load the index.html of the app.
  win.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  });

  win.on('close', function (event) {
    if(!app.isQuiting){
      event.preventDefault();
      win.hide();
    }

    return false;
  });
}

function createTray() {
  tray = new Tray(__dirname + '/favicon.ico');

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
    win.show();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', init);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    //app.quit()
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});