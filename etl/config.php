<?php

$host = 'etl.benhan51.dbs.hostpoint.internal';
$dbname = 'benhan51_etl';
$username = 'benhan51_etl';
$password = 'MMP2024_fhgr_etl_zuerich';

$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

?>