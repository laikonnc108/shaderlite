'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import * as path from 'path'
import { sync_exec } from'./tools'
import { format as formatUrl } from 'url'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow

// Standard scheme must be registered before the app is ready
//protocol.registerStandardSchemes(['app'], { secure: true })
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: {  secure: true } }]);

function createMainWindow () {
  const window = new BrowserWindow({ webPreferences: { webSecurity: false , nodeIntegration: true}, icon:  'assets/icon.png'  })

  if (isDevelopment) {
    // Load the url of the dev server if in development mode
    window.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) window.webContents.openDevTools()
  } else {
    createProtocol('app')
    //   Load the index.html when not in development
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
      })
    )
  }

  window.on('closed', async (e) => {
    mainWindow = null
    let moment = require('moment')
    moment.locale('en')
    let isoDay = moment().format('YYYY-MM-DD')
    // TODO get dirs programaticly and do in one place
    let so1 = await sync_exec(`copy C:\\Users\\alrhma\\AppData\\Roaming\\shaderlite\\db\\shaderlite.db D:\\00_db\\shaderlite-${isoDay}.db`)
    let so2 = await sync_exec(`copy C:\\Users\\alrhma\\AppData\\Roaming\\shaderlite\\db\\shaderlite.db D:\\zdevhome\\electron\\shaderlite\\db\\shaderlite.db`)
    console.log(so1, so2)
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  // Add window.maximize()
  window.maximize()

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    await installVueDevtools()
  }
  mainWindow = createMainWindow()
  mainWindow.on('close', async ()=> {
    await sync_exec(`copy C:\\Users\\alrhma\\AppData\\Roaming\\shaderlite\\db\\shaderlite.db D:\\zdevhome\\electron\\shaderlite\\db\\shaderlite.db`)
  })
})
