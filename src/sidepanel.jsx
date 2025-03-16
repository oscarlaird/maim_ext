import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
// import ChatInterface from "../../workflow-chat-buddy/src/components/ChatInterface";
// import App from "../../workflow-chat-buddy/src/App";
// import Index from "../../workflow-chat-buddy/src/pages/Index";

function SidePanel() {
    const [windowId, setWindowId] = useState("unknown");

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data.type === "WINDOW_ID") {
                setWindowId(event.data.payload);
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    return (
        <div style={{ padding: 0, height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>
                Window ID: {windowId}
            </div>
            <iframe 
                // src="http://localhost:8080"
                src="https://preview--workflow-chat-buddy.lovable.app/conversation"
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    flex: 1
                }}
            />
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