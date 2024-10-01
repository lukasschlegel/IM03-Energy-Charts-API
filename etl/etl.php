<?php

// Funktion zum Abrufen der Daten für ein bestimmtes Land
function fetchPowerData($countryCode) {
    $url = "https://api.energy-charts.info/public_power?country=$countryCode";

    // Initialisiert eine cURL-Sitzung
    $ch = curl_init($url);

    // Setzt Optionen
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FAILONERROR, true); // cURL gibt Fehler zurück, wenn etwas schief geht

    // Führt die cURL-Sitzung aus und erhält den Inhalt
    $response = curl_exec($ch);

    // Fehlerüberprüfung für cURL
    if (curl_errno($ch)) {
        echo 'cURL-Fehler: ' . curl_error($ch);
    }

    // Schließt die cURL-Sitzung
    curl_close($ch);

    // Dekodiert die JSON-Antwort und gibt Daten zurück
    return json_decode($response, true);
}

// Liste der Länder
$countries = ['ch', 'eu', 'all', 'al', 'am', 'at', 'az', 'ba', 'be', 'bg', 'by', 'cy', 'cz', 'dk', 'ee', 'es', 'fi', 'fr', 'ge', 'gr', 'hr', 'hu', 'ie', 'it', 'lt', 'lu', 'lv', 'md', 'me', 'mk', 'mt', 'nie', 'nl', 'no', 'pl', 'pt', 'ro', 'rs', 'ru', 'se', 'sl', 'sk', 'tr', 'ua', 'uk', 'xk'];


// Schleife über alle Länder
foreach ($countries as $countryCode) {
    echo "Daten für Land: $countryCode\n";

    $data = fetchPowerData($countryCode);

    // Überprüfen, ob Daten abgerufen wurden
    if ($data) {
        var_dump($data['production_types']);
    } else {
        echo "Keine Daten für $countryCode erhalten oder Fehler bei der API-Abfrage.\n";
    }
}

?>

