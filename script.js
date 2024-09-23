async function getEnergyData() {
    const country = document.getElementById('countryInput').value;
    const resultDiv = document.getElementById('result');

    if (!country) {
        resultDiv.innerHTML = "Bitte gib ein Land ein.";
        return;
    }

    // Beispiel-URL, an die Anfrage gesendet wird. Die API-URL muss angepasst werden, um das Land abzufragen.
    const apiUrl = `https://api.energy-charts.info/power/public_power/?country=DE`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Fehler bei der API-Anfrage");
        }

        const data = await response.json();

        // Hier nehmen wir an, dass die API den Energieverbrauch im Format data.consumption zurückgibt
        const consumption = data.consumption || "Keine Daten verfügbar";
        resultDiv.innerHTML = `<h2>Energieverbrauch in ${country}: ${consumption} kWh</h2>`;
    } catch (error) {
        resultDiv.innerHTML = "Fehler beim Abrufen der Daten: " + error.message;
    }
}

mapboxgl.accessToken = 'pk.eyJ1IjoibHVrYXNzY2hsZWdlbCIsImEiOiJjbHc2Y2drMGIxcGhjMnFwaG1wc21mZ3U4In0.BRdsjYzHNpwgSXhnbXVvzA';
const map = new mapboxgl.Map({
container: 'map',
// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
style: 'mapbox://styles/mapbox/dark-v11',
zoom: 3.1,
center: [15, 50],
projection: 'globe'
});
 
map.on('load', () => {
// Set the default atmosphere style
map.setFog({
    "range": [0.8, 8],
    "color": "black",
    "horizon-blend": 0.01,
    "high-color": "lightblue",
    "space-color": "#000000",
    "star-intensity": 0.03
});
});
