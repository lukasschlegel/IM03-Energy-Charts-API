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
$countries = ['ch', 'de', 'fr', 'it', 'at', 'se', 'no', 'fi', 'es', 'pt', 'ie', 'nl', 'be', 'lu'];
// , 


// Schleife über alle Länder
foreach ($countries as $countryCode) {
    echo "Daten für Land: $countryCode\n";

    $data = fetchPowerData($countryCode);

    // Überprüfen, ob Daten abgerufen wurden
    if ($data) {
        // var_dump($data['production_types']);
    } else {
        echo "Keine Daten für $countryCode erhalten oder Fehler bei der API-Abfrage.\n";
    }
}

// Establish database connection
try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
die("Connection failed: " . $e->getMessage());
}

// SQL-Befehl vorbereiten
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
    Renewableshareofload
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
    :Renewableshareofload
)";

$stmt = $pdo->prepare($sql);
// Daten einfügen (für jeden Timestamp)
for ($i = 0; $i < count($data['unix_seconds']); $i++) {
    $stmt->execute([
        ':Crossborderelectricitytrading' => $data['production_types'][0]['data'][$i], 
        ':nuclear' => $data['production_types'][1]['data'][$i],                     
        ':HydroRunofRiver' => $data['production_types'][2]['data'][$i],                 
        ':Hydrowaterreservoir' => $data['production_types'][3]['data'][$i],              
        ':Hydropumpedstorage' => $data['production_types'][4]['data'][$i],  
        ':Windonshore' => $data['production_types'][5]['data'][$i],  
        ':Solar' => $data['production_types'][6]['data'][$i],                             
        ':Residualload' => $data['production_types'][7]['data'][$i],
        ':Renewableshareofgeneration' => $data['production_types'][8]['data'][$i],    
        ':Renewableshareofload' => $data['production_types'][9]['data'][$i],           
    ]);
}

echo "Daten erfolgreich in die Datenbank eingefügt.\n";

?>
