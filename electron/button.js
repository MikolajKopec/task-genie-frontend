const ipcRenderer = require('electron').ipcRenderer

// let name = document.getElementById('name');

let ButtonSendName = document.getElementById('open-main');
ButtonSendName.addEventListener('click', (event) => {
  ipcRenderer.send('show-main-window', true);
})

// ipcRenderer.on('nameReply', (event, arg) => {
//   console.log(arg) // why/what is not right..
// });