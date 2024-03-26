chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        id: "sendTextToAPI",
        title: "Send Text to API",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "sendTextToAPI") {
        chrome.tabs.sendMessage(tab.id, {text: info.selectionText});
    }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'openOptionsPage') {
        chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
    }
});