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
    'GB': { name: 'United Kingdom', coordinates: [-1.1743, 52.3555], aliases: ['England', 'GB', 'UK', 'Vereinigtes Königreich'] },
    'SE': { name: 'Sweden', coordinates: [18.6435, 60.1282], aliases: ['Schweden', 'SE'] },
    'DK': { name: 'Denmark', coordinates: [9.5018, 56.2639], aliases: ['Dänemark', 'DK'] },
    'CH': { name: 'Switzerland', coordinates: [8.2275, 46.8182], aliases: ['Schweiz', 'CH'] },
    'PT': { name: 'Portugal', coordinates: [-8.2245, 39.3999], aliases: ['Portugal', 'PT'] },
    'NO': { name: 'Norway', coordinates: [8.4689, 60.472], aliases: ['Norwegen', 'NO'] },
    'FI': { name: 'Finland', coordinates: [25.7482, 61.9241], aliases: ['Finnland', 'FI'] },
    'PL': { name: 'Poland', coordinates: [19.1451, 51.9194], aliases: ['Polen', 'PL'] },
    'CZ': { name: 'Czech Republic', coordinates: [15.4729, 49.8175], aliases: ['Tschechien', 'CZ', 'Czechia'] },
    'HU': { name: 'Hungary', coordinates: [19.5033, 47.1625], aliases: ['Ungarn', 'HU'] },
    'GR': { name: 'Greece', coordinates: [21.8243, 39.0742], aliases: ['Griechenland', 'GR'] },
    'NL': { name: 'Netherlands', coordinates: [5.2913, 52.1326], aliases: ['Niederlande', 'NL', 'Holland'] },
    'BE': { name: 'Belgium', coordinates: [4.4699, 50.5039], aliases: ['Belgien', 'BE'] },
    'RO': { name: 'Romania', coordinates: [24.9668, 45.9432], aliases: ['Rumänien', 'RO'] },
    'BG': { name: 'Bulgaria', coordinates: [25.4858, 42.7339], aliases: ['Bulgarien', 'BG'] },
    'HR': { name: 'Croatia', coordinates: [15.2, 45.1], aliases: ['Kroatien', 'HR'] },
    'RS': { name: 'Serbia', coordinates: [21.0059, 44.0165], aliases: ['Serbien', 'RS'] },
    'SI': { name: 'Slovenia', coordinates: [14.9955, 46.1512], aliases: ['Slowenien', 'SI'] },
    'SK': { name: 'Slovakia', coordinates: [19.699, 48.669], aliases: ['Slowakei', 'SK'] },
    'EE': { name: 'Estonia', coordinates: [25.0136, 58.5953], aliases: ['Estland', 'EE'] },
    'LV': { name: 'Latvia', coordinates: [24.6032, 56.8796], aliases: ['Lettland', 'LV'] },
    'LT': { name: 'Lithuania', coordinates: [23.8813, 55.1694], aliases: ['Litauen', 'LT'] },
    'IE': { name: 'Ireland', coordinates: [-8.2439, 53.4129], aliases: ['Irland', 'IE'] },
    'IS': { name: 'Iceland', coordinates: [-19.0208, 64.9631], aliases: ['Island', 'IS'] },
    'LU': { name: 'Luxembourg', coordinates: [6.1296, 49.6117], aliases: ['Luxemburg', 'LU'] },
    'MT': { name: 'Malta', coordinates: [14.3754, 35.9375], aliases: ['MT'] },
    'CY': { name: 'Cyprus', coordinates: [33.4299, 35.1264], aliases: ['Zypern', 'CY'] },
    'AL': { name: 'Albania', coordinates: [20.1683, 41.1533], aliases: ['Albanien', 'AL'] },
    'MK': { name: 'North Macedonia', coordinates: [21.7453, 41.6086], aliases: ['Nordmazedonien', 'MK'] },
    'MD': { name: 'Moldova', coordinates: [28.3699, 47.4116], aliases: ['Moldawien', 'MD'] },
    'UA': { name: 'Ukraine', coordinates: [31.1656, 48.3794], aliases: ['Ukraine', 'UA'] },
    'BY': { name: 'Belarus', coordinates: [27.9534, 53.7098], aliases: ['Weißrussland', 'BY'] },
    'BA': { name: 'Bosnia and Herzegovina', coordinates: [17.6791, 43.9159], aliases: ['Bosnien und Herzegowina', 'BA'] },
    'ME': { name: 'Montenegro', coordinates: [19.3744, 42.7087], aliases: ['Montenegro', 'ME'] },
    'XK': { name: 'Kosovo', coordinates: [20.902, 42.6026], aliases: ['Kosovo', 'XK'] },
    'LI': { name: 'Liechtenstein', coordinates: [9.5554, 47.166], aliases: ['Liechtenstein', 'LI'] },
    'VA': { name: 'Vatican City', coordinates: [12.4534, 41.9029], aliases: ['Vatikanstadt', 'VA'] },
    'SM': { name: 'San Marino', coordinates: [12.4578, 43.9424], aliases: ['San Marino', 'SM'] },
    'AD': { name: 'Andorra', coordinates: [1.5211, 42.5063], aliases: ['Andorra', 'AD'] },
    'MC': { name: 'Monaco', coordinates: [7.4128, 43.7384], aliases: ['Monaco', 'MC'] }
};

