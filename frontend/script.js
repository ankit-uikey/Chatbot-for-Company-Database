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
    // fetch("http://127.0.0.1:8000/chat", {          // Use this URL for local development
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
            let botResponse = `<pre>${data.response}</pre>`;
            appendMessage("BOT", botResponse);
            currentConversation.push({ sender: "BOT", text: botResponse }); // Store bot response in current conversation history
            
        } else {
            appendMessage("BOT", "⚠️ Unexpected response format.");
            currentConversation.push({ sender: "BOT", text: "⚠️ Unexpected response format." }); // Save error message in history
        }
    })
    .catch(error => {
        console.error("Error fetching Data & Response:", error);
        appendMessage("BOT", "❌ Error fetching response. Please try again.");
        currentConversation.push({ sender: "BOT", text: "❌ Error fetching response. Please try again." }); // Save error message in history
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

document.getElementById('schema-btn').addEventListener('click', () => {
    document.getElementById('popup').style.display = 'flex';
});

// Close popup when clicking outside the image
document.getElementById('popup').addEventListener('click', (e) => {
    if (e.target === document.getElementById('popup')) {
        document.getElementById('popup').style.display = 'none';
    }
});

