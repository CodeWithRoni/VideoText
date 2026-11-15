const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1240,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'VideoText',
    backgroundColor: '#0e1218',
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, 'app', 'index.html'));

  // The app is fully offline: never navigate away or open extra windows.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', e => e.preventDefault());
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
