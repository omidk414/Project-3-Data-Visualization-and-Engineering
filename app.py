from flask import Flask, jsonify, render_template
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Create the database engine
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

# Route to render the main map page
@app.route('/')
def index():
    return render_template('index.html')

# Route to get medal data for a specific year
@app.route('/data/medal_data/<int:year>', methods=['GET'])
def get_medal_data(year):
    # Adjusted query to include only countries that participated in the Olympics for the selected year
    query = text("""
        SELECT c.country_name, c.latitude, c.longitude, 
               COALESCE(m.gold, 0) AS Gold, 
               COALESCE(m.silver, 0) AS Silver, 
               COALESCE(m.bronze, 0) AS Bronze, 
               (COALESCE(m.gold, 0) + COALESCE(m.silver, 0) + COALESCE(m.bronze, 0)) AS Total_Medals
        FROM countries c
        INNER JOIN (
            SELECT 
                CASE
                    WHEN country_name = 'United States' THEN 'United States Of America'
                    ELSE country_name
                END AS country_name,
                SUM(gold) AS gold, 
                SUM(silver) AS silver, 
                SUM(bronze) AS bronze
            FROM olympic_medals
            WHERE year = :year
            GROUP BY country_name
        ) m ON c.country_name = m.country_name
        WHERE m.gold > 0 OR m.silver > 0 OR m.bronze > 0  -- Ensure only countries with medals are shown
        GROUP BY c.country_name, c.latitude, c.longitude, Gold, Silver, Bronze
    """)
    
    with engine.connect() as conn:
        result = conn.execute(query, {"year": year})
        medal_data = [dict(row._mapping) for row in result]  # Use row._mapping to convert row to dict

    return jsonify(medal_data)

if __name__ == '__main__':
    app.run(debug=True)
