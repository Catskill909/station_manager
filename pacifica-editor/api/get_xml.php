<?php
header('Content-Type: application/xml');
header('Access-Control-Allow-Origin: *');
$xmlPath = __DIR__ . '/../data/pacifica_affiliates.xml';

if (file_exists($xmlPath)) {
    readfile($xmlPath);
} else {
    header('HTTP/1.1 404 Not Found');
    echo '<?xml version="1.0" encoding="UTF-8"?><error>XML file not found</error>';
}
?>
