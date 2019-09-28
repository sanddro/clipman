function showMainWindow(win) {
  win.show();
  win.restore();
  win.setOpacity(1);
}

function hideMainWindow(win) {
  win.setOpacity(0);
  win.minimize();
  win.hide();
}

module.exports = { showMainWindow, hideMainWindow };