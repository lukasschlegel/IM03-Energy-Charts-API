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
}

const countryData = {
    'DE': { name: 'Germany', coordinates: [10.4515, 51.1657], aliases: ['Deutschland', 'DE'] },
    'FR': { name: 'France', coordinates: [2.2137, 46.2276], aliases: ['Frankreich', 'FR'] },
    'IT': { name: 'Italy', coordinates: [12.5674, 41.8719], aliases: ['Italien', 'IT'] },
    'ES': { name: 'Spain', coordinates: [-3.7492, 40.4637], aliases: ['Spanien', 'ES'] },
    'AT': { name: 'Austria', coordinates: [13.3333, 47.5162], aliases: ['Österreich', 'AT'] },
    'GB': { name: 'United Kingdom', coordinates: [-1.1743, 52.3555], aliases: ['England', 'GB'] },
    'SE': { name: 'Sweden', coordinates: [18.6435, 60.1282], aliases: ['Schweden', 'SE'] },
    'DK': { name: 'Denmark', coordinates: [9.5018, 56.2639], aliases: ['Dänemark', 'DK'] },
    'CH': { name: 'Switzerland', coordinates: [8.2275, 46.8182], aliases: ['Schweiz', 'CH'] }, 
    'PT': { name: 'Portugal', coordinates: [-8.2245, 39.3999], aliases: ['Portugal', 'PT'] }  
};

function checkEnter(event) {
    // Check if the key pressed is "Enter"
    if (event.key === "Enter") {
        getEnergyData();  // Call the search function
    }
}

let currentMarker = null;  // Store the current marker
async function getEnergyData() {
    const countryInput = document.getElementById('countryInput').value.trim().toLowerCase(); 
    const resultDiv = document.getElementById('result');
    let countryCode = null;

    // Clear previous marker, chart visibility, and flag image
    if (currentMarker) {
        currentMarker.remove();
    }
    document.getElementById('chart-container').style.display = 'none';
    document.getElementById('text-container').style.display = 'none'; // Hide the text container initially
    document.getElementById('flagImage').src = ''; // Clear the flag image
    document.getElementById('flagImage').style.display = 'none'; // Hide flag until it's loaded
    document.getElementById('helloText').style.display = 'none'; // Hide text until loaded
    document.getElementById('populationText').style.display = 'none'; // Hide text until loaded

    // Show loading placeholder
    document.getElementById('loadingPlaceholder').style.display = 'block';
    document.getElementById('text-container').style.display = 'block'; // Show the container

    // Search for the country in the dataset by checking name and aliases
    for (const code in countryData) {
        const country = countryData[code];
        if (country.name.toLowerCase() === countryInput || country.aliases.some(alias => alias.toLowerCase() === countryInput)) {
            countryCode = code;
            break;
        }
    }

    if (!countryCode) {
        resultDiv.innerHTML = "Land nicht gefunden.";
        document.getElementById('loadingPlaceholder').style.display = 'none'; // Hide loading if country not found
        return;
    }

    // Fly to the selected country
    const coordinates = countryData[countryCode].coordinates;
    map.flyTo({
        center: coordinates,
        zoom: 5,
        essential: true
    });

    // Add a marker to the center of the country
    addCountryMarker(coordinates);

    // Display the chart only if Switzerland is selected
    if (countryCode === 'CH') {
        renderChart();
    }

    // Fetch the population and flag data
    try {
        const populationApiUrl = 'https://countriesnow.space/api/v0.1/countries/population';
        const populationResponse = fetch(populationApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                country: countryData[countryCode].name
            })
        });

        const flagApiUrl = 'https://countriesnow.space/api/v0.1/countries/flag/images';
        const flagResponse = fetch(flagApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                country: countryData[countryCode].name
            })
        });

        const [populationData, flagData] = await Promise.all([populationResponse, flagResponse]);
        
        const populationJson = await populationData.json();
        const flagJson = await flagData.json();

        if (populationJson.error || !populationJson.data || flagJson.error || !flagJson.data) {
            resultDiv.innerHTML = "Daten konnten nicht gefunden werden.";
            document.getElementById('loadingPlaceholder').style.display = 'none'; // Hide loading if there's an error
            return;
        }

        const population = populationJson.data.populationCounts[populationJson.data.populationCounts.length - 1].value;
        document.getElementById('populationText').innerText = `${population.toLocaleString()} Einwohner`;
        
        // Set the flag image and show it
        document.getElementById('flagImage').src = flagJson.data.flag;
        document.getElementById('flagImage').style.display = 'block'; // Show flag once it's loaded

        // Hide the loading placeholder and show the final content
        document.getElementById('loadingPlaceholder').style.display = 'none';
        document.getElementById('helloText').style.display = 'block';
        document.getElementById('populationText').style.display = 'block';

    } catch (error) {
        resultDiv.innerHTML = "Fehler beim Abrufen der Daten: " + error.message;
        document.getElementById('loadingPlaceholder').style.display = 'none'; // Hide loading on error
    }
}


function addCountryMarker(coordinates) {
    // Create a new marker at the center of the country
    currentMarker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(coordinates)
        .addTo(map);
}

document.querySelector(".text-animation h1").innerHTML = 
    document.querySelector(".text-animation h1").textContent.replace(/./g, "<span>$&</span>");

let spans = document.querySelectorAll(".text-animation h1 span");
for (let i = 0; i < spans.length; i++) {
    spans[i].style.animationDelay = (i * 250) + "ms";
}
