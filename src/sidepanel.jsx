import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
// import ChatInterface from "../../workflow-chat-buddy/src/components/ChatInterface";
// import App from "../../workflowlchat-buddy/src/App";
// import Index from "../../workflow-chat-buddy/src/pages/Index";

// import { createClient } from './supabase.js';
import { createClient } from '@supabase/supabase-js';
console.log("Creating supabase client in sidepanel");
const SUPABASE_URL = 'https://scydgsnstcmcdfxrgvoh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjeWRnc25zdGNtY2RmeHJndm9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5OTAyOTgsImV4cCI6MjA1NzU2NjI5OH0.ZHfoMs5E_1Hra4KAlLt610RuQQA71Zlfl_zEGETGUaE';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjeWRnc25zdGNtY2RmeHJndm9oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTk5MDI5OCwiZXhwIjoyMDU3NTY2Mjk4fQ.NNZCzKTIqyh7rdzrERQ1kE1YQjxAcQuQ2-ph5UVZ8BQ';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// TODO: reply to commands with real results
const channel = supabase
  .channel('db-changes')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'run_messages'
    },
    async (payload) => {
      console.log('Change received!', payload);
      let sender_type = payload.new.sender_type;
      let type = payload.new.type;
      console.log('Sender type:', sender_type);
      console.log('Type:', type);
      if (sender_type === 'backend' && type === 'command') {
        console.log('Command received:', payload.new.display_text);
        await supabase.from("run_messages").insert({
          "run_id": payload.new.run_id,
          "type": "result",
          "chat_id": payload.new.chat_id,
          "sender_type": "extension",
          "display_text": "Command received",
          "payload": {
            "dom": "fake"
          }
        });
      } 
    }
  )
  .subscribe();


function SidePanel() {
    const [windowId, setWindowId] = useState("unknown");
    const [windowPayload, setWindowPayload] = useState("unknown");

    useEffect(() => {
        // get our window id
        chrome.windows.getCurrent((window) => {
            setWindowId(window.id);
            // ask the background script for the window type (recording or agent)
            chrome.runtime.sendMessage({type: "get-window-payload", windowId: window.id}, async (response) => {
                let payload = response.payload;
                setWindowPayload(payload);
                console.log("Sidepanel: Received window payload:", payload);
                // post a run_message indicating that the extension has launched
                if (payload && payload.runId && payload.chatId) {
                    console.log("Sending extension_loaded message for run:", payload.runId);
                    await supabase.from("run_messages").insert({
                        "run_id": payload.runId,
                        "type": "extension_loaded",
                        "chat_id": payload.chatId,
                        "sender_type": "extension",
                        "display_text": "Extension loaded",
                    });
                }
            });
        });
    }, []);

    const getIframeSrc = () => {
        if (windowPayload.windowType === "CREATE_RECORDING_WINDOW") {
            return "https://preview--workflow-chat-buddy-04.lovable.app/conversation?chat_id=" + windowPayload.chatId;
        } else if (windowPayload.windowType === "CREATE_AGENT_RUN_WINDOW") {
            return "https://preview--workflow-chat-buddy-04.lovable.app/workflow?chat_id=" + windowPayload.chatId;
        }
        return null;
    };

    return (
        <div style={{ padding: 0, height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {windowPayload.windowType !== "unknown" ? (
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
        </div>
    );
}

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<SidePanel />);