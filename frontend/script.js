const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const sidebarToggle = document.getElementById('sidebar-toggle');
const modeToggle = document.getElementById('mode-toggle-checkbox');
const sidebar = document.querySelector('.sidebar');
const conversationList = document.getElementById('conversation-list');
const newConversationBtn = document.getElementById('new-conversation-btn');
const clearHistoryBtn = document.getElementById('clear-history-btn');

let conversations = JSON.parse(localStorage.getItem("conversations")) || [];
let currentConversation = [];
let conversationStarted = false;

// Toggle Dark Mode
modeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});

// Handle User Input & Send Message
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
    if (!conversationStarted && chatBox.innerHTML.trim() === "") {
        startNewConversation();
        conversationStarted = true;
    }
});

// Sidebar Toggle
document.addEventListener('DOMContentLoaded', function () {
    const chatContainer = document.querySelector('.chat-container');
    updateConversationList();

    sidebarToggle.addEventListener('click', function () {
        sidebar.classList.toggle('collapsed');
        chatContainer.style.width = sidebar.classList.contains('collapsed') ? '96%' : 'calc(100% - 300px)';
        chatContainer.style.marginLeft = sidebar.classList.contains('collapsed') ? '3%' : '300px';
    });

    newConversationBtn.addEventListener('click', startNewConversation);
    clearHistoryBtn.addEventListener('click', clearConversationHistory);
});

// Send Message & Get Response
function sendMessage() {
    const message = userInput.value.trim();
    if (message !== '') {
        appendMessage('User', message);
        currentConversation.push({ sender: 'User', text: message });
        fetchBotResponse(message);
        userInput.value = '';
    }
}

// Append Message to Chat Box
function appendMessage(sender, message) {
    const p = document.createElement('p');
    p.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Fetch Response & Convert to Table
function fetchBotResponse(message) {
    fetch("https://striped-selia-ankituikey-f30b92bb.koyeb.app/chat", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data && data.response) {
            if (Array.isArray(data.response) && data.response.length > 0) {
                // If the response is an array of objects, display it as a table
                const tableHTML = generateTable(data.response);
                chatBox.innerHTML += `<div>${tableHTML}</div>`;
            } else if (typeof data.response === "object") {
                // If the response is an object, display it as formatted JSON
                appendMessage("BOT", `<pre>${JSON.stringify(data.response, null, 2)}</pre>`);
            } else {
                // For any other data type (e.g., string), display it directly
                appendMessage("BOT", data.response);
            }
            chatBox.scrollTop = chatBox.scrollHeight;
            currentConversation.push({ sender: "BOT", text: "Response received." });
        } else {
            appendMessage("BOT", "⚠️ Unexpected response format.");
        }
    })
    .catch(error => {
        console.error("Error fetching Data & Response:", error);
        appendMessage("BOT", "❌ Error fetching response. Please try again.");
    });
}

// Append Table to Chat Box
function appendTable(tableHTML) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message');
    messageDiv.innerHTML = `<strong>BOT:</strong><br>${tableHTML}`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Update Conversation List
function updateConversationList() {
    conversationList.innerHTML = "";
    conversations.forEach((conv, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `Conversation ${index + 1}`;
        listItem.addEventListener("click", () => loadConversation(index));
        conversationList.appendChild(listItem);
    });
}

// Load Previous Conversation
function loadConversation(index) {
    chatBox.innerHTML = "";
    conversations[index].forEach(msg => {
        if (msg.text.includes("<table")) {
            appendTable(msg.text);
        } else {
            appendMessage(msg.sender, msg.text);
        }
    });
    currentConversation = conversations[index];
}

// Start a New Conversation
function startNewConversation() {
    if (currentConversation.length) {
        conversations.push(currentConversation);
        localStorage.setItem("conversations", JSON.stringify(conversations));
        updateConversationList();
    }
    chatBox.innerHTML = "";
    currentConversation = [];
    conversationStarted = false;
}

// Clear Conversation History
function clearConversationHistory() {
    conversations = [];
    localStorage.removeItem("conversations");
    updateConversationList();
    chatBox.innerHTML = "";
    currentConversation = [];
    conversationStarted = false;
}

// Convert JSON to an HTML Table
function generateTable(data) {
    if (!data || data.length === 0) return "<p>No data available.</p>";

    let table = "<table border='1' style='border-collapse: collapse; width: 100%; text-align: left;'>";
    table += "<tr style='background-color: #f2f2f2;'>";

    // Table Headers
    for (let key in data[0]) {
        table += `<th style='padding: 8px; border: 1px solid #ddd;'>${key.replace("_", " ")}</th>`;
    }
    table += "</tr>";

    // Table Rows
    data.forEach(row => {
        table += "<tr>";
        for (let key in row) {
            table += `<td style='padding: 8px; border: 1px solid #ddd;'>${row[key]}</td>`;
        }
        table += "</tr>";
    });

    table += "</table>";
    return table;
}
