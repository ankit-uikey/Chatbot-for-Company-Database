# Chatbot for Company Database 
**App URL:** https://striped-selia-ankituikey-f30b92bb.koyeb.app/

Developed by **Ankit Uikey**

------------
## 📌 Overview
This is an AI-powered chatbot that allows users to interact with a company database using natural language queries. It converts user questions into SQL queries and fetches relevant information from the database.

Additionally, it can handle generic queries such as greetings, bot capabilities, and small talk.

## ⚡ Features
**✅ Natural Language to SQL Conversion –** Users can ask questions in plain English, and the chatbot will generate SQL queries and return actual query results from the database.
**✅ Generic Query Handling –** Responds to greetings, jokes, and general inquiries.
**✅ Smooth UI/UX –** Displays a "Searching..." icon while processing the query.
**✅ Dark Mode Support –** Changes text colors dynamically.
**✅ Dynamic Sidebar –** Auto-collapses when clicking outside and toggles icons smoothly.
**✅ Schema Popup –** Opens a popup containing Table Schema Image, with functionality of auto close when clicked outside image.

## 🔧 Technologies Used
- **💬 AI Model:** Google Gemma 2B IT (via Hugging Face API)
- **🖥️ Frontend: **HTML, CSS, JavaScript
- **🛠️ Backend:** Python (FastAPI)
- **💾 Database:** PostgreSQL (via Koyeb)
- **☁️ Deployment:** Koyeb / Hugging Face Inference API

## 📌 How It Works
**1️⃣ User Input:** The user enters a question (e.g., "Show all employees in the HR department").

**2️⃣ Query Processing:**
- If the input is a general query (e.g., "Hi", "What can you do?"), the chatbot returns a predefined or AI-generated response.
- If the input is an SQL-related query, the chatbot:
	- Generates an SQL query based on the company database schema.
	- Returns the structured query that can be executed on the database.

**3️⃣ Response Display:** The chatbot shows either a text response of general queries or a table output response of a SQL related query.

## 📝 Example Queries & Responses
**🟢 Generic Queries:**
- "hi"
- "who are you?"
- "tell me a joke", etc.

**🟢 Database Query Generation:**
- "Show all employees in HR."
- "List employees who report to John Doe.", etc.

## 🚀 Future Enhancements
- Improve AI model to better handle conversational queries.
- Implement database execution to return actual query results.
- Add support for multiple databases (MySQL, MongoDB, etc.).
- Enhance UI/UX with animations and user history generation.

## 🤝 Contributing
Contributions are welcome! Feel free to:
- Open an Issue for bugs & feature requests.
- Submit a Pull Request with improvements.

## 📄 License
This project is licensed under the MIT License.

## 🌟 Show Your Support
⭐ Star this repo if you find it useful!

🐦 Follow me on GitHub for more cool projects!

