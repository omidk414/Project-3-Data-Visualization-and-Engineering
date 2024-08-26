from flask import Flask, jsonify, render_template
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

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
    query = text("""
        SELECT c.country_name, c.latitude, c.longitude, 
               COALESCE(m.gold, 0) AS Gold, 
               COALESCE(m.silver, 0) AS Silver, 
               COALESCE(m.bronze, 0) AS Bronze, 
               (COALESCE(m.gold, 0) + COALESCE(m.silver, 0) + COALESCE(m.bronze, 0)) AS Total_Medals,
               CASE 
                   WHEN c.country_name = m.host_country THEN 'true'
                   ELSE 'false'
               END AS host_country
        FROM countries c
        INNER JOIN (
            SELECT 
                CASE
                    WHEN country_name = 'United States' THEN 'United States Of America'
                    WHEN country_name = 'Republic of China' THEN 'China'
                    WHEN country_name = 'Soviet Union' THEN 'Russia'
                    WHEN country_name = 'Russian Empire' THEN 'Russia'
                    WHEN country_name = 'Ukrain' THEN 'Ukraine'
                    WHEN country_name = 'Great Britain' THEN 'United Kingdom'
                    WHEN country_name = 'Czechoslovakia' THEN 'Czech Republic'
                    WHEN country_name = 'Korea' THEN 'South Korea'
                    WHEN country_name = 'West Germany' THEN 'Germany'
                    WHEN country_name = 'Australia/Sweden' THEN 'Australia'
                    ELSE country_name
                END AS country_name,
                SUM(gold) AS gold, 
                SUM(silver) AS silver, 
                SUM(bronze) AS bronze,
                CASE
                    WHEN host_country = 'United States' THEN 'United States Of America'
                    WHEN host_country = 'Republic of China' THEN 'China'
                    WHEN host_country = 'Soviet Union' THEN 'Russia'
                    WHEN host_country = 'Russian Empire' THEN 'Russia'
                    WHEN host_country = 'Ukrain' THEN 'Ukraine'
                    WHEN host_country = 'Great Britain' THEN 'United Kingdom'
                    WHEN host_country = 'Czechoslovakia' THEN 'Czech Republic'
                    WHEN host_country = 'Korea' THEN 'South Korea'
                    WHEN host_country = 'West Germany' THEN 'Germany'
                    WHEN host_country = 'Australia/Sweden' THEN 'Australia'
                    ELSE host_country
                END AS host_country
            FROM olympic_medals
            WHERE year = :year
            GROUP BY host_country, country_name
        ) m ON c.country_name = m.country_name
        WHERE m.gold > 0 OR m.silver > 0 OR m.bronze > 0
        GROUP BY c.country_name, c.latitude, c.longitude, Gold, Silver, Bronze, host_country
    """)
    
    with engine.connect() as conn:
        result = conn.execute(query, {"year": year})
        medal_data = [dict(row._mapping) for row in result]

    return jsonify(medal_data)

if __name__ == '__main__':
    app.run(debug=True)
