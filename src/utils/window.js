const Config = require('../config');

function showMainWindow(win, screen) {
  win.setOpacity(0);
  win.show();
  win.restore();
  setWindowToMousePos(win, screen);
  win.setOpacity(1);
}

function setWindowToMousePos(win, screen) {
  let { x, y } = screen.getCursorScreenPoint();
  let size = win.getContentSize();

  const bounds = screen.getPrimaryDisplay().bounds;


  if (x + size[0] > bounds.width) {
    x = bounds.width - size[0];
  }

  if (y + size[1] > bounds.height - Config.bottomDockHeight) {
    y = bounds.height - Config.bottomDockHeight - size[1];
  }
  win.setPosition(x, y);
}

function hideMainWindow(win) {
  win.setOpacity(0);
  win.minimize();
  win.hide();
}

module.exports = { showMainWindow, hideMainWindow };