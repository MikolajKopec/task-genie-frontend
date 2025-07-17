const {app, BrowserWindow, ipcMain, dialog, shell} = require("electron");
const url = require("url");
const path = require("path"); // Correctly importing path here
const PythonManager = require('./pythonManager');

const DEBUG = true

const lang = 'en-US'
let mainWindow;
let pythonManager;

function createWindow() {
    mainWindow = new BrowserWindow({
        minWidth: 350,
        minHeight: 550,
        width: 1280,
        height: 720,
        icon: path.join(__dirname, `logo.ico`),
        title: "TaskGenie",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: true,
        },
    })
    mainWindow.setMenuBarVisibility(DEBUG);


    const startURL = DEBUG ? "http://localhost:4200" :
        url.format({
            pathname: path.join(__dirname, `../bot-frontend/dist/bot-frontend/browser/${lang}/index.html`),
            protocol: "file:",
            slashes: true,
        });

    mainWindow.loadURL(startURL);
    mainWindow.webContents.openDevTools();
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

    mainWindow.on("closed", () => {
        mainWindow = null;
    });

    // Initialize PythonManager with the mainWindow reference
    pythonManager = new PythonManager(mainWindow);
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
    if (mainWindow === null) createWindow();
});

ipcMain.on('toPython', (event, args) => {
    pythonManager.sendToPython(args);
});

ipcMain.handle('select-directory', async (event) => {
    const {filePaths} = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    return filePaths; // This will be the resolved value of the invoke call
});

ipcMain.handle('select-file', async (event) => {
    const {filePaths} = await dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections']
    });
    return filePaths; // This will be the resolved value of the invoke call
});
