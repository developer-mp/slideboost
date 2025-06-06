const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  findLatestVideo: () => ipcRenderer.invoke('find-latest-video'),
  findVideoInFolder: (folderPath) => ipcRenderer.invoke('find-video-in-folder', folderPath),
  startWatcher: (customFolders) => ipcRenderer.invoke('start-watcher', customFolders),
  stopWatcher: () => ipcRenderer.invoke('stop-watcher'),
  addWatchFolder: (folderPath) => ipcRenderer.invoke('add-watch-folder', folderPath),
  getLatestWatchedVideo: () => ipcRenderer.invoke('get-latest-watched-video'),
  onLatestVideo: (callback) => {
    const wrappedCallback = (event, data) => callback(data);
    ipcRenderer.on('latest-video', wrappedCallback);
    return () => ipcRenderer.removeListener('latest-video', wrappedCallback);
  },
  platform: process.platform,
  versions: {
    node: process.versions.node,
    electron: process.versions.electron,
    chrome: process.versions.chrome
  }
});