mapboxgl.accessToken = 'pk.eyJ1IjoibHVrYXNzY2hsZWdlbCIsImEiOiJjbHc2Y2drMGIxcGhjMnFwaG1wc21mZ3U4In0.BRdsjYzHNpwgSXhnbXVvzA';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    zoom: 3.1,
    center: [15, 50],
    projection: 'globe',
    locale: 'de',
});

map.on('load', () => {
    map.setFog({
        "range": [0.8, 8],
        "color": "black",
        "horizon-blend": 0.01,
        "high-color": "lightblue",
        "space-color": "#000000",
        "star-intensity": 0.03
    });

    map.getStyle().layers.forEach(function(layer) {
        if (layer.type === 'symbol') {
            map.setLayoutProperty(layer.id, 'visibility', 'none'); 
        }
    });
});

document.getElementById('torchButton').addEventListener('click', function() {
    // Toggle the "blended" mode
    document.body.classList.toggle('blended');
});

// If in torchlight mode, track the mouse position
window.addEventListener('mousemove', function(e) {
    if (document.body.classList.contains('blended')) {
        document.documentElement.style.setProperty('--pointerX', e.clientX + 'px');
        document.documentElement.style.setProperty('--pointerY', e.clientY + 'px');
    }
});




function renderChart() {
    document.getElementById('chart-container').style.display = 'block';  // Show the chart

    const nuclearData = 2872.6; // Total or average of nuclear power data
    const hydroRunOfRiverData = 1525.8; // Total or average of hydro run-of-river data
    const windOnshoreData = 13.5; // Total or average of wind onshore data

    const data = {
        labels: [
            'Nuclear Power Generation',
            'Hydro Run-of-River',
            'Wind Onshore'
        ],
        datasets: [{
            label: 'Power Generation (MW)',
            data: [nuclearData, hydroRunOfRiverData, windOnshoreData],
            backgroundColor: [
                'rgb(75, 192, 192)',  // Color for Nuclear Power
                'rgb(54, 162, 235)',  // Color for Hydro Run-of-River
                'rgb(255, 99, 132)'   // Color for Wind Onshore
            ],
            hoverOffset: 4
        }]
    };

    const config = {
        type: 'doughnut',  // Change to 'pie' if you prefer a pie chart
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Energy Generation by Source (MW)'
                }
            }
        }
    };

    // Clear the previous chart instance (if any) and re-render the chart
    const ctx = document.getElementById('myChart').getContext('2d');
    if (window.myChartInstance) {
        window.myChartInstance.destroy();
    }
    window.myChartInstance = new Chart(ctx, config);
}

const countryData = {
    'DE': { name: 'Deutschland', coordinates: [10.4515, 51.1657] },
    'FR': { name: 'Frankreich', coordinates: [2.2137, 46.2276] },
    'IT': { name: 'Italien', coordinates: [12.5674, 41.8719] },
    'ES': { name: 'Spanien', coordinates: [-3.7492, 40.4637] },
    'AT': { name: 'Österreich', coordinates: [13.3333, 47.5162] },
    'GB': { name: 'England', coordinates: [-1.1743, 52.3555] },
    'SE': { name: 'Schweden', coordinates: [18.6435, 60.1282] },
    'DK': { name: 'Dänemark', coordinates: [9.5018, 56.2639] },
    'CH': { name: 'Schweiz', coordinates: [8.2275, 46.8182] }, 
    'PT': { name: 'Portugal', coordinates: [-8.2245, 39.3999] }  
};



let currentMarker = null;  // Store the current marker

async function getEnergyData() {
    const countryInput = document.getElementById('countryInput').value.trim().toLowerCase(); 
    const resultDiv = document.getElementById('result');
    let countryCode = null;
    
    // Clear previous marker and chart visibility
    if (currentMarker) {
        currentMarker.remove();
    }
    document.getElementById('chart-container').style.display = 'none';
    
    // Search for the country in the dataset
    for (const code in countryData) {
        const country = countryData[code];
        if (country.name.toLowerCase() === countryInput || code.toLowerCase() === countryInput) {
            countryCode = code;
            break;
        }
    }

    if (!countryCode) {
        resultDiv.innerHTML = "Land nicht gefunden.";
        return;
    }

    // Fly to the selected country
    const coordinates = countryData[countryCode].coordinates;
    map.flyTo({
        center: coordinates,
        zoom: 5, // Adjust zoom level for the selected country
        essential: true
    });

    // Add a marker to the center of the country
    addCountryMarker(coordinates);

    // Display the chart only if Switzerland is selected
    if (countryCode === 'CH') {
        renderChart(); // Show the chart
    }

    // API request for energy data (dummy implementation)
    const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://api.energy-charts.info/public_power?country=${countryCode}`)}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
    } catch (error) {
        resultDiv.innerHTML = "Fehler beim Abrufen der Daten: " + error.message;
    }
}


function addCountryMarker(coordinates) {
    // Create a new marker at the center of the country
    currentMarker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(coordinates)
        .addTo(map);
}

function renderChart() {
    document.getElementById('chart-container').style.display = 'block';  // Show the chart

    const nuclearData = 2872.6; // Sample nuclear power data
    const hydroRunOfRiverData = 1525.8; // Sample hydro run-of-river data
    const windOnshoreData = 13.5; // Sample wind onshore data

    const data = {
        labels: [
            'Nuclear Power Generation',
            'Hydro Run-of-River',
            'Wind Onshore'
        ],
        datasets: [{
            label: 'Power Generation (MW)',
            data: [nuclearData, hydroRunOfRiverData, windOnshoreData],
            backgroundColor: [
                'rgb(75, 192, 192)',  // Color for Nuclear Power
                'rgb(54, 162, 235)',  // Color for Hydro Run-of-River
                'rgb(255, 99, 132)'   // Color for Wind Onshore
            ],
            hoverOffset: 4
        }]
    };

    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Energy Generation by Source (MW)'
                }
            }
        }
    };

    // Clear the previous chart instance (if any) and re-render the chart
    const ctx = document.getElementById('myChart').getContext('2d');
    if (window.myChartInstance) {
        window.myChartInstance.destroy();
    }
    window.myChartInstance = new Chart(ctx, config);

    // Draw connection line from chart to Switzerland's center
    drawConnectionLine();
}