const capitalTranslations = {
    'Germany': 'Berlin',
    'France': 'Paris',
    'Italy': 'Rom',
    'Spain': 'Madrid',
    'Austria': 'Wien',
    'United Kingdom': 'London',
    'Sweden': 'Stockholm',
    'Denmark': 'Kopenhagen',
    'Switzerland': 'Bern',
    'Portugal': 'Lissabon',
    'Norway': 'Oslo',
    'Finland': 'Helsinki',
    'Poland': 'Warschau',
    'Czech Republic': 'Prag',
    'Hungary': 'Budapest',
    'Greece': 'Athen',
    'Netherlands': 'Amsterdam',
    'Belgium': 'Brüssel',
    'Romania': 'Bukarest',
    'Bulgaria': 'Sofia',
    'Croatia': 'Zagreb',
    'Serbia': 'Belgrad',
    'Slovenia': 'Ljubljana',
    'Slovakia': 'Bratislava',
    'Estonia': 'Tallinn',
    'Latvia': 'Riga',
    'Lithuania': 'Vilnius',
    'Ireland': 'Dublin',
    'Iceland': 'Reykjavik',
    'Luxembourg': 'Luxemburg',
    'Malta': 'Valletta',
    'Cyprus': 'Nikosia',
    'Albania': 'Tirana',
    'North Macedonia': 'Skopje',
    'Moldova': 'Chisinau',
    'Ukraine': 'Kiew',
    'Belarus': 'Minsk',
    'Bosnia and Herzegovina': 'Sarajevo',
    'Montenegro': 'Podgorica',
    'Kosovo': 'Pristina',
    'Liechtenstein': 'Vaduz',
    'Vatican City': 'Vatikanstadt',
    'San Marino': 'San Marino',
    'Andorra': 'Andorra la Vella',
    'Monaco': 'Monaco'
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

    // Clear previous marker, chart visibility, flag image, and capital text
    if (currentMarker) {
        currentMarker.remove();
    }
    document.getElementById('chart-container').style.display = 'none';
    document.getElementById('text-container').style.display = 'none'; // Hide the text container initially
    document.getElementById('flagImage').src = ''; // Clear the flag image
    document.getElementById('flagImage').style.display = 'none'; // Hide flag until it's loaded
    document.getElementById('helloText').style.display = 'none'; // Hide text until loaded
    document.getElementById('populationText').style.display = 'none'; // Hide text until loaded
    document.getElementById('capitalText').style.display = 'none'; // Hide capital text until loaded

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
        
        // Use the translation table to get the capital in German
        const countryName = countryData[countryCode].name;
        const capital = capitalTranslations[countryName] || 'Unbekannt'; // Fallback to 'Unbekannt' if not in the table
        document.getElementById('capitalText').innerText = `Hauptstadt: ${capital}`; // Set the capital text
        
        // Set the flag image and show it
        document.getElementById('flagImage').src = flagJson.data.flag;
        document.getElementById('flagImage').style.display = 'block'; // Show flag once it's loaded

        // Hide the loading placeholder and show the final content
        document.getElementById('loadingPlaceholder').style.display = 'none';
        document.getElementById('helloText').style.display = 'block';
        document.getElementById('populationText').style.display = 'block';
        document.getElementById('capitalText').style.display = 'block'; // Show the capital

    } catch (error) {
        resultDiv.innerHTML = "Fehler beim Abrufen der Daten: " + error.message;
        document.getElementById('loadingPlaceholder').style.display = 'none'; // Hide loading on error
    }
}

function addCountryMarker(coordinates) {
    // Create a custom marker element
    const markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';

    // Create the Mapbox marker and attach it to the map
    currentMarker = new mapboxgl.Marker({
        element: markerElement
    })
    .setLngLat(coordinates)
    .addTo(map);
}


document.querySelector(".text-animation h1").innerHTML = 
    document.querySelector(".text-animation h1").textContent.replace(/./g, "<span>$&</span>");

let spans = document.querySelectorAll(".text-animation h1 span");
for (let i = 0; i < spans.length; i++) {
    spans[i].style.animationDelay = (i * 250) + "ms";
}
