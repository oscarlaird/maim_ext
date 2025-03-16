import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
// import ChatInterface from "../../workflow-chat-buddy/src/components/ChatInterface";
// import App from "../../workflowlchat-buddy/src/App";
// import Index from "../../workflow-chat-buddy/src/pages/Index";

function SidePanel() {
    const [windowId, setWindowId] = useState("unknown");
    const [windowType, setWindowType] = useState("unknown");

    useEffect(() => {
        // get our window id
        chrome.windows.getCurrent((window) => {
            setWindowId(window.id);
            // ask the background script for the window type (recording or agent)
            chrome.runtime.sendMessage({type: "get-window-type", windowId: window.id}, (response) => {
                setWindowType(response.windowType);
            });
        });
    }, []);

    const getIframeSrc = () => {
        if (windowType === "CREATE_RECORDING_WINDOW") {
            return "https://preview--workflow-chat-buddy.lovable.app/conversation";
        } else if (windowType === "CREATE_AGENT_RUN_WINDOW") {
            return "https://preview--workflow-chat-buddy.lovable.app/workflow";
        }
        return null;
    };

    return (
        <div style={{ padding: 0, height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>
                Window ID: {windowId}
            </div>
            <div style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>
                Window Type: {windowType}
            </div>
            {windowType !== "unknown" ? (
                <iframe 
                    src={getIframeSrc()}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        flex: 1
                    }}
                />
            ) : (
                <div style={{ padding: '8px' }}>Loading...</div>
            )}
            {/* <h2>Workflow Chat Buddy - Side Panel</h2>
            <div style={{ flex: 1, overflow: 'auto' }}>
                <Index />
            </div> */}
        </div>
    );
}

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<SidePanel />);