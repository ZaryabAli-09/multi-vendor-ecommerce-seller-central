// importing fonts
import "@fontsource/inter/400.css"; // Regular
import "@fontsource/inter/700.css"; // Bold
import "@fontsource/playfair-display/700.css"; // Bold for headings

import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(<App />);
