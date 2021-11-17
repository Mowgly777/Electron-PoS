const electron = require('electron');
const path = require('path');
const url = require('url');
const remoteMain = require('@electron/remote/main');

const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const isMac = process.platform === 'darwin';
let RootWindow;

const menuTemplate = [
  {
    label: 'File',
    submenu: [

      ...(isMac
        ? [
          { //    invoice
            label: 'Invoice',
            click: () => { openWindow('invoice/invoice.html') }
          },
          {
            label: 'View Debtors',
            click: () => { console.log('view deets') },
          }, {
            label: 'Receive Payment',
            click: () => { console.log('recieve payment') }
          }
        ]
        : []),
      { role: 'quit' },
    ],
  }, { //    invoice
    label: 'Invoice',
    click: () => { openWindow('invoice/invoice.html') }
  }, { // Debtors
    label: 'Debtors',
    subMenu: [
      {
        label: 'View Details',
        click: () => { console.log('view deets') },
      }, {
        label: 'Receive Payment',
        click: () => { console.log('recieve payment') }
      }
    ]
  }, {
    role: 'window',
    submenu: [
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'minimize' },
      { role: 'close' }
    ]
  }
];

const openWindow = (html) => {
  const window = new BrowserWindow({
    width: 400,
    height: 600,
    modal: true,
    parent: RootWindow,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  remoteMain.enable(window.webContents);

  window.loadURL(url.format({
    pathname: path.join(__dirname, html),
    protocol: 'file:',
    slashes: true
  }));
};

exports.initMenu = (rootWindow) => {

  console.log('initting menu...');

  RootWindow = rootWindow;
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
};