const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    sendDataToBackend: (data) => ipcRenderer.send('toPython', data),
    receiveDataFromBackend: (callback) => ipcRenderer.on('fromPython', (event, data) => callback(data)),
    receiveReturnCodeFromBackend: (callback) => ipcRenderer.on('pythonExited', (event, code) => callback(code)),
    selectDirectory: () => ipcRenderer.invoke('select-directory'),
    selectFile: () => ipcRenderer.invoke('select-file')
});
