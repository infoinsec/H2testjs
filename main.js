// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  Menu,
  MenuItem
} = require('electron')
const path = require('path')
try {
  require('electron-reloader')(module);
} catch {}

const isMac = process.platform === 'darwin'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 418,
    height: 232,
    useContentSize: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  win.webContents.setZoomFactor(1.0);

  // Upper Limit is working of 500 %
  mainWindow.webContents
    .setVisualZoomLevelLimits(1, 5)
    .then(console.log("Zoom Levels Have been Set between 100% and 500%"))
    .catch((err) => console.log(err));

}
var test = "test"
const template = [{
  label: 'Electron',
  submenu: [{
    role: 'help',
    accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',
    click: () => {
      console.log(test)
    }
  }]
}, {
  label: 'Window',
  submenu: [{
      role: 'minimize'
    },
    {
      role: 'zoom'
    },
    ...(isMac ? [{
        type: 'separator'
      },
      {
        role: 'front'
      },
      {
        type: 'separator'
      },
      {
        role: 'window'
      }
    ] : [{
      role: 'close'
    }])
  ]
}]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.