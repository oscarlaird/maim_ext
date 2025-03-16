let window_type_map = new Map(); // Maps window IDs to their type ('recording' or 'agent')

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Handle specific message types
    if (message.type === "CREATE_RECORDING_WINDOW" || message.type === "CREATE_AGENT_RUN_WINDOW") {
        chrome.windows.create({
            focused: true,
            type: 'normal'
        }, (window) => {
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
    if (request.type === "get-window-type") {
        console.log("Received message get-window-type:", request, "from sender:", sender, "with window id:", request.windowId);
        sendResponse({ windowType: window_type_map.get(request.windowId) });
    }
});

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });