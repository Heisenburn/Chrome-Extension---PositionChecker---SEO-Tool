chrome.browserAction.onClicked.addListener(function listener (tab) { //Fired when User Clicks ICON
  
    chrome.windows.create({
        "url": "index.html",
        "state":"normal",
        "incognito": true
    });
 
});

 