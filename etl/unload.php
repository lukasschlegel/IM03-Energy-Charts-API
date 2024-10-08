<?php

require_once 'config.php'; // Stellen Sie sicher, dass dies auf Ihre tatsächliche Konfigurationsdatei verweist

header('Content-Type: application/json');

try {
    $pdo = new PDO($dsn, $username, $password, $options);

    // Liste der erlaubten Länderkürzel (in Kleinbuchstaben)
    $allowedCountries = ['ch', 'it', 'de', 'fr', 'at', 'es', 'pt', 'gb', 'gr'];

    // Überprüfen, ob der Parameter 'country' übergeben wurde
    if (!isset($_GET['country']) || empty($_GET['country'])) {
        echo json_encode(['error' => 'Country parameter is missing']);
        exit();
    }

    // Hole den übergebenen countryCode und konvertiere ihn in Kleinbuchstaben
    $countryCode = strtolower($_GET['country']); // Alle Eingaben in Kleinbuchstaben umwandeln

    // Überprüfe, ob das Länderkürzel in der Liste der erlaubten Länderkürzel ist
    if (!in_array($countryCode, $allowedCountries)) {
        echo json_encode(['error' => 'Invalid country code']);
        exit();
    }

    // Bereitet eine SQL-Anfrage vor, um Produktionsdaten für das gesuchte Land zu holen
    // Vergleicht den country-Wert in Kleinbuchstaben in der Datenbank
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

    // Führt die vorbereitete Anfrage mit dem Länderkürzel als Parameter aus
    $stmt->execute([':country' => $countryCode]); // Kleinbuchstaben für DB-Konsistenz

    // Hole die Ergebnisse
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($results) {
        // Gibt die Produktionsdaten für das gesuchte Land im JSON-Format aus
        echo json_encode([$countryCode => $results]);
    } else {
        // Falls keine Daten für das Land gefunden wurden, gibt eine Fehlermeldung zurück
        echo json_encode(['error' => 'No data found for this country']);
    }

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]); // Gibt einen Fehler im JSON-Format aus, falls eine Ausnahme auftritt
}
?>
