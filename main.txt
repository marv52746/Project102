const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

require("@electron/remote/main").initialize();

let serverProcess;
let serverStarted = false;

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

async function createWindow() {
  const isDev = (await import("electron-is-dev")).default;

  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
  } else {
    const indexPath = path.join(__dirname, "client", "build", "index.html");
    win.loadFile(indexPath);
  }

  win.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription, validatedURL) => {
      console.error(`Failed to load: ${validatedURL}`);
      console.error(`Error ${errorCode}: ${errorDescription}`);
    }
  );
}

function startServer() {
  if (serverStarted) return;
  serverStarted = true;

  const isDev = process.env.NODE_ENV === "development";
  const serverPath = isDev
    ? path.join(__dirname, "server", "server.js")
    : path.join(
        process.resourcesPath,
        "app.asar.unpacked",
        "server",
        "server.js"
      );

  console.log("Starting backend server from:", serverPath);

  // ✅ Use Electron's Node runtime in prod
  const command = isDev ? "node" : process.execPath;
  const args = isDev ? [serverPath] : [serverPath];
  const env = isDev
    ? process.env
    : { ...process.env, ELECTRON_RUN_AS_NODE: "true" };

  serverProcess = spawn(command, args, { stdio: "pipe", env });

  serverProcess.stdout.on("data", (data) => console.log(`SERVER: ${data}`));
  serverProcess.stderr.on("data", (data) =>
    console.error(`SERVER ERROR: ${data}`)
  );
  serverProcess.on("close", (code) => {
    console.log(`Server exited with code ${code}`);
    serverStarted = false;
  });
}

app.on("ready", () => {
  startServer();
  createWindow();
});

app.on("second-instance", () => {
  const win = BrowserWindow.getAllWindows()[0];
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (serverProcess) serverProcess.kill();
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
