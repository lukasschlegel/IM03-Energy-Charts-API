<?php

require_once 'config.php';

header('Content-Type: application/json');

try {
    $pdo = new PDO($dsn, $username, $password, $options);

    $allowedCountries = ['ch', 'it', 'de', 'fr', 'at', 'es', 'pt', 'gb', 'gr'];

    if (!isset($_GET['country']) || empty($_GET['country'])) {
        echo json_encode(['error' => 'Country parameter is missing']);
        exit();
    }

    $countryCode = strtolower($_GET['country']);

    if (!in_array($countryCode, $allowedCountries)) {
        echo json_encode(['error' => 'Invalid country code']);
        exit();
    }

    $stmt = $pdo->prepare("
        SELECT 
            country,
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
            price,
            timestamp
        FROM Energy_Charts_API
        WHERE LOWER(country) = :country -- Vergleiche Kleinbuchstaben
        ORDER BY timestamp DESC
    ");

    $stmt->execute([':country' => $countryCode]);

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($results) {
        echo json_encode([$countryCode => $results]);
    } else {
        echo json_encode(['error' => 'Keine Daten für dieses Land gefunden']);
    }

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

?>
