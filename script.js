// Liste von Ländern mit vollständigem Namen und deren Koordinaten (vereinfachte Liste, kann erweitert werden)
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

async function getEnergyData() {
    const countryInput = document.getElementById('countryInput').value.trim().toLowerCase(); 
    const resultDiv = document.getElementById('result');

    if (!countryInput) {
        resultDiv.innerHTML = "Bitte gib ein Land ein.";
        return;
    }

    // Suche nach dem Länderkürzel oder dem ausgeschriebenen Land
    let countryCode = null;

    // Durchsuche die Länderliste nach einem passenden Namen oder Ländercode
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

    // Koordinaten des gefundenen Landes
    const coordinates = countryData[countryCode].coordinates;

    // Karte zum angegebenen Land fliegen lassen
    map.flyTo({
        center: coordinates,
        zoom: 5, // Zoom-Level anpassen
        essential: true
    });

    // API-URL (Beispiel: Diese URL sollte angepasst werden, um tatsächliche Daten abzurufen)
    const apiUrl = `https://api.energy-charts.info/public_power?country=${countryCode}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Fehler bei der API-Anfrage");
        }

        const data = await response.json();

        // Hier nehmen wir an, dass die API den Energieverbrauch im Format data.consumption zurückgibt
        const consumption = data.consumption || "Keine Daten verfügbar";
        resultDiv.innerHTML = `<h2>Energieverbrauch in ${countryData[countryCode].name}: ${consumption} kWh</h2>`;
    } catch (error) {
        resultDiv.innerHTML = "Fehler beim Abrufen der Daten: " + error.message;
    }
}

// Mapbox Initialisierung
mapboxgl.accessToken = 'pk.eyJ1IjoibHVrYXNzY2hsZWdlbCIsImEiOiJjbHc2Y2drMGIxcGhjMnFwaG1wc21mZ3U4In0.BRdsjYzHNpwgSXhnbXVvzA';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    zoom: 3.1,
    center: [15, 50],
    projection: 'globe'
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

});
