from flask import Flask, render_template
import pandas as pd
from sqlalchemy import create_engine
from sklearn.preprocessing import MinMaxScaler
import json

app = Flask(__name__)


@app.route('/')
def index():
    # Create a database connection
    engine = create_engine('--REPLACE-WITH-DATABASE-CONNECTION-STRING--')
    
    # Define the list of African countries
    african_countries = [
        'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 
        'Cabo Verde', 'Cameroon', 'Central African Republic', 'Chad', 'Comoros', 
        'Congo', 'Cote d\'Ivoire', 'Djibouti', 'Egypt', 'Equatorial Guinea', 
        'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 
        'Guinea', 'Guinea-Bissau', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 
        'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 
        'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Sao Tome and Principe', 
        'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 
        'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 
        'Zambia', 'Zimbabwe'
    ]
    
    # Define additional custom groupings
    nordic_countries = ['Finland', 'Sweden', 'Norway', 'Denmark', 'Iceland']
    central_europe = ['Switzerland', 'Austria', 'Poland', 'Hungary', 'Czech Republic', 'Slovakia']
    caribbean_countries = [
        'Jamaica', 'Bahamas', 'Trinidad and Tobago', 'Barbados', 
        'Cuba', 'Dominican Republic', 'Puerto Rico'
    ]
    benelux_countries = ['Belgium', 'Netherlands', 'Luxembourg']
    oceania_countries = ['New Zealand', 'Australia', 'Tonga', 'Samoa']
    iberian_peninsula_countries = ['Portugal', 'Spain']
    south_america = [
        'Brazil', 'Argentina', 'Chile', 'Peru', 'Colombia', 
        'Venezuela', 'Uruguay', 'Paraguay', 'Bolivia', 'Ecuador'
    ]
    middle_east = [
        'Saudi Arabia', 'Iran', 'Iraq', 'Israel', 'Turkey', 
        'Lebanon', 'Jordan', 'Syria', 'United Arab Emirates', 'Qatar', 
        'Pakistan', 'Kuwait', 'Bahrain'
    ]
    eastern_europe = [
        'Ukraine', 'Belarus', 'Moldova', 'Romania', 
        'Bulgaria', 'Serbia', 'Montenegro', 'Bosnia and Herzegovina',
        'Estonia', 'Latvia', 'Lithuania', 'Croatia', 'Georgia', 
        'Slovenia', 'Armenia', 'Azerbaijan'
    ]
    central_asia = ['Kazakhstan', 'Uzbekistan', 'Afghanistan', 'Tajikistan']
    southeast_asia = [
        'Malaysia', 'Thailand', 'Vietnam', 'Indonesia', 'Philippines', 
        'Singapore', 'Myanmar', 'Brunei', 'Cambodia', 'Laos', 'Sri Lanka'
    ]
    east_asia = ['South Korea', 'Taiwan', 'Mongolia', 'North Korea']

    # Define the list of Central American countries
    central_america = [
        'Mexico', 'Belize', 'Costa Rica', 'El Salvador', 'Guatemala', 
        'Honduras', 'Nicaragua', 'Panama'
    ]

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

    # Standardize country names across all datasets
    country_name_mapping = {
        'Russian Empire': 'Russia',
        'Soviet Union': 'Russia',
        'Russian Federation': 'Russia',
        'United States': 'USA',
        'America': 'USA',
        'United Kingdom': 'UK',
        'Britain': 'UK',
        'England': 'UK'
        # Add more mappings as needed
    }

    gdp_data['country'] = gdp_data['country'].replace(country_name_mapping)
    population_data['country'] = population_data['country'].replace(country_name_mapping)
    medals_data['country'] = medals_data['country'].replace(country_name_mapping)

    # Group countries into their respective regions
    gdp_data['country'] = gdp_data['country'].apply(
        lambda x: 'Africa' if x in african_countries else (
            'Nordic Countries' if x in nordic_countries else (
                'Central Europe' if x in central_europe else (
                    'Caribbean' if x in caribbean_countries else (
                        'Benelux' if x in benelux_countries else (
                            'Oceania' if x in oceania_countries else (
                                'Iberian Peninsula' if x in iberian_peninsula_countries else (
                                    'South America' if x in south_america else (
                                        'Middle East' if x in middle_east else (
                                            'Eastern Europe' if x in eastern_europe else (
                                                'Central Asia' if x in central_asia else (
                                                    'Southeast Asia' if x in southeast_asia else (
                                                        'East Asia' if x in east_asia else (
                                                            'Central America' if x in central_america else x
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
        )
    )

    population_data['country'] = population_data['country'].apply(
        lambda x: 'Africa' if x in african_countries else (
            'Nordic Countries' if x in nordic_countries else (
                'Central Europe' if x in central_europe else (
                    'Caribbean' if x in caribbean_countries else (
                        'Benelux' if x in benelux_countries else (
                            'Oceania' if x in oceania_countries else (
                                'Iberian Peninsula' if x in iberian_peninsula_countries else (
                                    'South America' if x in south_america else (
                                        'Middle East' if x in middle_east else (
                                            'Eastern Europe' if x in eastern_europe else (
                                                'Central Asia' if x in central_asia else (
                                                    'Southeast Asia' if x in southeast_asia else (
                                                        'East Asia' if x in east_asia else (
                                                            'Central America' if x in central_america else x
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
        )
    )

    medals_data['country'] = medals_data['country'].apply(
        lambda x: 'Africa' if x in african_countries else (
            'Nordic Countries' if x in nordic_countries else (
                'Central Europe' if x in central_europe else (
                    'Caribbean' if x in caribbean_countries else (
                        'Benelux' if x in benelux_countries else (
                            'Oceania' if x in oceania_countries else (
                                'Iberian Peninsula' if x in iberian_peninsula_countries else (
                                    'South America' if x in south_america else (
                                        'Middle East' if x in middle_east else (
                                            'Eastern Europe' if x in eastern_europe else (
                                                'Central Asia' if x in central_asia else (
                                                    'Southeast Asia' if x in southeast_asia else (
                                                        'East Asia' if x in east_asia else (
                                                            'Central America' if x in central_america else x
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
        )
    )

    
    # Aggregate the data for grouped regions
    gdp_data = gdp_data.groupby(['country', 'year']).sum().reset_index()
    population_data = population_data.groupby(['country', 'year']).sum().reset_index()
    medals_data = medals_data.groupby(['country', 'year']).sum().reset_index()

    # Normalize the data using MinMaxScaler
    scaler = MinMaxScaler()

    # Normalize GDP data
    gdp_data['Value'] = scaler.fit_transform(gdp_data['gdp'].values.reshape(-1, 1))
    gdp_data['Indicator'] = 'GDP'

    # Normalize Population data
    population_data['Value'] = scaler.fit_transform(population_data['total_population'].values.reshape(-1, 1))
    population_data['Indicator'] = 'Population'

    # Normalize Medals data
    medals_data['Value'] = scaler.fit_transform(medals_data['total_medals'].values.reshape(-1, 1))
    medals_data['Indicator'] = 'Medals'
        # Concatenate the data into a single DataFrame
    combined_data = pd.concat([gdp_data[['country', 'year', 'Indicator', 'Value']],
                               population_data[['country', 'year', 'Indicator', 'Value']],
                               medals_data[['country', 'year', 'Indicator', 'Value']]])

    # Pivot the DataFrame to get the desired structure
    bubble_chart_data = combined_data.pivot_table(index=['country', 'year'], columns='Indicator', values='Value').reset_index()

    # Convert DataFrame to JSON for use in the frontend
    data_json = bubble_chart_data.to_json(orient='records')

    return render_template('index.html', data=data_json)

if __name__ == '__main__':
    app.run(debug=True)
    
