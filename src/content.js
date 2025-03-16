window.addEventListener("message", (event) => {
    if (event.source !== window || !event.data.type) return;

    // Handle specific message types
    if (event.data.type === "CREATE_RECORDING_WINDOW" || event.data.type === "CREATE_AGENT_RUN_WINDOW") {
        // Send message to background script to create a new window
        chrome.runtime.sendMessage({ 
            type: event.data.type, // CREATE_RECORDING_WINDOW or CREATE_AGENT_RUN_WINDOW
            payload: event.data.payload 
        });
    }

}); 

window.postMessage({ type: "EXTENSION_INSTALLED" }, "*");