import { createRoot } from "react-dom/client";
import App from "./App";
import "@renderer/styles/index.css";
import "@renderer/i18n";
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
