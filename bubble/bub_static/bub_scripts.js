let spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": "An interactive bubble chart.",
    "data": {
        "values": data
    },
    "transform": [
        {
            "filter": "datum.year == 1960"
        }
    ],
    "mark": "circle",
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
            "title": "Population (normalized)",
            "scale": {"range": [15000, 50000]}  // Significantly increase the range for larger circles
        },
        "color": {"field": "country", "type": "nominal"},
        "tooltip": [
            {"field": "country", "type": "nominal"},
            {"field": "year", "type": "ordinal"},
            {"field": "GDP", "type": "quantitative"},
            {"field": "Medals", "type": "quantitative"},
            {"field": "Population", "type": "quantitative"}
        ]
    },
    "width": 600,
    "height": 400
};

vegaEmbed('#vis', spec);

function updateYear(year) {
    spec.transform[0].filter = "datum.year == " + year;
    vegaEmbed('#vis', spec);
    document.getElementById("yearValue").innerText = year;
}