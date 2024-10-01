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
$countries = ['ch'];
// , 'eu', 'all', 'al', 'am', 'at', 'az', 'ba', 'be', 'bg', 'by', 'cy', 'cz', 'dk', 'ee', 'es', 'fi', 'fr', 'ge', 'gr', 'hr', 'hu', 'ie', 'it', 'lt', 'lu', 'lv', 'md', 'me', 'mk', 'mt', 'nie', 'nl', 'no', 'pl', 'pt', 'ro', 'rs', 'ru', 'se', 'sl', 'sk', 'tr', 'ua', 'uk', 'xk'


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

var_dump($data);

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
        ':Crossborderelectricitytrading' => $data['production_types'][0]['data'][$i], // Cross border electricity trading
        ':nuclear' => $data['production_types'][1]['data'][$i],                     // Nuclear
        ':HydroRunofRiver' => $data['production_types'][2]['data'][$i],                 // Hydro Run-of-River
        ':Hydrowaterreservoir' => $data['production_types'][3]['data'][$i],              // Hydro water reservoir
        ':Hydropumpedstorage' => $data['production_types'][4]['data'][$i],  
        ':Windonshore' =>1,                     // Wind onshore
        ':Solar' => 1,                           // Solar
        ':Residualload' => 1,                    // Residual load
        ':Renewableshareofgeneration' => 1,      // Renewable share of generation
        ':Renewableshareofload' => 1,           // Renewable share of load
    ]);
    /*$stmt->execute([
        ':Crossborderelectricitytrading' => $data['production_types'][0]['data'][$i], // Cross border electricity trading
        ':nuclear' => $data['production_types'][1]['data'][$i],                        // Nuclear
        ':HydroRunofRiver' => $data['production_types'][2]['data'][$i],                 // Hydro Run-of-River
        ':Hydrowaterreservoir' => $data['production_types'][3]['data'][$i],             // Hydro water reservoir
        ':Hydropumpedstorage' => $data['production_types'][4]['data'][$i],              // Hydro pumped storage
        ':Windonshore' => $data['production_types'][5]['data'][$i],                     // Wind onshore
        ':Solar' => $data['production_types'][6]['data'][$i],                           // Solar
        ':Residualload' => $data['production_types'][8]['data'][$i],                    // Residual load
        ':Renewableshareofgeneration' => $data['production_types'][9]['data'][$i],      // Renewable share of generation
        ':Renewableshareofload' => $data['production_types'][10]['data'][$i],           // Renewable share of load
    ]);*/
    echo 'success';
}

/*$stmt->execute([
    ':Crossborderelectricitytrading' => 1, // Cross border electricity trading
    ':nuclear' => 1,                        // Nuclear
    ':HydroRunofRiver' => 1,                 // Hydro Run-of-River
    ':Hydrowaterreservoir' => 1,             // Hydro water reservoir
    ':Hydropumpedstorage' => 1,              // Hydro pumped storage
    ':Windonshore' =>1,                     // Wind onshore
    ':Solar' => 1,                           // Solar
    ':Residualload' => 1,                    // Residual load
    ':Renewableshareofgeneration' => 1,      // Renewable share of generation
    ':Renewableshareofload' => 1,           // Renewable share of load
]);*/

echo "Daten erfolgreich in die Datenbank eingefügt.\n";

?>
