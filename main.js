const {
  app,
  BrowserWindow,
} = require('electron');
const { initMenu } = require('./src/menu');
const remoteMain = require('@electron/remote/main');
const {
  closeDb,
} = require('./src/database/index');

remoteMain.initialize();

const createWindow = () => {
  const window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    }
  });

  initMenu(window);

  window.loadFile('src/landing/landing.html');
  window.webContents.openDevTools();
  window.on('close', closeDb);
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();

    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
