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
        return null; // Rückgabe von null, wenn die API nicht erreichbar ist
    }

    // Schließt die cURL-Sitzung
    curl_close($ch);

    // Dekodiert die JSON-Antwort und gibt Daten zurück
    return json_decode($response, true);
}

// Funktion zum Abrufen der Preisdaten für ein bestimmtes Land
function fetchPriceData($countryCode) {
    $url = "https://api.energy-charts.info/price?country=" . $countryCode;

    // Initialisiert eine cURL-Sitzung
    $ch = curl_init($url);

    // Setzt Optionen
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FAILONERROR, true); // cURL gibt Fehler zurück, wenn etwas schief geht

    // Führt die cURL-Sitzung aus und erhält den Inhalt
    $response = curl_exec($ch);

    // Fehlerüberprüfung für cURL
    if (curl_errno($ch)) {
        return null; // Rückgabe von null, wenn die API nicht erreichbar ist
    }

    // Schließt die cURL-Sitzung
    curl_close($ch);

    // Dekodiert die JSON-Antwort und gibt Daten zurück
    return json_decode($response, true);
}

// Liste der Länder
$countries = ['ch', 'it', 'de', 'fr', 'at', 'es', 'pt', 'gb', 'gr'];

$biddingZones = ['CH','IT-North', 'DE-LU', 'FR', 'AT', 'ES', 'PT', 'GB', 'GR'];

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
    country,
    price
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
    :country,
    :price
)";

$stmt = $pdo->prepare($sql);

// Schleife über alle Länder
foreach ($countries as $countryCode) {
    echo "Daten für Land: <strong>$countryCode</strong>\n";

    // Initialisiere Standardwerte als null
    $productionData = [
        'Crossborderelectricitytrading' => null,
        'nuclear' => null,
        'HydroRunofRiver' => null,
        'Hydrowaterreservoir' => null,
        'Hydropumpedstorage' => null,
        'Windonshore' => null,
        'Solar' => null,
        'Residualload' => null,
        'Renewableshareofgeneration' => null,
        'Renewableshareofload' => null
    ];

    // Abrufen der Stromerzeugungsdaten
    try {
        $data = fetchPowerData($countryCode);
        if ($data && isset($data['unix_seconds'])) {
            $latestIndex = count($data['unix_seconds']) - 1;

            // Setze die Daten nur, wenn die Stromproduktionsdaten erfolgreich abgerufen wurden
            $productionData['Crossborderelectricitytrading'] = $data['production_types'][0]['data'][$latestIndex] ?? null;
            $productionData['nuclear'] = $data['production_types'][1]['data'][$latestIndex] ?? null;
            $productionData['HydroRunofRiver'] = $data['production_types'][2]['data'][$latestIndex] ?? null;
            $productionData['Hydrowaterreservoir'] = $data['production_types'][3]['data'][$latestIndex] ?? null;
            $productionData['Hydropumpedstorage'] = $data['production_types'][4]['data'][$latestIndex] ?? null;
            $productionData['Windonshore'] = $data['production_types'][5]['data'][$latestIndex] ?? null;
            $productionData['Solar'] = $data['production_types'][6]['data'][$latestIndex] ?? null;
            $productionData['Residualload'] = $data['production_types'][7]['data'][$latestIndex] ?? null;
            $productionData['Renewableshareofgeneration'] = $data['production_types'][8]['data'][$latestIndex] ?? null;
            $productionData['Renewableshareofload'] = $data['production_types'][9]['data'][$latestIndex] ?? null;

            echo "<li>Alle Produktionsdaten erfolgreich für $countryCode abgerufen.</li>\n";
        } else {
            echo "<li>Einige oder alle Produktionsdaten konnten für $countryCode nicht abgerufen werden.</li>\n";
        }
    } catch (Exception $e) {
        echo "<li>Fehler beim Abrufen der Stromproduktionsdaten für $countryCode: " . $e->getMessage() . "</li>\n";
    }

    // Abrufen der Preisdaten
    try {
        $priceData = fetchPriceData($countryCode);
        if ($priceData && isset($priceData['price'])) {
            $latestPrice = $priceData['price'][count($priceData['price']) - 1] ?? null;
            echo "<li>Preisdaten erfolgreich für $countryCode abgerufen.</li>\n";
        } else {
            echo "<li>Preisdaten konnten für $countryCode nicht abgerufen werden.</li>\n";
            $latestPrice = null;
        }
    } catch (Exception $e) {
        echo "<li>Fehler beim Abrufen der Preisdaten für $countryCode: " . $e->getMessage() . "</li>\n";
        $latestPrice = null;
    }

    // Daten in die Datenbank einfügen, selbst wenn keine Produktionsdaten vorhanden sind
    if ($stmt->execute([
        ':Crossborderelectricitytrading' => $productionData['Crossborderelectricitytrading'],
        ':nuclear' => $productionData['nuclear'],
        ':HydroRunofRiver' => $productionData['HydroRunofRiver'],
        ':Hydrowaterreservoir' => $productionData['Hydrowaterreservoir'],
        ':Hydropumpedstorage' => $productionData['Hydropumpedstorage'],
        ':Windonshore' => $productionData['Windonshore'],
        ':Solar' => $productionData['Solar'],
        ':Residualload' => $productionData['Residualload'],
        ':Renewableshareofgeneration' => $productionData['Renewableshareofgeneration'],
        ':Renewableshareofload' => $productionData['Renewableshareofload'],
        ':country' => $countryCode,  // Länderkürzel hinzufügen
        ':price' => $latestPrice
    ])) {
        echo "<li>Alle Daten für $countryCode erfolgreich in die Datenbank eingefügt.</li></ul><br>\n";
    } else {
        echo "<li>Fehler beim Einfügen der Daten für $countryCode in die Datenbank.</li></ul><br>\n";
    }
}
?>
