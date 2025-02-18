# Import Required Libraries
import psycopg2 # PostgreSQL database adapter for Python
from backend.LLM_Model import generate_sql_query
import re
import os

def extract_date(user_input):
    """Extracts date from user input (YYYY-MM-DD format)."""
    match = re.search(r"\d{4}-\d{2}-\d{2}", user_input)
    return match.group(0) if match else None

def execute_query(query):
    """Executes the SQL query on the PostgreSQL Server database."""
    # Connecting to database server
    timeout = 2 # Set timeout to 2 seconds
    conn = psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PWD"), # Remove in Deployment or Push
        host=os.getenv("DB_HOST"), # e.g., "localhost" or an IP address
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
            return "\n".join(str(row) for row in results)    
        
    except psycopg2.Error as e:
        conn.close()
        return f"Database error: {e}"

def process_query(user_input):
    """Processes user input and returns a chatbot response."""
    query = generate_sql_query(user_input)
    if query:
        return execute_query(query)
    return "Sorry, I didn't understand your request. Please try again with a valid question."
