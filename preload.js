const { contextBridge, ipcRenderer, webUtils } = require('electron');

// The only things the page can ask the desktop app to do.
contextBridge.exposeInMainWorld('appNative', {
  pathFor: file => { try { return webUtils.getPathForFile(file) || ''; } catch (e) { return ''; } },
  sourceFolder: filePath => ipcRenderer.invoke('source-folder', filePath),
  createFile: (dir, name) => ipcRenderer.invoke('create-file', dir, name),
  write: (id, data, position) => ipcRenderer.invoke('write-file', id, data, position),
  close: id => ipcRenderer.invoke('close-file', id),
  discard: id => ipcRenderer.invoke('discard-file', id),
  openFolder: dir => ipcRenderer.invoke('open-folder', dir),
});
