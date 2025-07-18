const { app, BrowserWindow } = require("electron");
const path = require("path");

async function createWindow() {
  const isDev = (await import("electron-is-dev")).default;

  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      contextIsolation: true,
    },
  });

  if (isDev) {
    win
      .loadURL("http://localhost:3000")
      .catch((err) => console.error("Failed to load localhost", err));
    win.webContents.openDevTools();
  } else {
    const indexPath = path.join(__dirname, "client", "build", "index.html");
    win
      .loadFile(indexPath)
      .catch((err) => console.error("Failed to load index.html", err));
  }

  // 🔥 Fallback if load fails
  win.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription, validatedURL) => {
      console.error(`Failed to load: ${validatedURL}`);
      console.error(`Error ${errorCode}: ${errorDescription}`);

      win.loadURL(
        "data:text/html;charset=utf-8," +
          encodeURIComponent(`
        <h1 style="color:red;">Failed to load the app</h1>
        <p>${errorDescription}</p>
      `)
      );
    }
  );
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
