<?php

require_once 'config.php'; // Stellen Sie sicher, dass dies auf Ihre tatsächliche Konfigurationsdatei verweist

header('Content-Type: application/json');

try {
    $pdo = new PDO($dsn, $username, $password, $options);

    // Liste der Länder, für die Daten abgerufen werden sollen
    $countries = ['CH', 'IT-North', 'DE-LU', 'FR', 'AT', 'ES', 'PT', 'GB', 'GR'];
    $results = [];

    foreach ($countries as $country) {
        // Bereitet eine SQL-Anfrage vor, um Produktionsdaten für ein bestimmtes Land zu holen, sortiert nach dem neuesten Datum
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
            WHERE country = :country
            ORDER BY timestamp DESC
        ");

        $stmt->execute([':country' => $country]); // Führt die vorbereitete Anfrage mit dem Länderkürzel als Parameter aus
        $results[$country] = $stmt->fetchAll(PDO::FETCH_ASSOC); // Speichert die Ergebnisse im Array $results
    }

    echo json_encode($results); // Gibt die Produktionsdaten im JSON-Format aus
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]); // Gibt einen Fehler im JSON-Format aus, falls eine Ausnahme auftritt
}
?>
