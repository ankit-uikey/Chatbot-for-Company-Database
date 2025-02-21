# Import Required Libraries
import psycopg2 # PostgreSQL database adapter for Python
from datetime import datetime
from prettytable import PrettyTable
from backend.LLM_Model import generate_sql_query # Import the function from LLM_Model.py in Deployment
# from LLM_Model import generate_sql_query         # Use only for Testing in Localhost
import os
# from dotenv import load_dotenv    # Use only for Testing in Localhost
# load_dotenv()                     # Use only for Testing in Localhost

# Predefined Generic Responses for faster execution
GENERIC_RESPONSES = {
    "hi": "Hello! How can I assist you today?",
    "hello": "Hi there! How can I help you?",
    "hey": "Hey! Need any help regarding companys data?",
    "good morning": "Good day to you! How can I help?",
    "good afternoon": "Good day to you! How can I help?", 
    "good evening": "Good day to you! How can I help?",
    "what's up?" : "Not much! Just here to assist with Companys Data & SQL queries. What do you need?",     
    "sup?": "Not much! Just here to assist with Companys Data & SQL queries. What do you need?",
    "how are you": "I'm just a bot, but I'm here to assist you!",
    "what can you do": "I can generate SQL queries based on natural language questions.",
    "who are you": "I'm an AI bot that helps with SQL queries. You can ask me about employees, managers, salaries, and more!",
    "how do you work":"I convert natural language questions into SQL queries based on your database schema.",
    "help": "You can ask me SQL-related questions like 'Show all employees in the Sales department.'",
    "how to use": "You can ask me SQL-related questions like 'Show all employees in the Sales department.'",
    "tell me a joke": "Why do SQL developers prefer dark mode? Because light attracts bugs! 😆",
    "what's the date today?": f"Today's date is {datetime.now().strftime('%Y-%m-%d')}",
    "what time is it": f"It's currently {datetime.now().strftime('%H:%M:%S')}.",
    "can you think":"I don't think like humans, but I can generate SQL queries!",
    "are you a human": "Nope, I'm just an AI, but I'm here to assist!",
    "what's your favorite programming language?": "SQL, of course! But I also like Python.",
    "how do I reset the chat": "Just refresh the page, and the chat will start fresh!",
    "give me an example": "Sure! Try asking: 'List all employees in the Sales department.'",
    "what is SQL":"SQL (Structured Query Language) is used to interact with databases.",
}

def execute_query(query):
    """Executes the SQL query on the PostgreSQL Server database."""
    # Connecting to database server
    timeout = 2 # Set timeout to 2 seconds
    conn = psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PWD"),
        host=os.getenv("DB_HOST"), 
        port="5432" # default is 5432
    )

    cursor = conn.cursor()
    print(f"\n Successfully connected to PostgreSQL Database \n")
    try:
        cursor.execute(query)
        results = cursor.fetchall()
        conn.close()
        
        # Printing the results of the query
        if not results:
            return "No matching records found."
        else:
            table = PrettyTable()
            table.field_names = [desc[0] for desc in cursor.description] # Get column names
            for row in results:
                table.add_row(row)

            # Convert to string format
            table_str = table.get_string()
            return table_str  # Returning as a string
            
            # return {"response": data}  # Return as JSON response
            # return "\n".join(str(row) for row in results)
    
    except psycopg2.Error as e:
        conn.close()
        return f"Database error: {e}"

"""Processes user input and returns a chatbot response."""
def process_query(user_input):
    user_input = user_input.strip()
    
    # Check if input matches predefined generic responses
    for key in GENERIC_RESPONSES:
        if key in user_input.lower():
            return GENERIC_RESPONSES[key]
    
    # Otherwise, treat it as an SQL query request
    query = generate_sql_query(user_input)
    if query:
        return execute_query(query)
    
    return "Sorry, I didn't understand your request. Please try again with a valid question."
