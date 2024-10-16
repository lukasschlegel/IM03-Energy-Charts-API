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

async function renderChart(countryCode) {
    const chartContainer = document.getElementById('chart-container');
    const chartError = document.createElement('div');
    chartError.id = 'chartError';
    chartError.style.display = 'none';
    chartError.innerText = 'Für dieses Land sind zurzeit keine Daten verfügbar.';

    if (!document.getElementById('chartError')) {
        chartContainer.appendChild(chartError);
    }

    document.getElementById('chart-container').style.display = 'block';

    if (window.myChartInstance) {
        window.myChartInstance.destroy();
        window.myChartInstance = null;
    }

    try {
        const response = await fetch(`https://etl.mmp.li/Energy-Charts_API/etl/unload.php?country=${countryCode}`);
        const energyData = await response.json();

        const energyDataArray = energyData[countryCode.toLowerCase()];

        if (!energyDataArray) {
            throw new Error('No data available for the selected country.');
        }

        document.getElementById('chartError').style.display = 'none';

        const currentTime = new Date();
        const oneDayAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);

        const filteredEnergyData = energyDataArray.filter(dataPoint => {
            const dataTime = new Date(dataPoint.timestamp);
            return dataTime >= oneDayAgo;
        });

        const timestamps = filteredEnergyData.map(dataPoint => {
            const date = new Date(dataPoint.timestamp);
            const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            return formattedTime;
        }).reverse();

        const nuclearData = filteredEnergyData.map(dataPoint => dataPoint.nuclear !== null && dataPoint.nuclear !== undefined ? dataPoint.nuclear.toFixed(0) : null).reverse();
        const hydroRunOfRiverData = filteredEnergyData.map(dataPoint => dataPoint.HydroRunofRiver !== null && dataPoint.HydroRunofRiver !== undefined ? dataPoint.HydroRunofRiver.toFixed(0) : null).reverse();
        const windOnshoreData = filteredEnergyData.map(dataPoint => dataPoint.Windonshore !== null && dataPoint.Windonshore !== undefined ? dataPoint.Windonshore.toFixed(0) : null).reverse();

        const data = {
            labels: timestamps,
            datasets: [
                {
                    label: 'Atom-Strom (MW)',
                    data: nuclearData,
                    borderColor: 'rgb(75, 192, 192)',
                    fill: false,
                    tension: 0.1,
                    spanGaps: false
                },
                {
                    label: 'Wasserkraft (MW)',
                    data: hydroRunOfRiverData,
                    borderColor: 'rgb(54, 162, 235)',
                    fill: false,
                    tension: 0.1,
                    spanGaps: false
                },
                {
                    label: 'Windkraft (MW)',
                    data: windOnshoreData,
                    borderColor: 'rgb(255, 99, 132)',
                    fill: false,
                    tension: 0.1,
                    spanGaps: false
                }
            ]
        };

        const countryNameInGerman = countryData[countryCode].aliases[0];

        const startDate = oneDayAgo.toLocaleDateString('de-DE');
        const startTime = oneDayAgo.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
        const endDate = currentTime.toLocaleDateString('de-DE');
        const endTime = currentTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

        const chartTitle = `Stromverbrauch vom ${startDate} (${startTime} Uhr) bis ${endDate} (${endTime} Uhr)`;

        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            color: 'black',
                            font: {
                                size: 12
                            },
                            padding: 10
                        }
                    },
                    title: {
                        display: true,
                        text: chartTitle,
                        color: 'black',
                        font: {
                            size: 18
                        }
                    }
                },
                layout: {
                    padding: {
                        left: 20
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Uhrzeit (hh:mm)',
                            color: 'black',
                            font: {
                                size: 14
                            }
                        },
                        ticks: {
                            color: 'black',
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Leistung (MW)',
                            color: 'black',
                            font: {
                                size: 12
                            }
                        },
                        ticks: {
                            color: 'black',
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            drawBorder: false,
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                }
            }
        };

        const ctx = document.getElementById('myChart').getContext('2d');
        document.getElementById('myChart').style.width = '900px';
        window.myChartInstance = new Chart(ctx, config);

    } catch (error) {
        console.error('Error fetching energy data:', error);
        document.getElementById('chartError').style.display = 'flex';
    }
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
    if (event.key === "Enter") {
        getEnergyData();
    }
}

let currentMarker = null;

