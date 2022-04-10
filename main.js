// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  Menu,
  MenuItem,
  ipcMain,
  webFrame
} = require('electron')
const path = require('path')
const fs = require("fs")
// try {
//   require('electron-reloader')(module);
// } catch {}

const isMac = process.platform === 'darwin'
// const mainWindow
const initWidth = 418
const initHeight = 232
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: initWidth,
    height: initHeight,
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
  // mainWindow.webContents.openDevTools()

  // Upper Limit is working of 500 %
  mainWindow.webContents
    // .setVisualZoomLevelLimits(1, 5)
    // .then(console.log("Zoom Levels Have been Set between 100% and 500%"))
    // .catch((err) => console.log(err));
}

const template = [{
    label: 'Electron',
    submenu: [{
      role: 'help',
      accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',
      click: () => {
        console.log(test)
      }
    }]
  },
  // {
  //   label: 'View',
  //   submenu: [
  //     { role: 'reload' },
  //     { role: 'forceReload' },
  //     { role: 'toggleDevTools' },
  //     { type: 'separator' },
  //     { role: 'resetZoom' },
  //     { role: 'zoomIn' },
  //     { role: 'zoomOut' },
  //     { type: 'separator' },
  //     { role: 'togglefullscreen' }
  //   ]
  // }, 
  {
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
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.on('testSignal', handleTest)
  // ipcMain.on('setZoom', setZoom)
  ipcMain.on('resize-me-please', (event, zoomFactor = arg) => {
    console.log(`initial window size: ${initWidth} x ${initHeight}`)
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    let winSize = win.getSize()
    console.log(`current window size: ${winSize[0]} x ${winSize[1]}`)
    console.log(`zoomFactor: ${zoomFactor}`)
    let newWidth = initWidth * zoomFactor
    let newHeight = initHeight * zoomFactor
    console.log(`new window size: ${Math.floor(newWidth)} x ${Math.floor(newHeight)}`)
    win.setContentSize(Math.floor(newWidth), Math.floor(newHeight))
  })
  ipcMain.on('log', (event, arg) => {
    console.log(arg)
  })

  const mainWindow = createWindow()

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

//A function that returns a test string
function handleTest(event, title = 'testttt') {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(title)
}
// function setSize(width,height) {
//   const webContents = event.sender
//   const win = BrowserWindow.fromWebContents(webContents)
//   win.setSize(width,height)
// }
// function setZoom(zoom = 1.25) {
//   webFrame.setZoomFactor(Number(zoom))
// }