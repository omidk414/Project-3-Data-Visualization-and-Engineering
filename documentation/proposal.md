# Summer Olympic Games Data Exploration

## Project Overview

This project involves exploring a comprehensive dataset of the modern-day Olympic Games, covering events from 1896 to 2020. The dataset includes over 271,000 instances and 15 attributes, detailing individual athletes and their performances. The goal is to analyze this data, generate insights, and answer key questions about trends, medal distributions, and athlete characteristics across different Olympic Games.

## Project Team

The team of data scientists working on this project includes:
* Omid Khan
* Grant Itow
* Evan Wall

## Dataset Description

The dataset provides detailed information on Olympic competitors and their performances over a span of 120 years. Each instance in the dataset corresponds to a country and year competing in an Olympic event. The dataset contains the following key attributes:

- **Country**: The team or country the athlete represents
- **Year**: The year of the Olympic Games
- **Medal**: The medal the country won (Gold, Silver, Bronze, or NA if no medal)

## Goals

1. **Data Exploration and Preprocessing**: 
   - Explore the dataset to understand the structure and key characteristics.
   - Handle missing data and ensure data consistency for analysis.

2. **Question Development**:
   - Develop and explore key questions based on the dataset. Some example questions might include:
     - Which countries have won the most medals over time?
     - Does the number of medals correlate with other factors such as country characteristics?

3. **Insights and Reporting**:
   - Generate insights based on the data exploration.
   - Create visualizations to support the findings and provide a clear narrative of the trends observed.

## Procedure

1. **Data Exploration**:
   - Load the dataset and perform an initial exploration to understand the scope and limitations.
   - Analyze key variables like `Medal`, `Country`, and `Year` to identify trends and patterns.

2. **Data Cleaning**:
   - Ensure the dataset is in a clean format suitable for further analysis.

3. **Feature Analysis**:
   - Explore the distribution of medals by country, sport, and gender.
   - Investigate trends over time, such as changes in athlete demographics and the growth of specific sports.
   - Assess if country characteristics like GDP and population could be factors influencing medal counts.

4. **Visualization**:
   - Use Altair to create interactive visualizations that illustrate key insights from the data.
   - Develop charts that allow users to explore different aspects of the data, such as medal counts over time.
   - Implement an interactive choropleth map using a Flask app to show medal distribution by country and year.

## Tools and Technologies

- **Programming Language**: Python 
- **Libraries**:
  - **Data Processing**: Pandas, NumPy
  - **Visualization**: Altair
  - **Database**: PostgreSQL
- **Software**:
  - Visual Studio Code/Jupyter Notebook for data exploration and visualization
  - Flask for interactive choropleth map

## Challenges and Considerations

1. **Data Imbalance**: Certain countries may dominate the dataset, which could skew the analysis. Address this by normalizing data where appropriate.

2. **Historical Data Consistency**: Ensure that historical changes, such as the introduction of new sports or events, are considered when analyzing trends.

3. **Visualization Complexity**: Creating visualizations that are both informative and easy to interpret can be challenging, especially when dealing with large datasets.

## Expected Outcomes

1. **Detailed Insights**: Gain a deeper understanding of Olympic history, medal distribution, and athlete demographics.
2. **Interactive Visualizations**: Develop interactive maps and charts that allow users to explore medal counts and trends over time.
3. **Comprehensive Reporting**: Provide a clear and concise report that highlights the most interesting findings and supports them with data-driven evidence.