async function getEnergyData() {
    const countryInput = document.getElementById('countryInput').value.trim().toLowerCase(); 
    let countryCode = null;

    document.getElementById('errorMessage').style.display = 'none';

    if (currentMarker) {
        currentMarker.remove();
    }
    document.getElementById('text-container').style.display = 'none';
    document.getElementById('flagImage').src = '';
    document.getElementById('flagImage').style.display = 'none';
    document.getElementById('helloText').style.display = 'none';
    document.getElementById('populationText').style.display = 'none';
    document.getElementById('capitalText').style.display = 'none';
    document.getElementById('capitalName').innerText = '';
    document.getElementById('capitalName').style.display = 'none';

    const existingCountryNameElement = document.getElementById('countryNameText');
    if (existingCountryNameElement) {
        existingCountryNameElement.remove();
    }

    document.getElementById('loadingPlaceholder').style.display = 'block';
    document.getElementById('text-container').style.display = 'block';

    for (const code in countryData) {
        const country = countryData[code];
        if (country.name.toLowerCase() === countryInput || country.aliases.some(alias => alias.toLowerCase() === countryInput)) {
            countryCode = code;
            break;
        }
    }

    if (!countryCode) {
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('loadingPlaceholder').style.display = 'none';
        document.getElementById('text-container').style.display = 'none';
        return;
    }

    document.getElementById('errorMessage').style.display = 'none';

    const capitalCoordinates = countryData[countryCode].capital;
    map.flyTo({
        center: capitalCoordinates,
        zoom: 5.5,
        essential: true
    });

    addCountryMarker(capitalCoordinates);

    renderChart(countryCode);

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
            document.getElementById('loadingPlaceholder').style.display = 'none';
            return;
        }

        const population = populationJson.data.populationCounts[populationJson.data.populationCounts.length - 1].value;
        document.getElementById('populationText').innerHTML = `${population.toLocaleString()}`;
        document.getElementById('populationText').classList.add('population-style');

        const capitalTranslation = countryData[countryCode].capitalTranslation || 'Unbekannt';
        document.getElementById('capitalLabel').innerText = 'Hauptstadt:';
        document.getElementById('capitalName').innerText = capitalTranslation;
        document.getElementById('capitalName').style.display = 'block';

        document.getElementById('flagImage').src = flagJson.data.flag;
        document.getElementById('flagImage').style.display = 'block';

        const countryNameInGerman = countryData[countryCode].aliases[0];
        const countryNameText = `${countryNameInGerman}`;
        const countryNameElement = document.createElement('p');
        countryNameElement.id = 'countryNameText';
        countryNameElement.innerHTML = `<strong>${countryNameText}</strong>`;
        document.getElementById('text-container').insertBefore(countryNameElement, document.getElementById('flagImage'));

        document.getElementById('loadingPlaceholder').style.display = 'none';
        document.getElementById('helloText').style.display = 'block';
        document.getElementById('populationText').style.display = 'block';
        document.getElementById('capitalText').style.display = 'block';

    } catch (error) {
        alert("Fehler beim Abrufen der Daten: " + error.message);
        document.getElementById('loadingPlaceholder').style.display = 'none';
        document.getElementById('text-container').style.display = 'none';
    }
}

function addCountryMarker(coordinates) {
    const markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';

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

document.getElementById('steckerIcon').addEventListener('click', function() {
    document.body.classList.toggle('blended');
    
    document.getElementById('form-container').style.display = 'none';
    document.getElementById('text-container').style.display = 'none';
    document.getElementById('chart-container').style.display = 'none';
    document.getElementById('steckerIcon').style.display = 'none';

    const stromfresserTextSpans = document.querySelectorAll('.text-animation h1 span');
    stromfresserTextSpans.forEach(span => {
        span.style.animation = 'none';
    });

    if (currentMarker) {
        currentMarker.remove();
        currentMarker = null;
    }

    const quotePopup = document.getElementById('quotePopup');
    if (quotePopup.style.display === 'none' || quotePopup.style.display === '') {
        quotePopup.style.display = 'block';
    } else {
        quotePopup.style.display = 'none';
    }
});

window.addEventListener('mousemove', function(e) {
    if (document.body.classList.contains('blended')) {
        document.documentElement.style.setProperty('--pointerX', e.clientX + 'px');
        document.documentElement.style.setProperty('--pointerY', e.clientY + 'px');
    }
});
