# Import Required Libraries
import psycopg2 # PostgreSQL database adapter for Python
from prettytable import PrettyTable
from backend.LLM_Model import generate_sql_query # Import the function from LLM_Model.py in Deployment
# from LLM_Model import generate_sql_query         # Use only for Testing in Localhost
import os
#from dotenv import load_dotenv    # Use only for Testing in Localhost
#load_dotenv()                     # Use only for Testing in Localhost


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
            columns = [desc[0] for desc in cursor.description] # Get column names
            data = [dict(zip(columns, row)) for row in results] # Convert to list of dictionaries (JSON)
            return {"response": data}  # Return as JSON response
            # return "\n".join(str(row) for row in results)
    
    except psycopg2.Error as e:
        conn.close()
        return f"Database error: {e}"

def process_query(user_input):
    """Processes user input and returns a chatbot response."""
    query = generate_sql_query(user_input)
    if query:
        return execute_query(query)
    return "Sorry, I didn't understand your request. Please try again with a valid question."
