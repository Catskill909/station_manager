<?php
// Handles reading XML data
header('Content-Type: application/json');

$xmlFilePath = __DIR__ . '/../../data/pacifica_affiliates.xml';
$stations = [];

if (file_exists($xmlFilePath)) {
    $xml = simplexml_load_file($xmlFilePath);
    if ($xml !== false && isset($xml->channel->item)) {
        foreach ($xml->channel->item as $item) {
            $stations[] = [
                'title' => (string)$item->title,
                'link' => (string)$item->link,
                'description' => (string)$item->description
            ];
        }
    } else {
        // Log error or handle case where XML is invalid or items are missing
        // For now, return empty if structure is not as expected
    }
} else {
    // Log error or handle case where file doesn't exist
    // For now, return empty if file is missing
}

echo json_encode(['stations' => $stations]);
