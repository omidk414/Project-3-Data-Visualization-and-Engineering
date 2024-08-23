from flask import Flask, render_template, jsonify
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
DATABASE_URL = os.getenv('DATABASE_URL')

# Create Flask app
app = Flask(__name__)

# Create a database connection
engine = create_engine(DATABASE_URL)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/data/countries')
def get_countries_data():
    # Read GeoJSON data
    # Make sure to replace this path with your actual GeoJSON file path
    with open('data/countries.geo.json') as f:
        geojson_data = f.read()
    return geojson_data

@app.route('/data/medal_data/<int:year>')
def get_medal_data(year):
    # Query to get medal data for the selected year
    query = """
        SELECT country_name AS Country_Name, SUM(gold) AS Gold, SUM(silver) AS Silver, SUM(bronze) AS Bronze,
               (SUM(gold) + SUM(silver) + SUM(bronze)) AS Total_Medals
        FROM olympic_medals
        WHERE year = %s
        GROUP BY country_name
    """
    with engine.connect() as conn:
        result = conn.execute(query, (year,))
        medal_data = [dict(row) for row in result]
    return jsonify(medal_data)

if __name__ == '__main__':
    app.run(debug=True)
