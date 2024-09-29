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

    const labels = ['Nuclear Power Generation', 'Hydro Run-of-River', 'Wind Onshore'];
    
    const data = {
        labels: labels,
        datasets: [{
            label: 'Power Generation (MW)',
            data: [nuclearData, hydroRunOfRiverData, windOnshoreData],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    const config = {
        type: 'line',
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
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Energy Source'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Power Generation (MW)'
                    }
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
    'DE': { name: 'Germany', coordinates: [10.4515, 51.1657], capital: [13.4050, 52.5200], capitalTranslation: 'Berlin', aliases: ['Deutschland', 'DE'] },
    'FR': { name: 'France', coordinates: [2.2137, 46.2276], capital: [2.3522, 48.8566], capitalTranslation: 'Paris', aliases: ['Frankreich', 'FR'] },
    'IT': { name: 'Italy', coordinates: [12.5674, 41.8719], capital: [12.4964, 41.9028], capitalTranslation: 'Rom', aliases: ['Italien', 'IT'] },
    'ES': { name: 'Spain', coordinates: [-3.7492, 40.4637], capital: [-3.7038, 40.4168], capitalTranslation: 'Madrid', aliases: ['Spanien', 'ES'] },
    'AT': { name: 'Austria', coordinates: [13.3333, 47.5162], capital: [16.3738, 48.2082], capitalTranslation: 'Wien', aliases: ['Österreich', 'AT'] },
    'GB': { name: 'United Kingdom', coordinates: [-1.1743, 52.3555], capital: [-0.1276, 51.5074], capitalTranslation: 'London', aliases: ['England', 'GB', 'UK', 'Vereinigtes Königreich'] },
    'SE': { name: 'Sweden', coordinates: [18.6435, 60.1282], capital: [18.0686, 59.3293], capitalTranslation: 'Stockholm', aliases: ['Schweden', 'SE'] },
    'DK': { name: 'Denmark', coordinates: [9.5018, 56.2639], capital: [12.5683, 55.6761], capitalTranslation: 'Kopenhagen', aliases: ['Dänemark', 'DK'] },
    'CH': { name: 'Switzerland', coordinates: [8.2275, 46.8182], capital: [7.4474, 46.9481], capitalTranslation: 'Bern', aliases: ['Schweiz', 'CH'] },
    'PT': { name: 'Portugal', coordinates: [-8.2245, 39.3999], capital: [-9.1393, 38.7223], capitalTranslation: 'Lissabon', aliases: ['Portugal', 'PT'] },
    'NO': { name: 'Norway', coordinates: [8.4689, 60.472], capital: [10.7522, 59.9139], capitalTranslation: 'Oslo', aliases: ['Norwegen', 'NO'] },
    'FI': { name: 'Finland', coordinates: [25.7482, 61.9241], capital: [24.9384, 60.1695], capitalTranslation: 'Helsinki', aliases: ['Finnland', 'FI'] },
    'PL': { name: 'Poland', coordinates: [19.1451, 51.9194], capital: [21.0122, 52.2297], capitalTranslation: 'Warschau', aliases: ['Polen', 'PL'] },
    'CZ': { name: 'Czech Republic', coordinates: [15.4729, 49.8175], capital: [14.4378, 50.0755], capitalTranslation: 'Prag', aliases: ['Tschechien', 'CZ', 'Czechia'] },
    'HU': { name: 'Hungary', coordinates: [19.5033, 47.1625], capital: [19.0402, 47.4979], capitalTranslation: 'Budapest', aliases: ['Ungarn', 'HU'] },
    'GR': { name: 'Greece', coordinates: [21.8243, 39.0742], capital: [23.7275, 37.9838], capitalTranslation: 'Athen', aliases: ['Griechenland', 'GR'] },
    'NL': { name: 'Netherlands', coordinates: [5.2913, 52.1326], capital: [4.9041, 52.3676], capitalTranslation: 'Amsterdam', aliases: ['Niederlande', 'NL', 'Holland'] },
    'BE': { name: 'Belgium', coordinates: [4.4699, 50.5039], capital: [4.3517, 50.8503], capitalTranslation: 'Brüssel', aliases: ['Belgien', 'BE'] },
    'RO': { name: 'Romania', coordinates: [24.9668, 45.9432], capital: [26.1025, 44.4268], capitalTranslation: 'Bukarest', aliases: ['Rumänien', 'RO'] },
    'BG': { name: 'Bulgaria', coordinates: [25.4858, 42.7339], capital: [23.3219, 42.6977], capitalTranslation: 'Sofia', aliases: ['Bulgarien', 'BG'] },
    'HR': { name: 'Croatia', coordinates: [15.2, 45.1], capital: [15.9819, 45.8150], capitalTranslation: 'Zagreb', aliases: ['Kroatien', 'HR'] },
    'RS': { name: 'Serbia', coordinates: [21.0059, 44.0165], capital: [20.4573, 44.7866], capitalTranslation: 'Belgrad', aliases: ['Serbien', 'RS'] },
    'SI': { name: 'Slovenia', coordinates: [14.9955, 46.1512], capital: [14.5058, 46.0569], capitalTranslation: 'Ljubljana', aliases: ['Slowenien', 'SI'] },
    'SK': { name: 'Slovakia', coordinates: [19.699, 48.669], capital: [17.1077, 48.1486], capitalTranslation: 'Bratislava', aliases: ['Slowakei', 'SK'] },
    'EE': { name: 'Estonia', coordinates: [25.0136, 58.5953], capital: [24.7536, 59.4370], capitalTranslation: 'Tallinn', aliases: ['Estland', 'EE'] },
    'LV': { name: 'Latvia', coordinates: [24.6032, 56.8796], capital: [24.1058, 56.9496], capitalTranslation: 'Riga', aliases: ['Lettland', 'LV'] },
    'LT': { name: 'Lithuania', coordinates: [23.8813, 55.1694], capital: [25.2799, 54.6872], capitalTranslation: 'Vilnius', aliases: ['Litauen', 'LT'] },
    'IE': { name: 'Ireland', coordinates: [-8.2439, 53.4129], capital: [-6.2603, 53.3498], capitalTranslation: 'Dublin', aliases: ['Irland', 'IE'] },
    'IS': { name: 'Iceland', coordinates: [-19.0208, 64.9631], capital: [-21.8174, 64.1265], capitalTranslation: 'Reykjavik', aliases: ['Island', 'IS'] },
    'LU': { name: 'Luxembourg', coordinates: [6.1296, 49.6117], capital: [6.1319, 49.6117], capitalTranslation: 'Luxemburg', aliases: ['Luxemburg', 'LU'] },
    'MT': { name: 'Malta', coordinates: [14.3754, 35.9375], capital: [14.5146, 35.8997], capitalTranslation: 'Valletta', aliases: ['MT'] },
    'CY': { name: 'Cyprus', coordinates: [33.4299, 35.1264], capital: [33.3823, 35.1856], capitalTranslation: 'Nikosia', aliases: ['Zypern', 'CY'] },
    'AL': { name: 'Albania', coordinates: [20.1683, 41.1533], capital: [19.8189, 41.3275], capitalTranslation: 'Tirana', aliases: ['Albanien', 'AL'] },
    'MK': { name: 'North Macedonia', coordinates: [21.7453, 41.6086], capital: [21.4316, 41.9981], capitalTranslation: 'Skopje', aliases: ['Nordmazedonien', 'MK'] },
    'MD': { name: 'Moldova', coordinates: [28.3699, 47.4116], capital: [28.8638, 47.0105], capitalTranslation: 'Chisinau', aliases: ['Moldawien', 'MD'] },
    'UA': { name: 'Ukraine', coordinates: [31.1656, 48.3794], capital: [30.5234, 50.4501], capitalTranslation: 'Kiew', aliases: ['Ukraine', 'UA'] },
    'BY': { name: 'Belarus', coordinates: [27.9534, 53.7098], capital: [27.5666, 53.9006], capitalTranslation: 'Minsk', aliases: ['Weißrussland', 'BY'] },
    'BA': { name: 'Bosnia and Herzegovina', coordinates: [17.6791, 43.9159], capital: [18.4131, 43.8563], capitalTranslation: 'Sarajevo', aliases: ['Bosnien und Herzegowina', 'BA'] },
    'ME': { name: 'Montenegro', coordinates: [19.3744, 42.7087], capital: [19.2594, 42.4304], capitalTranslation: 'Podgorica', aliases: ['Montenegro', 'ME'] },
    'XK': { name: 'Kosovo', coordinates: [20.902, 42.6026], capital: [21.1655, 42.6629], capitalTranslation: 'Pristina', aliases: ['Kosovo', 'XK'] },
    'LI': { name: 'Liechtenstein', coordinates: [9.5554, 47.166], capital: [9.5215, 47.1416], capitalTranslation: 'Vaduz', aliases: ['Liechtenstein', 'LI'] },
    'VA': { name: 'Vatican City', coordinates: [12.4534, 41.9029], capital: [12.4534, 41.9029], capitalTranslation: 'Vatikanstadt', aliases: ['Vatikanstadt', 'VA'] },
    'SM': { name: 'San Marino', coordinates: [12.4578, 43.9424], capital: [12.4418, 43.9333], capitalTranslation: 'San Marino', aliases: ['San Marino', 'SM'] },
    'AD': { name: 'Andorra', coordinates: [1.5211, 42.5063], capital: [1.5341, 42.5078], capitalTranslation: 'Andorra la Vella', aliases: ['Andorra', 'AD'] },
    'MC': { name: 'Monaco', coordinates: [7.4128, 43.7384], capital: [7.4190, 43.7311], capitalTranslation: 'Monaco', aliases: ['Monaco', 'MC'] }
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
    let countryCode = null;

    // Clear previous marker, chart visibility, flag image, capital text, and country name
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

    // Remove the country name text if it exists
    const existingCountryNameElement = document.getElementById('countryNameText');
    if (existingCountryNameElement) {
        existingCountryNameElement.remove();
    }

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
        document.getElementById('loadingPlaceholder').style.display = 'none'; // Hide loading if country not found
        alert("Land nicht gefunden.");
        return;
    }

    // Fly to the capital of the selected country
    const capitalCoordinates = countryData[countryCode].capital;
    map.flyTo({
        center: capitalCoordinates,
        zoom: 5.5,
        essential: true
    });

    // Add a marker to the capital city of the country
    addCountryMarker(capitalCoordinates);

    // Display the chart only if Switzerland is selected
    if (countryCode === 'CH') {
        renderChart();
    }

    // Fetch the population and flag data
    try {
        const populationApiUrl = 'https://countriesnow.space/api/v0.1/countries/population';
        const populationResponse = await fetch(populationApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                country: countryData[countryCode].name
            })
        });

        const flagApiUrl = 'https://countriesnow.space/api/v0.1/countries/flag/images';
        const flagResponse = await fetch(flagApiUrl, {
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
            alert("Daten konnten nicht gefunden werden.");
            document.getElementById('loadingPlaceholder').style.display = 'none'; // Hide loading if there's an error
            return;
        }

        // Set the population and capital text
        const population = populationJson.data.populationCounts[populationJson.data.populationCounts.length - 1].value;
        document.getElementById('populationText').innerText = `${population.toLocaleString()} Einwohner`;
        
        // Use the translation from the countryData to get the capital in German
        const capitalTranslation = countryData[countryCode].capitalTranslation || 'Unbekannt';
        document.getElementById('capitalText').innerText = `Hauptstadt: ${capitalTranslation}`;

        // Set the flag image and show it
        document.getElementById('flagImage').src = flagJson.data.flag;
        document.getElementById('flagImage').style.display = 'block'; // Show flag once it's loaded

        // Now, after data is loaded, show the country's name in German in bold
        const countryNameInGerman = countryData[countryCode].aliases[0]; // Use the German name from the aliases array
        const countryNameText = `Land: ${countryNameInGerman}`;
        
        // Create a new element for the country name and add it to the text container
        const countryNameElement = document.createElement('p');
        countryNameElement.id = 'countryNameText';
        countryNameElement.innerHTML = `<strong>${countryNameText}</strong>`; // Bold the text using <strong> tag
        document.getElementById('text-container').insertBefore(countryNameElement, document.getElementById('flagImage'));

        // Hide the loading placeholder and show the final content
        document.getElementById('loadingPlaceholder').style.display = 'none';
        document.getElementById('helloText').style.display = 'block';
        document.getElementById('populationText').style.display = 'block';
        document.getElementById('capitalText').style.display = 'block'; // Show the capital

    } catch (error) {
        alert("Fehler beim Abrufen der Daten: " + error.message);
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
