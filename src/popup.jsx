import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import ChatInterface from "../../workflow-chat-buddy/src/components/ChatInterface";
// import Dumb from "../../workflow-chat-buddy/src/components/Dumb";

function Popup() {
    return (
        <div style={{ padding: 20 }}>
            <h2>React Chrome Extension!</h2>
            <h2>React Chrome Extension!</h2>
            <h2>React Chrome Extension!</h2>
            <ChatInterface />
        </div>
    );
}

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<Popup />);