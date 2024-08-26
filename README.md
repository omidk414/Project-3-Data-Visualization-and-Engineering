# Olympic Games Data Analysis and Visualization Project

## Project Overview

This project aims to explore and analyze the modern-day Olympic Games dataset, covering events from 1896 to 2020. The goal is to identify trends, analyze medal distributions, and understand athlete characteristics across different Olympic Games.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Database and ETL Process](#database-and-etl-process)
3. [Visualizations](#visualizations)
4. [Usability](#usability)
5. [Ethical Considerations](#ethical-considerations)
6. [Analysis](#analysis)
7. [Collaborators](#collaborators)
8. [References](#references)

## Getting Started

To get started with this project, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/yourproject.git
   cd directory
   ```
2. **Install Dependencies**:
   Ensure you have Python and PostgreSQL installed. Install the necessary libraries using the following commands:
   
   - `flask`: Web framework for building the web application.
   - `sqlalchemy`: SQL toolkit and Object-Relational Mapping (ORM) library for database interaction.
   - `psycopg2-binary`: PostgreSQL adapter for Python, used by SQLAlchemy to connect to the PostgreSQL database.
   - `dotenv`: Library to load environment variables from a `.env` file.
   - `altair`: Declarative statistical visualization library for creating charts and plots.

3. **Setup the PostgreSQL Database**
- Create a PostgreSQL database and load the provided data into it.
     - olympics_medals: Stores information about medal winners, including country, year, and medal type.
     - countries: Contains data about countries, including names and geographic coordinates.

- Set up the .env file with your database credentials:
   ```bash
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   ```   
4. **Run the Flask Applications**:
    
   Start the Flask application for the **Choropleth Map** by running:
   ```bash
   python app.py 
   ```
   Start the Flask application for the **Bubble Chart** by running:
   ```bash
   python bub_app.py
   ```
   Visit http://localhost:5000 in your web browser to view the application.

## Database and ETL Process
1. **Database and ETL Process**
   - Database Used: PostgreSQL
   - Reason for Choice: PostgreSQL was selected due to familiarity and hands-on experience. It provides robust features, scalability, and support for complex queries such as mapping the different country names throughout different time periods (e.g. Russian Empire/Soviet Union to Russia).

2. **Database Design**
   The database consists of two main tables using the Summer_olympic_Medals.xls and World_lat_lon.csv files:
   - olympics_medals: Stores information about medal winners, including country, year, and medal type.
   - countries: Contains data about countries, including names and geographic coordinates.
- **`olympics_medals`**: This table holds detailed records of medal winners in each Olympic event. It includes columns for:
  - `id`: Unique identifier for each medal record.
  - `country_name`: Name of the country that won the medal.
  - `year`: Year of the Olympic Games.
  - `gold`: Number of gold medals won.
  - `silver`: Number of silver medals won.
  - `bronze`: Number of bronze medals won.

- **`countries`**: This table contains information about each country, which helps in geospatial visualization and data analysis. It includes columns for:
  - `country_name`: Official name of the country.
  - `latitude`: Geographical latitude of the country’s centroid.
  - `longitude`: Geographical longitude of the country’s centroid.
  - `dd`: Decimal degrees representation of coordinates.
  - `dms`: Degrees, minutes, seconds representation of coordinates.
  - `ddm`: Degrees and decimal minutes representation of coordinates.
 
- **`world population`**: This table contains population data for each country, which is essential for demographic analysis and data analysis. It includes columns for:
  - `country`: Official name of the country.
  - `total_population`: The total population of the country for the specified year.
  - `year`: The year for which the population data is recorded.
 
- **`world gdp`**: This table contains information about each country, which helps in geospatial visualization and data analysis. It includes columns for:
  - `country`: Official name of the country.
  - `year`: The year for which the population data is recorded.
  - `gdp`: The Gross Domestic Product (GDP) of the country for the specified year, typically measured in current U.S. dollars.

ERD: ![ERD](https://github.com/omidk414/Project-3-Data-Visualization-and-Engineering/blob/main/images/ERD.png)

3. **ETL Workflow**
   - Extraction: Data is extracted from raw sources.
   - Transformation: Data is cleaned and transformed to match the database schema, including standardizing country names and ensuring consistent year formats.
   - Loading: Transformed data is loaded into PostgreSQL.

## Visualizations
The project includes several visualizations to present the Olympic data:

1. **Total Medals by Country and Year**:
```python
# Create a selection dropdown for the year
year_selection = alt.selection_point(
    fields=['year'],  # Match the column name in the DataFrame
    bind=alt.binding_select(options=sorted(medal_data['year'].unique().tolist()), name='Select Year: ')
)

# Create the bar chart with a year selector
yearly_medal_chart = alt.Chart(medal_data).mark_bar().encode(
    x=alt.X('country_name:N', title='Country'),
    y=alt.Y('total_medals:Q', title='Total Medals'),
    color=alt.Color('country_name:N', legend=None),
    tooltip=['year:O', 'country_name:N', 'gold:Q', 'silver:Q', 'bronze:Q', 'total_medals:Q']
).transform_filter(
    year_selection
).properties(
    title='Total Medals by Country and Year'
).add_params(
    year_selection
)

yearly_medal_chart.show()
```
![Chart](https://github.com/omidk414/Project-3-Data-Visualization-and-Engineering/blob/main/images/Total_Medals_Chart.png)

2. **Top 10 Countries by Medal Count**:
```python
bar_chart = alt.Chart(medal_counts_melted).mark_bar().encode(
    x=alt.X('country_name:N', sort='-y'),
    y=alt.Y('Count:Q'),
    color=alt.Color('Medal:N'),
    tooltip=['country_name', 'Medal', 'Count']
).properties(
    title='Top 10 Countries by Medal Count'
)

bar_chart.show()
```
![Chart2](https://github.com/omidk414/Project-3-Data-Visualization-and-Engineering/blob/main/images/Top_10_Countries_Chart.png)

3. **Choropleth Map**:
```python
   # Flask Route to Fetch Choropleth Data
@app.route('/data/choropleth/<int:year>', methods=['GET'])
def get_choropleth_data(year):
    query = text("""
        SELECT c.country_name, c.latitude, c.longitude, 
               COALESCE(m.gold, 0) AS Gold, 
               COALESCE(m.silver, 0) AS Silver, 
               COALESCE(m.bronze, 0) AS Bronze
        FROM countries c
        LEFT JOIN (
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
    """)
    with engine.connect() as conn:
        result = conn.execute(query, {"year": year})
        data = [dict(row._mapping) for row in result]
    return jsonify(data)
```
![Chart3](https://github.com/omidk414/Project-3-Data-Visualization-and-Engineering/blob/main/images/Chloropleth_Flask_Image.png)

4. Bubble Chart

`Grouping Countries` into regions or meaningful categories, we can uncover regional trends and make more insightful comparisons. This approach helps us manage large datasets effectively, focusing on broader patterns rather than isolated country data.

`Normalizing Data` ensures that the data we visualize is on a comparable scale, allowing for fair comparisons across countries. By bringing different metrics into a consistent range, we enhance the clarity and accuracy of our analysis, making it easier to identify relative differences and trends in the bubble chart.

```python


    # Query for GDP data for all countries
    gdp_query = """
        SELECT country, year, gdp
        FROM world_gdp
    """
    gdp_data = pd.read_sql(gdp_query, engine)
    
    # Query for Population data for all countries
    population_query = """
        SELECT name AS country, year, total_population
        FROM world_population
    """
    population_data = pd.read_sql(population_query, engine)

    # Query for Olympic Medals data for all countries
    medal_counts_query = """
        SELECT country_name AS country, year, SUM(Gold + Silver + Bronze) AS total_medals
        FROM olympic_medals
        GROUP BY country_name, year
    """
    medals_data = pd.read_sql(medal_counts_query, engine)
   
    # Aggregate the data for grouped regions
    gdp_data = gdp_data.groupby(['country', 'year']).sum().reset_index()
    population_data = population_data.groupby(['country', 'year']).sum().reset_index()
    medals_data = medals_data.groupby(['country', 'year']).sum().reset_index()
    # Pivot the DataFrame to get the desired structure
    bubble_chart_data = combined_data.pivot_table(index=['country', 'year'], columns='Indicator', values='Value').reset_index()

    # Convert DataFrame to JSON for use in the frontend
    data_json = bubble_chart_data.to_json(orient='records')

    return render_template('bub_index.html', data=data_json)
```
![Chart4]()


## Usability
The project features several interactive elements to enhance user experience:

- **Interactive Maps**: Users can view and explore Olympic medal distributions by country and year. The map updates dynamically based on the selected year.
- **Dynamic Charts**: Users can interact with various charts, such as selecting different years or viewing medal counts for specific countries. This interaction is facilitated through dropdowns, sliders, and input boxes.
- **Responsive Design**: The user interface is designed to be responsive, ensuring that it works well on both desktop and mobile devices.
- **Year Slider and Input Box**: Allows users to select a year from 1896 to 2020 and see the corresponding medal data on the map and charts.

## Ethical Considerations

In this project, several ethical considerations were taken into account to ensure the responsible use of data:

1. **Data Privacy**:
   - **Personal Information**: We have ensured that no personally identifiable information (PII) is included in the dataset. The data used focuses solely on aggregate statistics about Olympic performances and does not disclose individual athletes' personal details.

2. **Data Representation**:
   - **Fairness**: The project aims to present data in a manner that fairly represents the performance of all participating countries. Efforts were made to ensure that visualizations and analyses are unbiased and do not favor any particular country or region.
   - **Historical Accuracy**: When dealing with historical data, efforts were made to accurately reflect the historical context of each Olympic Games, including the proper representation of countries that may have changed names or political status over time.

3. **Transparency**:
   - **Methodology**: The methodology used for data extraction, transformation, and analysis is documented and transparent. This includes details on how data was cleaned, standardized, and processed to ensure its accuracy and reliability.
   - **Source Attribution**: Data sources and external code used in the project are clearly cited, providing transparency about the origins and reliability of the data and tools used.

4. **Bias Mitigation**:
   - **Inclusivity**: The project includes a wide range of countries and Olympic events to provide a comprehensive view of the data. This helps in avoiding skewed analysis that might arise from focusing only on certain regions or periods.

## Analysis
We explored various factors that could potentially influence a country's medal count, such as GDP, population, and even the advantages of hosting the Olympics. In our analysis, we identified notable trends for countries like the United States, China, and India. Although both China and India have large populations and significant wealth, China consistently wins more medals, suggesting that population and wealth alone are not decisive factors. This observation led us to reconsider our initial hypothesis regarding the impact of these factors on Olympic success.

We also hypothesized that the United States may have a stronger support system for sports, including more after-school programs, greater parental involvement, and nation wide competitions. Whereas, India might lack similar focus and infrastructure. Cultural preferences for certain sports, such as cricket in India, hockey in Canada, or table tennis in China, can influence the allocation of funding and resources.

Our research also revealed how historical and political contexts, such as the Cold War, significantly impacted international competitions and Olympic outcomes. Overall, this analysis deepened our understanding of the complex interplay between socio-economic, cultural, and political factors in shaping Olympic success.


### Collaborators
Omid Khan - omidk414@gmail.com - omidk414\
Evan Wall - ewall@escoffier.edu - Ewall24\
Grant Itow - grant@owlvericks.com - grant-i 

## References
This section provides attribution to the data sources, libraries, and tools that contributed to the successful implementation and documentation of the project.
- **Data Sources**:
  - [125 Years of Summer Olympics Analysis & Visualization](https://www.kaggle.com/datasets/ramontanoeiro/summer-olympic-medals-1986-2020?select=Summer_olympic_Medals.csv) – This dataset provides detailed information about Olympic performances and medals over the years, which is utilized for the project analysis and visualizations.
  - [World Lat/Lon](http://www.geocountries.com/country/geolocation#google_vignette) - This dataset provides the list of Latitude, Longitude and GPS Coordinates of all Countries.
  - [GDP of Countries](https://www.kaggle.com/datasets/jonscheaffer/worldwide-gdp-history-19602016) - This dataset provides a list of the GDP of every country up to 2022.
  - [World Population](https://www.census.gov/data-tools/demo/idb/#/table?COUNTRY_YEAR=2024&COUNTRY_YR_ANIM=2024&menu=tableViz&TABLE_YEARS=1950,1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029&TABLE_USE_RANGE=Y&TABLE_USE_YEARS=N&TABLE_STEP=1&TABLE_RANGE=1950,2029) - This dataset provides the world population estimates and predictions.

- **External Libraries**:
  - [Flask Documentation](https://flask.palletsprojects.com/) – Official documentation for Flask, the web framework used for building the application.
  - [SQLAlchemy Documentation](https://docs.sqlalchemy.org/en/14/) – Documentation for SQLAlchemy, used for database interaction.
  - [Psycopg2 Documentation](https://www.psycopg.org/docs/) – Documentation for psycopg2, the PostgreSQL adapter used for connecting to the database.
  - [python-dotenv Documentation](https://pypi.org/project/python-dotenv/) – Documentation for python-dotenv, used for managing environment variables.
  - [Altair Documentation](https://altair-viz.github.io/) – Documentation for Altair, the library used for creating interactive visualizations.

- **External Code and Tools**:
  - [GPT (Generative Pre-trained Transformer) by OpenAI](https://openai.com/research) – Utilized as a source of guidance and assistance in project development and documentation.



