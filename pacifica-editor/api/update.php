<?php
// Handles editing existing stations
header('Content-Type: application/json');

$xmlFilePath = __DIR__ . '/../data/pacifica_affiliates.xml'; // Path to XML in data folder
$response = ['status' => 'error', 'message' => 'An unknown error occurred.'];

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

if ($input && isset($input['originalTitle'], $input['title'], $input['link'], $input['description'])) {
    $originalTitle = $input['originalTitle']; // No htmlspecialchars needed for comparison
    $newTitle = htmlspecialchars($input['title'], ENT_XML1, 'UTF-8');
    $newLink = htmlspecialchars($input['link'], ENT_XML1, 'UTF-8');
    $newDescription = htmlspecialchars($input['description'], ENT_XML1, 'UTF-8');

    if (file_exists($xmlFilePath)) {
        $xml = simplexml_load_file($xmlFilePath);
        $itemFound = false;
        if ($xml !== false && isset($xml->channel->item)) {
            foreach ($xml->channel->item as $item) {
                if ((string)$item->title === $originalTitle) {
                    $item->title = $newTitle;
                    $item->link = $newLink;
                    $item->description = $newDescription;
                    $itemFound = true;
                    break;
                }
            }

            if ($itemFound) {
                $dom = new DOMDocument('1.0');
                $dom->preserveWhiteSpace = false;
                $dom->formatOutput = true;
                $dom->loadXML($xml->asXML());
                if ($dom->save($xmlFilePath)) {
                    $response = ['status' => 'success', 'message' => 'Station updated successfully.'];
                } else {
                    $response['message'] = 'Failed to save XML file.';
                }
            } else {
                $response['message'] = 'Station with the original title not found.';
            }
        } else {
            $response['message'] = 'Failed to load or parse XML file, or no items found.';
        }
    } else {
        $response['message'] = 'XML file not found at: ' . realpath(dirname($xmlFilePath)) . '/' . basename($xmlFilePath) . ' (Attempted: ' . $xmlFilePath . ')';
    }
} else {
    $response['message'] = 'Invalid input data. Original title, new title, link, and description are required.';
}

echo json_encode($response);
