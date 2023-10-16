chrome.tabs.onUpdated.addListener((tabId , changeInfo, tab) => {
  if (tab.url?.startsWith("chrome://") || !tab.url?.includes('.sharkscope')) return undefined;

  if (changeInfo.status === "complete") {
    chrome.storage.sync.get(["sharkscope-darktheme"], function(items)  {
      var themeActive = items['sharkscope-darktheme'];
      if (themeActive) {
        chrome.scripting.insertCSS({target: {tabId: tabId}, files: ['new-sharkscope-styles.css']});
      }
    });
  }
});

chrome.runtime.onStartup.addListener(function() {
  chrome.storage.sync.get(["sharkscope-darktheme"], function(items)  {
    var themeActive = items['sharkscope-darktheme'];
    updateExtensionIcon(themeActive);
    if (themeActive) {
      chrome.scripting.insertCSS({target: {tabId: tabId}, files: ['new-sharkscope-styles.css']});
    }
  });
})

chrome.action.onClicked.addListener((_) => {
  chrome.storage.sync.get(["sharkscope-darktheme"], function(items)  {
    var themeActive = items['sharkscope-darktheme'];
    updateSharkscopeTabsTheme(themeActive)
  });
});

chrome.runtime.onInstalled.addListener(function(details){
  if(details.reason == "install"){
    setLocalStorage(true);
  }
});

function updateExtensionIcon(themeActive) {
  chrome.action.setIcon({ path: themeActive ? "images/icon32.png" : "images/icon32-off.jpg" });
}

function updateSharkscopeTabsTheme(currentThemeStatusActive) {
  if (currentThemeStatusActive == null) {
    currentThemeStatusActive = true;
    setLocalStorage(true);
  } else {
    setLocalStorage(!currentThemeStatusActive);
    currentThemeStatusActive = !currentThemeStatusActive;
  }

  updateExtensionIcon(currentThemeStatusActive);
  updateTabsTheme(currentThemeStatusActive);
}

async function updateTabsTheme(themeActive) {
  var tabs = await chrome.tabs.query({ url: "*://*.sharkscope.com/*" });
  for (const tab of tabs) {
    if (themeActive) {
      chrome.scripting.insertCSS({ target: { tabId: tab.id }, files: ['new-sharkscope-styles.css'] });
    } else {
      chrome.scripting.removeCSS({ target: { tabId: tab.id }, files: ['new-sharkscope-styles.css'] });
    }
  }
}

function setLocalStorage(value) {
  chrome.storage.sync.set({ "sharkscope-darktheme": value });
}
