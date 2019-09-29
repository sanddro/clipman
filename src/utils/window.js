const Config = require('../config');

function showMainWindow(win, screen) {
  // opacity to fix issue when window shows and then moves to cursor
  win.setOpacity(0);
  win.show();
  win.restore();
  setWindowToMousePos(win, screen);
  win.setOpacity(1);
}

function setWindowToMousePos(win, screen) {
  let { x, y } = screen.getCursorScreenPoint();

  // because x and y are not accurate
  x += 2;
  y += 2;

  let size = win.getContentSize();

  const bounds = screen.getPrimaryDisplay().bounds;

  // prevent window go out of screen horizontally
  if (x + size[0] > bounds.width)
    x = bounds.width - size[0];


  // prevent window go out of screen vertically
  if (y + size[1] > bounds.height - Config.bottomDockHeight)
    y = bounds.height - Config.bottomDockHeight - size[1];

  // not setPosition, because it for some reason resizes window
  win.setBounds({
    width: Config.mainWindowWidth,
    height: Config.mainWindowHeight,
    x: x,
    y: y
  });
}

function hideMainWindow(win) {
  // opacity to remove minimize animation
  win.setOpacity(0);
  // to return focus to previous place. minimize - windows, hide - linux
  win.minimize();
  win.hide();
}

module.exports = { showMainWindow, hideMainWindow };