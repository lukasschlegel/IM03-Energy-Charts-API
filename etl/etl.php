<?php
require_once 'config.php';

function fetchPowerData($countryCode) {
    $url = "https://api.energy-charts.info/public_power?country=" . $countryCode;

    $ch = curl_init($url);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FAILONERROR, true);

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        return null;
    }

    curl_close($ch);

    return json_decode($response, true);
}

function fetchPriceData($countryCode) {
    $url = "https://api.energy-charts.info/price?country=" . $countryCode;

    $ch = curl_init($url);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FAILONERROR, true);

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        return null;
    }

    curl_close($ch);

    return json_decode($response, true);
}

$countries = ['ch', 'it', 'de', 'fr', 'at', 'es', 'pt', 'gb', 'gr'];

$biddingZones = ['CH','IT-North', 'DE-LU', 'FR', 'AT', 'ES', 'PT', 'GB', 'GR'];

try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

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

foreach ($countries as $countryCode) {
    echo "Daten für Land: <strong>$countryCode</strong>\n";

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

    try {
        $data = fetchPowerData($countryCode);
        if ($data && isset($data['unix_seconds'])) {
            $latestIndex = count($data['unix_seconds']) - 1;

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
            echo "<li><span style='color:red;'>Einige oder alle Produktionsdaten konnten für $countryCode nicht abgerufen werden.</span></li>\n";
        }
    } catch (Exception $e) {
        echo "<li><span style='color:red;'>Fehler beim Abrufen der Stromproduktionsdaten für $countryCode: " . $e->getMessage() . "</span></li>\n";
    }

    try {
        $priceData = fetchPriceData($countryCode);
        if ($priceData && isset($priceData['price'])) {
            $latestPrice = $priceData['price'][count($priceData['price']) - 1] ?? null;
            echo "<li>Preisdaten erfolgreich für $countryCode abgerufen.</li>\n";
        } else {
            echo "<li><span style='color:red;'>Preisdaten konnten für $countryCode nicht abgerufen werden.</span></li>\n";
            $latestPrice = null;
        }
    } catch (Exception $e) {
        echo "<li><span style='color:red;'>Fehler beim Abrufen der Preisdaten für $countryCode: " . $e->getMessage() . "</span></li>\n";
        $latestPrice = null;
    }

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
        ':country' => $countryCode,
        ':price' => $latestPrice
    ])) {
        echo "<li>Alle Daten für $countryCode erfolgreich in die Datenbank eingefügt.</li></ul><br>\n";
    } else {
        echo "<li><span style='color:red;'>Fehler beim Einfügen der Daten für $countryCode in die Datenbank.</span></li></ul><br>\n";
    }
}
?>
