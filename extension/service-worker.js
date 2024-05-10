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

  if (message === "REDIRECT_TO_CURR") {
    chrome.tabs.update(currentTabId, { active: true });
    chrome.tabs.remove(createtTabId);
  }
});
