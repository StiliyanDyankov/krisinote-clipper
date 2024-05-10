import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

export let root: any = null;
const rootElement = document.createElement("div");
rootElement.style.position = "fixed";
rootElement.style.right = "12px";
rootElement.style.top = "12px";
rootElement.style.width = "300px";
rootElement.style.height = "auto";
rootElement.style.zIndex = "99999";
// rootElement.style.backgroundColor = "#ffffff";
// rootElement.style.pointerEvents = "none";

rootElement.id = "react-chrome-app";

document.body.appendChild(rootElement);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  processLifecycle(request);
});

function processLifecycle(request: any) {
  if (request.type === "LIFECYCLE_STATUS") {
    if (!root || !root._internalRoot) {
      root = ReactDOM.createRoot(rootElement);

      root.render(
        <React.StrictMode>
          <App id={request.id} onExit={processLifecycle} />
        </React.StrictMode>,
      );
    } else {
      root.unmount();
    }
  }
}
