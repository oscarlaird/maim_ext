// import { createClient } from './supabase.js';
import { createClient } from '@supabase/supabase-js';
console.log("Creating supabase client");
const SUPABASE_URL = 'https://scydgsnstcmcdfxrgvoh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjeWRnc25zdGNtY2RmeHJndm9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5OTAyOTgsImV4cCI6MjA1NzU2NjI5OH0.ZHfoMs5E_1Hra4KAlLt610RuQQA71Zlfl_zEGETGUaE';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjeWRnc25zdGNtY2RmeHJndm9oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTk5MDI5OCwiZXhwIjoyMDU3NTY2Mjk4fQ.NNZCzKTIqyh7rdzrERQ1kE1YQjxAcQuQ2-ph5UVZ8BQ';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
// Subscribe to changes to messages
const channel = supabase
  .channel('db-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'messages'
    },
    (payload) => {
      console.log('Change received!', payload);
    }
  )
  .subscribe();

let window_payload_map = new Map(); // Maps window IDs to their payload
let run_id_to_window_id_map = new Map(); // Maps run IDs to window IDs

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Handle specific message types
    if (message.type === "CREATE_RECORDING_WINDOW" || message.type === "CREATE_AGENT_RUN_WINDOW") {
        console.log("Creating window of type:", message.type, "with payload:", message.payload);
        create_window(message.type, message.payload);
    } else if (message.type === "JUMP_TO_AGENT_WINDOW") {
        console.log("BACKGROUND SCRIPT: Jumping to agent window");
        let run_id = message.payload.runId;
        console.log("BACKGROUND SCRIPT: Run ID:", run_id);
        let window_id = run_id_to_window_id_map.get(run_id);
        console.log("BACKGROUND SCRIPT: Window ID:", window_id);
        if (window_id) {
            console.log("BACKGROUND SCRIPT: Focusing on window ID:", window_id);
            chrome.windows.update(window_id, { focused: true });
        }
    }
});

function create_window(window_type, payload) {
    payload.windowType = window_type;
    chrome.windows.create({
        focused: true,
        type: 'normal',
        state: 'maximized'
    },
    (window) => {
        window_payload_map.set(window.id, payload);
        // Open the side panel in the newly created window
        let run_id = payload.runId;
        if (run_id) {
            run_id_to_window_id_map.set(run_id, window.id);
        }
        chrome.sidePanel.open({ windowId: window.id }, () => {
            if (chrome.runtime.lastError) {
                console.error("Failed to open side panel:", chrome.runtime.lastError);
            } else {
                console.log("Side panel opened in new window");
            }
        });
    });
}

// Get the window ID of the current tab
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "get-window-payload") {
        console.log("Received message get-window-payload:", request, "from sender:", sender, "with window id:", request.windowId);
        sendResponse({ payload: window_payload_map.get(request.windowId) });
    }
});

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });