const { contextBridge, ipcRenderer } = require('electron');

// The only things the page can ask the desktop app to do.
contextBridge.exposeInMainWorld('videotextNative', {
  pickFolder: () => ipcRenderer.invoke('pick-folder'),
  createFile: (dir, name) => ipcRenderer.invoke('create-file', dir, name),
  write: (id, data, position) => ipcRenderer.invoke('write-file', id, data, position),
  close: id => ipcRenderer.invoke('close-file', id),
  discard: id => ipcRenderer.invoke('discard-file', id),
  openFolder: dir => ipcRenderer.invoke('open-folder', dir),
  onStatus: cb => ipcRenderer.on('status', (_e, text) => cb(text)),
});
