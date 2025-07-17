const { spawn } = require('child_process');
const path = require('path');

class PythonManager {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.pythonProcess = null;
    this.setupPythonProcess();
  }

  setupPythonProcess() {
    const venvPath = path.join(__dirname, "../../bot-backend/NicoleBot/venv/Scripts/python.exe");
    const projectRoot = path.join(__dirname, "../../bot-backend/NicoleBot");

    this.pythonProcess = spawn(venvPath, [path.join(projectRoot, "electron_middleware.py")], {
      cwd: projectRoot,
      env: { ...process.env, PYTHONIOENCODING: "UTF-8" },
    });

    this.pythonProcess.stdout.on('data', (data) => {
      const messages = data.toString().split("#@ENDMSG#@"); // Split data using custom delimiter
      messages.forEach((message) => {
        if (message.trim()) {
          console.log(`Python: ${message}`);
          if (this.mainWindow) {
            this.mainWindow.webContents.send('fromPython', message);
          }
        }
      });
    });


    this.pythonProcess.stderr.on('data', (data) => {
      // console.error(`Python Error: ${data}`);
      if (this.mainWindow) {
        this.mainWindow.webContents.send('fromPythonError', data.toString());
      }
    });

    this.pythonProcess.on('error', (error) => {
      console.error("Failed to start Python process:", error);
    });

    this.pythonProcess.on('close', (code) => {
      console.log(`Python process exited with code ${code}`);
      if (this.mainWindow) {
        this.mainWindow.webContents.send('pythonExited', code);
      }
    });
  }

  sendToPython(data) {
    if (this.pythonProcess) {
      this.pythonProcess.stdin.write(`${data}\n`);
    }
  }
}

module.exports = PythonManager;
