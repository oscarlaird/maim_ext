chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension was installed!");
});

let window_type_map = new Map(); // Maps window IDs to their type ('recording' or 'agent')

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message:", message);
    console.log("From sender:", sender);

    // Handle specific message types
    if (message.type === "CREATE_RECORDING_WINDOW" || message.type === "CREATE_AGENT_RUN_WINDOW") {
        console.log("Creating new window for screen recording");
        // chrome.windows.create({
        //     focused: true,
        //     type: 'normal'
        // }, (window) => {
        //     console.log("New window created for screen recording:", window.id);
        // });
        chrome.windows.create({
            focused: true,
            type: 'normal'
        }, (window) => {
            console.log("New window created:", window.id);
            window_type_map.set(window.id, message.type);
            // Open the side panel in the newly created window
            chrome.sidePanel.open({ windowId: window.id }, () => {
                if (chrome.runtime.lastError) {
                    console.error("Failed to open side panel:", chrome.runtime.lastError);
                } else {
                    console.log("Side panel opened in new window");
                }
            });
        });
    }
});

// Get the window ID of the current tab
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "get-window-id") {
        const tabId = sender.tab.id;
        chrome.tabs.get(tabId, (tab) => {
            sendResponse({ windowId: tab.windowId });
        });
        return true; // indicates async response
    }
});


chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });