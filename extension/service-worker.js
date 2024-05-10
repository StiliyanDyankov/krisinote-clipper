let isRunning = false;
let currentTabId = null;
let createtTabId = null;

chrome.action.onClicked.addListener(function (tab) {
  currentTabId = tab.id;
  if (!isRunning) {
    chrome.tabs.sendMessage(tab.id, { type: "LIFECYCLE_STATUS", id: tab.id });
    isRunning = true;
  } else {
    chrome.tabs.sendMessage(tab.id, { type: "LIFECYCLE_STATUS", id: tab.id });
    isRunning = false;
  }
});

chrome.runtime.onMessage.addListener(async ({ message }) => {
  if (message === "LIFECYCLE_STATUS") {
    chrome.tabs.sendMessage(currentTabId, {
      type: "LIFECYCLE_STATUS",
      id: tab.id,
    });
  }

  if (message === "Open new tab") {
    chrome.tabs.create(
      { url: "http://localhost:3000/login?loginFromExt=true" },
      (tab) => {
        createtTabId = tab.id;
        chrome.scripting
          .executeScript({ target: { tabId: tab.id }, func: injectedFunction })
          .then((event) => {
            // here to execute some logic - access to token
            chrome.tabs.sendMessage(currentTabId, {
              type: "USER_AUTHENTICATED",
              payload: event,
            });
          });
      },
    );
  }

  if (message === "REDIRECT_TO_CURR") {
    chrome.tabs.update(currentTabId, { active: true });
    chrome.tabs.remove(createtTabId);
  }
});

async function injectedFunction() {
  const promise = new Promise((resolve) => {
    window.postMessage({
      message: "hey, its me, the injected script",
      type: "FROM_CONTENT_SCRIPT",
    });

    window.addEventListener("successfulLogin", (event) => {
      resolve(event);
    });
  });

  window.addEventListener("message", (event) => {
    if (event.data.type === "FROM_REACT_APP") {
      setTimeout(() => {
        chrome.runtime.sendMessage({ message: "REDIRECT_TO_CURR" });
      }, 3000);
    }
  });

  const event = await promise;

  return event.detail.token;
}
