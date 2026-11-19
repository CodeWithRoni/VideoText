const { app, BrowserWindow, shell, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let win = null;
const allowedDirs = new Set();        // folders the user picked in this session
const openFiles = new Map();          // id -> { handle, file }
let nextId = 1;

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 940,
    minHeight: 620,
    title: 'CodeCaption',
    backgroundColor: '#0d1117',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, 'app', 'index.html'));

  // The app is fully offline: never navigate away or open extra windows.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', e => e.preventDefault());

  // Closing while an export is running: ask first.
  win.webContents.on('will-prevent-unload', e => {
    const choice = dialog.showMessageBoxSync(win, {
      type: 'question',
      buttons: ['Keep exporting', 'Quit anyway'],
      defaultId: 0,
      cancelId: 0,
      message: 'An export is still running.',
      detail: 'If you quit now, the video being exported will not be saved.',
    });
    if (choice === 1) e.preventDefault();
  });
  win.on('closed', () => { win = null; });
}

// ---------- saving files ----------
ipcMain.handle('pick-folder', async () => {
  let dir = null;
  if (!app.isPackaged && process.env.CODECAPTION_TEST_DIR) dir = process.env.CODECAPTION_TEST_DIR;   // automated tests only
  else {
    const r = await dialog.showOpenDialog(win, {
      title: 'Choose where to save the videos',
      buttonLabel: 'Save here',
      properties: ['openDirectory', 'createDirectory'],
    });
    if (!r.canceled && r.filePaths[0]) dir = r.filePaths[0];
  }
  if (dir) allowedDirs.add(path.resolve(dir));
  return dir;
});

ipcMain.handle('create-file', async (_e, dir, name) => {
  dir = path.resolve(String(dir));
  if (!allowedDirs.has(dir)) throw new Error('Folder was not chosen by the user.');
  const safe = path.basename(String(name)).replace(/[\\/:*?"<>|]/g, '').trim() || 'video.mp4';
  const ext = path.extname(safe) || '.mp4';
  const base = safe.slice(0, safe.length - path.extname(safe).length) || 'video';
  for (let i = 1; i < 10000; i++) {
    const fileName = `${base}${i > 1 ? ` (${i})` : ''}${ext}`;
    const file = path.join(dir, fileName);
    try {
      const handle = await fs.promises.open(file, 'wx');     // never overwrites an existing file
      const id = nextId++;
      openFiles.set(id, { handle, file });
      return { id, name: fileName };
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }
  }
  throw new Error('Could not create the output file.');
});

ipcMain.handle('write-file', async (_e, id, data, position) => {
  const f = openFiles.get(id);
  if (!f) return;
  const buf = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
  await f.handle.write(buf, 0, buf.length, position);
});

ipcMain.handle('close-file', async (_e, id) => {
  const f = openFiles.get(id);
  if (!f) return;
  openFiles.delete(id);
  await f.handle.close();
});

ipcMain.handle('discard-file', async (_e, id) => {
  const f = openFiles.get(id);
  if (!f) return;
  openFiles.delete(id);
  try { await f.handle.close(); } catch (_) {}
  try { await fs.promises.unlink(f.file); } catch (_) {}
});

ipcMain.handle('open-folder', async (_e, dir) => {
  dir = path.resolve(String(dir));
  if (allowedDirs.has(dir)) await shell.openPath(dir);
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
