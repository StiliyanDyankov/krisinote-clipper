import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { applyStyles } from "./lib/lib"
import { ClipperRootElementId, RootElementStyles } from "./lib/constants"

export let root: any = null
const rootElement = document.createElement("div")
applyStyles(rootElement, RootElementStyles)
// rootElement.style.backgroundColor = "#ffffff";
// rootElement.style.pointerEvents = "none";

rootElement.id = ClipperRootElementId

document.body.appendChild(rootElement)

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  processLifecycle(request)
})

function processLifecycle(request: any) {
  if (request.type === "LIFECYCLE_STATUS") {
    if (!root || !root._internalRoot) {
      root = ReactDOM.createRoot(rootElement)

      root.render(
        <React.StrictMode>
          <App id={request.id} onExit={processLifecycle} />
        </React.StrictMode>
      )
    } else {
      root.unmount()
    }
  }
}
