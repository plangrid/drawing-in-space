import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import DrawingApp from "./DrawingApp";

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<DrawingApp />);
}
