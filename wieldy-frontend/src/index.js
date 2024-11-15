// import React from "react";
// import ReactDOM from "react-dom/client";
// import process from "process";
// import "./index.css";
// import App from "./App";

// window.process = process;

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom/client";
import process from "process";
import "./index.css";
import App from "./App";

// Attach `process` to the global `window` object
window.process = process;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
