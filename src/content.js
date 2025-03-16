window.addEventListener("message", (event) => {
    if (event.source !== window || !event.data.type) return;

    console.log("Received message from website:", event.data);

    // Handle specific message types
    if (event.data.type === "START_SCREEN_RECORDING") {
        console.log("Starting screen recording...");
        
        // Send message to background script to create a new window
        chrome.runtime.sendMessage({ 
            type: "CREATE_RECORDING_WINDOW",
            payload: event.data.payload 
        });
    }

    // Forward message to the background script
    chrome.runtime.sendMessage({ type: "FROM_WEBSITE", payload: event.data.payload });


    // // Get our window ID by asking the background script
    // chrome.runtime.sendMessage({type: "get-window-id"}, (response) => {
    //     const windowId = response.windowId;
    //     console.log("Content script running in window:", windowId);
    //     window.postMessage({type: "WINDOW_ID", payload: windowId}, "*");
    // });
}); 

window.postMessage({ type: "EXTENSION_INSTALLED" }, "*");