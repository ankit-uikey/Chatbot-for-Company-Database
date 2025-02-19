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

modeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});

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

function sendMessage() {
    const message = userInput.value.trim();
    if (message !== '') {
        appendMessage('User', message);
        currentConversation.push({ sender: 'User', text: message });
        fetchBotResponse(message);
        userInput.value = '';
    }
}

function appendMessage(sender, message) {
    const p = document.createElement('p');
    p.textContent = `${sender}: ${message}`;
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function fetchBotResponse(message) {
    fetch("https://striped-selia-ankituikey-f30b92bb.koyeb.app/chat", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message })  // Dynamically send user message
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data && data.response) {
            // Display formatted table inside <pre> tag
            const tableHTML = generateTable(data.response); // Convert JSON to Table
            appendMessage("BOT", tableHTML); // Append table to chat box
            // currentConversation.push({ sender: 'BOT', text: `<pre>${data.response}</pre>` });
        } else {
            appendMessage("BOT", "⚠️ Unexpected response format.");
        }
    })
    .catch(error => {
        console.error("Error fetching Data & Response:", error);
        appendMessage("BOT", "❌ Error fetching response. Please try again.");
    });
}


function updateConversationList() {
    conversationList.innerHTML = "";
    conversations.forEach((conv, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `Conversation ${index + 1}`;
        listItem.addEventListener("click", () => loadConversation(index));
        conversationList.appendChild(listItem);
    });
}

function loadConversation(index) {
    chatBox.innerHTML = "";
    conversations[index].forEach(msg => appendMessage(msg.sender, msg.text));
    currentConversation = conversations[index];
}

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

function clearConversationHistory() {
    conversations = [];
    localStorage.removeItem("conversations");
    updateConversationList();
    chatBox.innerHTML = "";
    currentConversation = [];
    conversationStarted = false;
} 

// Function to Convert JSON to an HTML Table
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