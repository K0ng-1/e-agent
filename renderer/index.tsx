import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/index.css";
import "./i18n";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
