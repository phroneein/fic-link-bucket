chrome.browserAction.setBadgeText({text: "ao3.L"}); //text on the icon 

chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.create({url: "content.html"}, function(tab) {
    chrome.tabs.executeScript(tab.id, {file: "content.js"}); //open CONTENT js script
  });
});