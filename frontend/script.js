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
let introMessage;

// Toggle Dark Mode
modeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});

// Handle User Input & Send Message
sendButton.addEventListener('click', () => {
    removeIntroMessage();  // Remove Intro Message When User Clicks Send Button
    sendMessage();
});
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        removeIntroMessage(); // Remove intro message on first user input
        sendMessage();
    }
    if (!conversationStarted && chatBox.innerHTML.trim() === "") {
        startNewConversation();
        conversationStarted = true;
    }
});

// Function to Show Intro Message
function showIntroMessage() {
    chatBox.innerHTML = ""; // Clear previous chats on refresh
    introMessage = document.createElement('div');
    introMessage.classList.add('intro-message');
    introMessage.innerHTML = `
        <p> Welcome! </p> 
        <p> Ask me anything about the company database.</p>
        <p> Simply, write your question in simple english language & bot will return your answer.</p>
        <p> Example: "Show all employees in Sales department."</p>
        <p> Example: "Show count of all the employees who joined in 2020."</p>
    `;
    chatBox.appendChild(introMessage);
}
// Function to Remove Intro Message
function removeIntroMessage() {
    if (introMessage) {
        introMessage.remove();
        introMessage = null;
    }
}

// Sidebar Toggle
document.addEventListener('DOMContentLoaded', function () {
    showIntroMessage(); // Show intro message on page load
    const chatContainer = document.querySelector('.chat-container');
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sidebarIcon = sidebarToggle.querySelector('i'); // Get the icon inside the button
    updateConversationList();

    // Sidebar Toggle Button
    sidebarToggle.addEventListener('click', function () {
        sidebar.classList.toggle('collapsed');
        adjustChatContainer();
    });

    newConversationBtn.addEventListener('click', startNewConversation); // New Conversation Button
    clearHistoryBtn.addEventListener('click', clearConversationHistory); // Clear History Button

    // Auto-collapse sidebar when clicking outside it
    document.addEventListener('click', function (event) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnSidebarToggle = sidebarToggle.contains(event.target);
        const isClickInsideChatArea = chatContainer.contains(event.target) || userInput.contains(event.target);

        if (!isClickInsideSidebar && !isClickOnSidebarToggle && isClickInsideChatArea) {
            collapseSidebar();
        }
    });
    updateSidebarIcon(); // Initial icon setup
});

// Function to collapse the sidebar
function collapseSidebar() {
    if (!sidebar.classList.contains('collapsed')) {
        sidebar.classList.add('collapsed');
        adjustChatContainer();
    }
}

// Function to adjust chat container width when sidebar opens/closes
function adjustChatContainer() {
    const chatContainer = document.querySelector('.chat-container');
    const sidebarIcon = sidebarToggle.querySelector('i');
    if (sidebar.classList.contains('collapsed')) {
        chatContainer.style.width = '96%';
        chatContainer.style.marginLeft = '3%';
        sidebarIcon.classList.remove('fa-chevron-left');
        sidebarIcon.classList.add('fa-chevron-right');
    } else {
        chatContainer.style.width = 'calc(100% - 300px)';
        chatContainer.style.marginLeft = '300px';
        sidebarIcon.classList.remove('fa-chevron-right');
        sidebarIcon.classList.add('fa-chevron-left');
    }
}

// Function to update the sidebar icon when toggled
function updateSidebarIcon() {
    const sidebarIcon = sidebarToggle.querySelector('i');
    if (sidebar.classList.contains('collapsed')) {
        sidebarIcon.classList.remove('fa-chevron-left');
        sidebarIcon.classList.add('fa-chevron-right');
    } else {
        sidebarIcon.classList.remove('fa-chevron-right');
        sidebarIcon.classList.add('fa-chevron-left');
    }
}

// Send Message & Get Response
function sendMessage() {
    const message = userInput.value.trim();
    if (message !== '') {
        appendMessage('User', message);
        currentConversation.push({ sender: 'User', text: message });
        
        // Append Searching... loader inside the chat area
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading';
        loadingDiv.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Searching...`;
        chatBox.appendChild(loadingDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        
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
    // fetch("http://127.0.0.1:8000/chat", {          // Use this URL for local development/Testing
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
        removeLoader(); // Remove Searching... loader
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
        removeLoader(); // Hide loader on error
        console.error("Error fetching Data & Response:", error);
        appendMessage("BOT", "❌ Error fetching response. Please try again.");
        currentConversation.push({ sender: "BOT", text: "❌ Error fetching response. Please try again." }); // Save error message in history
    });
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

function removeLoader() {
    const loader = document.getElementById('loading');
    if (loader) {
        loader.remove();
    }
}