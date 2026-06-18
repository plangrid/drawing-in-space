import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import DrawingApp from "./DrawingApp";
import * as serviceWorker from "./serviceWorker";

const root = createRoot(document.getElementById("root"));
root.render(<DrawingApp />);

serviceWorker.unregister();
