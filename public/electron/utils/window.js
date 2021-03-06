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

  let screensWidth = 0;
  let screensHeight = 0;

  for (const display of screen.getAllDisplays()) {
    screensWidth = Math.max(display.workArea.x + display.workArea.width, screensWidth);
    screensHeight = Math.max(display.workArea.y + display.workArea.height, screensHeight);
  }

  // prevent window go out of screen horizontally
  if (x + size[0] > screensWidth)
    x = screensWidth - size[0];


  // prevent window go out of screen vertically
  if (y + size[1] > screensHeight)
    y = screensHeight - size[1];

  // not setPosition, because it for some reason resizes window
  win.setBounds({
    width: Config.getConfig().mainWindowWidth,
    height: Config.getConfig().mainWindowHeight,
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
