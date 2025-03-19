window.addEventListener("message", (event) => {
    if (event.source !== window || !event.data.type) return;
    console.log("CONTENT SCRIPT: Received message:", event.data);
    if (event.data.type === "JUMP_TO_AGENT_WINDOW") {
        console.log("CONTENT SCRIPT: Received message to jump to agent window");
        // forward
        chrome.runtime.sendMessage({ type: event.data.type, payload: event.data.payload });
    }

    // Handle specific message types
    if (event.data.type === "CREATE_RECORDING_WINDOW" || event.data.type === "CREATE_AGENT_RUN_WINDOW") {
        console.log("CONTENT SCRIPT: Received message to create window of type:", event.data.type, "with payload:", event.data.payload);
        // Send message to background script to create a new window
        chrome.runtime.sendMessage({ 
            type: event.data.type, // CREATE_RECORDING_WINDOW or CREATE_AGENT_RUN_WINDOW
            payload: event.data.payload 
        });
    }

}); 

window.postMessage({ type: "EXTENSION_INSTALLED" }, "*");