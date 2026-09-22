import { createRoot } from "react-dom/client";
import { Router } from "wouter";
import { APP_BASE_PATH } from "@shared/siteConfig";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <Router base={APP_BASE_PATH}>
    <App />
  </Router>,
);
