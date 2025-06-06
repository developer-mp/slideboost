const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
const path = require('path');
const url = require('url');

const { findLatestVideoFile, findLatestVideoInCustomFolder } = require('./video-finder');
const videoWatcher = require('./video-watcher');

const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 600,
    minHeight: 500,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    show: false
  });

  const htmlPath = path.join(__dirname, 'index.html');
  mainWindow.loadFile(htmlPath);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('closed', () => {
    videoWatcher.stopWatching();
    mainWindow = null;
  });

  setTimeout(() => {
    const watcherStarted = videoWatcher.initialize();
    if (!watcherStarted) {
      const homeDir = require('os').homedir();
      videoWatcher.initialize([homeDir]);
    }

    const videoCallback = (newVideoData) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('latest-video', newVideoData);
      }
    };

    videoWatcher.registerCallback(videoCallback);

    mainWindow.on('closed', () => {
      videoWatcher.removeCallback(videoCallback);
    });

    const initialVideo = videoWatcher.getLatestVideo();
    if (initialVideo && mainWindow && !mainWindow.isDestroyed()) {
      setTimeout(() => {
        mainWindow.webContents.send('latest-video', initialVideo);
      }, 2000);
    }
  }, 1000);
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle('find-latest-video', async () => {
    try {
      const result = findLatestVideoFile();
      return result;
    } catch (error) {
      throw error;
    }
  });

  ipcMain.handle('find-video-in-folder', async (event, folderPath) => {
    try {
      const result = findLatestVideoInCustomFolder(folderPath);
      return result;
    } catch (error) {
      throw error;
    }
  });

  ipcMain.handle('start-watcher', async (event, customFolders) => {
    try {
      const result = videoWatcher.initialize(customFolders);
      return result;
    } catch (error) {
      throw error;
    }
  });

  ipcMain.handle('stop-watcher', async () => {
    try {
      const result = videoWatcher.stopWatching();
      return result;
    } catch (error) {
      throw error;
    }
  });

  ipcMain.handle('add-watch-folder', async (event, folderPath) => {
    try {
      const result = videoWatcher.addFolder(folderPath);
      return result;
    } catch (error) {
      throw error;
    }
  });

  ipcMain.handle('get-latest-watched-video', async () => {
    try {
      const result = videoWatcher.getLatestVideo();
      return result;
    } catch (error) {
      throw error;
    }
  });
});

app.on('window-all-closed', () => {
  videoWatcher.stopWatching();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
  });
});