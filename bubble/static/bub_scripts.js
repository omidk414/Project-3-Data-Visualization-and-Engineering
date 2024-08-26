

// Set up the Vega-Lite specification object
let spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": "An interactive bubble chart.",
    "data": {
        "values": data  // Use the data variable passed from Flask
    },
    "transform": [
        {
            "filter": "datum.year == 1960"  // Filter for the initial year
        },
        {
            "filter": "datum.country != 'USA'"  // Exclude data where the country is 'USA'
        }
    ],
    "mark": "circle",  // Use circle marks to represent each data point (country)
    "encoding": {
        "x": {
            "field": "GDP", 
            "type": "quantitative", 
            "title": "GDP (normalized)"
        },
        "y": {
            "field": "Medals", 
            "type": "quantitative", 
            "title": "Olympic Medals (normalized)"
        },
        "size": {
            "field": "Population", 
            "type": "quantitative", 
            "scale": {"type": "linear", "range": [1, 1000]},  // Logarithmic scale to handle large population differences
            "legend": null  // Disable legend for size (Population) to avoid clutter
        },
        "color": {
            "field": "country", 
            "type": "nominal",
            "legend": {
                "orient": "right",
                "title": "Country",
                "labelFontSize": 12,
                "titleFontSize": 14
            }
        },
        "tooltip": [
            {"field": "country", "type": "nominal", "title": "Country"},
            {"field": "year", "type": "ordinal", "title": "Year"},
            {"field": "GDP", "type": "quantitative", "title": "GDP (Normalized)"},
            {"field": "Medals", "type": "quantitative", "title": "Medals (Normalized)"},
            {"field": "Population", "type": "quantitative", "title": "Population"}  // Show raw population values
        ]
    },
    "width": 600,
    "height": 400,
    "config": {
        "legend": {
            "padding": 40  // Add padding to separate the legend from the chart
        },
        "view": {
            "continuousWidth": 600,
            "continuousHeight": 400,
            "stroke": "transparent"  // Remove border stroke around the chart area
        }
    }
};

// Render the initial Vega-Lite chart in the div with ID 'vis'
vegaEmbed('#vis', spec);

// Function to update the chart when the year is changed using the slider
function updateYear(year) {
    spec.transform[0].filter = "datum.year == " + year;  // Update the year filter in the Vega-Lite spec
    vegaEmbed('#vis', spec, {actions: false}).then(function(result) {
        result.view.insert("data", data).transition().run();  // Insert the data and transition to the new state
    });
    document.getElementById("yearValue").innerText = year;  // Update the displayed year value next to the slider
}