<?php

// Funktion zum Abrufen der Daten für ein bestimmtes Land
function fetchPowerData($countryCode) {
    $url = "https://api.energy-charts.info/public_power?country=" . $countryCode;

    // Initialisiert eine cURL-Sitzung
    $ch = curl_init($url);

    // Setzt Optionen
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Führt die cURL-Sitzung aus und erhält den Inhalt
    $response = curl_exec($ch);

    // Schließt die cURL-Sitzung
    curl_close($ch);

    // Dekodiert die JSON-Antwort und gibt Daten zurück
    return json_decode($response, true);
}

// Liste der Länder-Codes (Beispiele)
$countries = ['ch', 'de', 'fr', 'at', 'it']; // Hier kannst du die verfügbaren Länder-Codes ergänzen

// Schleife über alle Länder und Daten abrufen
foreach ($countries as $countryCode) {
    echo "Daten für Land: $countryCode\n";
    $data = fetchPowerData($countryCode);

    // Überprüfen, ob Daten abgerufen wurden
    if ($data) {
        // Daten anzeigen oder weiterverarbeiten
        var_dump($data);
    } else {
        echo "Fehler beim Abrufen der Daten für $countryCode\n";
    }
}

?>
