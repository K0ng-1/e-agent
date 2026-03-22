
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
async function loadExtension(app: Electron.App) {
  if (app.isPackaged) return;

  try {
    await installExtension(REACT_DEVELOPER_TOOLS);
    console.log("React DevTools installed");
  } catch (e) {
    console.error("devtools install failed", e);
  }
  
}

export default loadExtension;