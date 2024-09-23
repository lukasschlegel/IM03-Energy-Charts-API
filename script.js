async function getEnergyData() {
    const country = document.getElementById('countryInput').value;
    const resultDiv = document.getElementById('result');

    if (!country) {
        resultDiv.innerHTML = "Bitte gib ein Land ein.";
        return;
    }

    // Beispiel-URL, an die Anfrage gesendet wird. Die API-URL muss angepasst werden, um das Land abzufragen.
    const apiUrl = `https://api.energy-charts.info/query?country=${encodeURIComponent(country)}`;

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