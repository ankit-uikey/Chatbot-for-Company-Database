import requests
import os
#from dotenv import load_dotenv    # Use only for Testing in Localhost
#load_dotenv()                     # Use only for Testing in Localhost

# Loading Hugging Face Model & API key securely from environment variable
API_KEY = os.getenv("DB_HuggingFace_Key")
if not API_KEY:
    raise ValueError("❌ API Key not found. Set 'DB_Key' as an environment variable.")

# Hugging Face Model API
API_URL = "https://api-inference.huggingface.co/models/google/gemma-2-2b-it"  # Using Google Gemma model
HEADERS = {"Authorization": f"Bearer {API_KEY}"} # Remove in Deployment or Push


# Database Schema
db_schema = """
CREATE TABLE Employees (
    Emp_ID INTEGER PRIMARY KEY,
    First_Name TEXT NOT NULL,
    Last_Name TEXT NOT NULL,
    Gender TEXT NOT NULL,
    Start_Date TEXT NOT NULL,
    Years_of_Exp INTEGER NOT NULL,
    Department TEXT NOT NULL,
    Country TEXT NOT NULL,
    Region TEXT NOT NULL,
    Monthly_Salary INTEGER NOT NULL,
    Annual_Salary INTEGER NOT NULL,
    Performance_Rating TEXT NOT NULL,
    Sick_Leaves INTEGER NOT NULL,
    Unpaid_Leaves INTEGER NOT NULL,
    Overtime_Hours INTEGER NOT NULL
);

CREATE TABLE Manager (
    Emp_ID INTEGER PRIMARY KEY,
    Department TEXT NOT NULL,
    First_Name TEXT NOT NULL,
    Last_Name TEXT NOT NULL
);
"""

# Converts a natural language question into an SQL query based on the database schema.
# Construct the prompt dynamically
def generate_sql_query(natural_language_question):
    prompt = f"""
    # Task
    Generate an optimized SQL query to answer the following question: "{natural_language_question}"

    ### PostgreSQL Database Schema
    The query will run on a database with the following schema:
    {db_schema}

    # SQL
    Here is the SQL query that answers the question: "{natural_language_question}"
    ```sql
    """

    payload = {"inputs": prompt}
    response = requests.post(API_URL, headers=HEADERS, json=payload)

    if response.status_code == 200:
        result = response.json()
        sql_query = result[0]["generated_text"] if isinstance(result, list) else result.get("generated_text", "")
        sql_query =  sql_query.split("```sql")[-1].strip()
        sql_query = sql_query.split("```")[0].strip()  # Removes closing ``` if present
        return sql_query
    else:
        return f"Error: {response.status_code}, {response.text}"

# Use for Testing Query Generation Manually
#user_question = "Show all the employees whos mangager is John Doe."
#sql_output = generate_sql_query(user_question)
#print(sql_output)
