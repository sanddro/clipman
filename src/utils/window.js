function showWindowWithoutFlicker(win) {
  if (!win) return;
  win.setOpacity(0);
  win.show();
  setTimeout(() => {
    win.setOpacity(1)
  }, 100)
}

module.exports = { showWindowWithoutFlicker };