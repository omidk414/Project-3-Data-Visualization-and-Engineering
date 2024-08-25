# Project-3-Data-Visualization-and-Engineering

## Table of Contents
1. [Project Overview](#project-overview)
2. [Data and Delivery](#data-and-delivery)
   - [Dataset](#dataset)
   - [Database](#database)
3. [Ethical Considerations](#ethical-considerations)
4. [References](#references)
5. [Visualizations](#visualizations)
6. [Usability](#usability)
7. [Data Engineering Track](#data-engineering-track)
8. [Getting Started](#getting-started)

## Project Overview

This project aims to explore and analyze the modern-day Olympic Games dataset, covering events from 1896 to 2020. The goal is to identify trends, analyze medal distributions, and understand athlete characteristics across different Olympic Games.

## Data and Delivery

### Dataset

- **Number of Records**: This project uses a dataset with over 271,000 unique records.
- **Data Source**: The dataset is sourced from historical Olympic records and includes detailed information on athletes and their performances.
- **Database Used**: The data is housed in a PostgreSQL database.

### Database

- **Design**: The database includes at least two tables:
  - `olympics_medals`: Stores information about medal winners, including country, year, and medal type.
  - `countries`: Contains data about countries, including their names, geographic coordinates, and other relevant information.
- **ETL Workflow**: Data is extracted from raw sources, transformed to match the database schema, and loaded into PostgreSQL. The ETL process is designed to ensure data consistency and quality.
- **Database Choice**: PostgreSQL was selected for its robustness, scalability, and support for complex queries, making it suitable for handling the large dataset and facilitating analytical queries.

## Ethical Considerations

We have made the following ethical considerations in this project:

- Ensured data privacy by not including personally identifiable information.
- Avoided bias by presenting data from a wide range of countries and ensuring fair representation in visualizations.

## References

- **Data Sources**: 
  - Historical Olympic Games records from public sports databases.
- **External Code**:
  - Flask: [Flask Documentation](https://flask.palletsprojects.com/)
  - Altair: [Altair Documentation](https://altair-viz.github.io/)

## Visualizations
<details> <summary>Click to expand Visualization Details</summary>

### Views

The project includes at least three unique visualizations:

1. **Medal Distribution Choropleth Map**: An interactive map showing the distribution of medals by country and year.
2. **Medal Count Over Time**: A line chart depicting the number of medals won by countries over different Olympic Games.
3. **Athlete Demographics**: A bar chart showcasing the demographics of athletes, including gender and country representation.

### Presentation

- **Clarity**: The visualizations are designed to be clear and digestible, making it easy for users to understand trends and patterns.
- **Interpretability**: The data story is crafted to be easily interpretable, catering to users of all levels, from casual viewers to data experts.

</details>

## Usability
<details> <summary>Click to expand Usability Details</summary>

### Running the Project

- **Execution**: The Flask app runs without errors. To run the project locally:
  - Ensure you have Python and PostgreSQL installed.
  - Use the provided `requirements.txt` to install dependencies.

### Libraries

- **Additional Libraries**: The project uses Altair for visualization, Flask for web application development, and SQLAlchemy for database interaction.

### User Interaction

- **Features**: The project includes interactive maps and charts. Users can filter data dynamically using dropdown menus to explore different years and medal types.

</details>

## Data Engineering Track
<details> <summary>Click to expand Data Engineering Details</summary>

### Database Design

- **ETL Workflows**: Data is extracted from raw files, transformed to align with the database schema, and loaded into PostgreSQL.
- **Data Transformation**: The dataset was cleaned and transformed to standardize country names, ensure consistent year formats, and categorize medal types.
- **Database**: PostgreSQL
- **Tables/Collections**: The database has the following tables:
  - `olympics_medals`
  - `countries`
- **Documentation**: Detailed documentation of the ETL workflow and database design is provided in the project's repository.

### Data and Delivery

- **Record Count**: The database contains over 271,000 unique records.
- **Data Reading**: Data can be read and displayed using Pandas DataFrames, with options to query through a Flask API.

</details>

## Getting Started

1. **Clone the Repository**: 
   ```bash
   git clone https://github.com/yourusername/yourproject.git
