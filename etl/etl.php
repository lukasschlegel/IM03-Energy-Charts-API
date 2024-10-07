<?php
require_once 'config.php';

// Funktion zum Abrufen der Daten für ein bestimmtes Land
function fetchPowerData($countryCode) {
    $url = "https://api.energy-charts.info/public_power?country=" . $countryCode;

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
$countries = ['ch', 'it', 'de', 'fr', 'at'];

// Establish database connection
try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// SQL-Befehl vorbereiten (eine Zeile pro Land)
$sql = "INSERT INTO Energy_Charts_API (
    Crossborderelectricitytrading,
    nuclear,
    HydroRunofRiver,
    Hydrowaterreservoir,
    Hydropumpedstorage,
    Windonshore,
    Solar,
    Residualload,
    Renewableshareofgeneration,
    Renewableshareofload,
    country
) VALUES (
    :Crossborderelectricitytrading,
    :nuclear,
    :HydroRunofRiver,
    :Hydrowaterreservoir,
    :Hydropumpedstorage,
    :Windonshore,
    :Solar,
    :Residualload,
    :Renewableshareofgeneration,
    :Renewableshareofload,
    :country
)";

$stmt = $pdo->prepare($sql);

// Schleife über alle Länder
foreach ($countries as $countryCode) {
    echo "Daten für Land: $countryCode\n";

    $data = fetchPowerData($countryCode);

    // Überprüfen, ob Daten abgerufen wurden
    if ($data) {
        // Es wird nur die aktuelle Zeit (letzter Eintrag) abgerufen
        $latestIndex = count($data['unix_seconds']) - 1;

        // Nur die neuesten Daten für jedes Land werden eingefügt (eine Zeile pro Land)
        $stmt->execute([
            ':Crossborderelectricitytrading' => $data['production_types'][0]['data'][$latestIndex], 
            ':nuclear' => $data['production_types'][1]['data'][$latestIndex],                     
            ':HydroRunofRiver' => $data['production_types'][2]['data'][$latestIndex],                 
            ':Hydrowaterreservoir' => $data['production_types'][3]['data'][$latestIndex],              
            ':Hydropumpedstorage' => $data['production_types'][4]['data'][$latestIndex],  
            ':Windonshore' => $data['production_types'][5]['data'][$latestIndex],  
            ':Solar' => $data['production_types'][6]['data'][$latestIndex],                             
            ':Residualload' => $data['production_types'][7]['data'][$latestIndex],
            ':Renewableshareofgeneration' => $data['production_types'][8]['data'][$latestIndex],    
            ':Renewableshareofload' => $data['production_types'][9]['data'][$latestIndex],
            ':country' => $countryCode  // Länderkürzel hinzufügen  
        ]);

        echo "Daten für $countryCode erfolgreich in die Datenbank eingefügt.\n";
    } else {
        echo "Keine Daten für $countryCode erhalten oder Fehler bei der API-Abfrage.\n";
    }
}

echo "Daten erfolgreich in die Datenbank eingefügt.\n";

?>
