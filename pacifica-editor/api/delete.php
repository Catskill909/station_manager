<?php
// Handles deleting stations
header('Content-Type: application/json');

$xmlFilePath = __DIR__ . '/../data/pacifica_affiliates.xml'; // Path to XML in data folder
$response = ['status' => 'error', 'message' => 'An unknown error occurred.'];

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

if ($input && isset($input['title'])) {
    $titleToDelete = $input['title']; // No htmlspecialchars needed for comparison

    if (file_exists($xmlFilePath)) {
        $xml = simplexml_load_file($xmlFilePath);
        $itemFound = false;
        $itemIndex = 0;
        if ($xml !== false && isset($xml->channel->item)) {
            foreach ($xml->channel->item as $item) {
                if ((string)$item->title === $titleToDelete) {
                    unset($xml->channel->item[$itemIndex]);
                    $itemFound = true;
                    break;
                }
                $itemIndex++;
            }

            if ($itemFound) {
                $dom = new DOMDocument('1.0');
                $dom->preserveWhiteSpace = false;
                $dom->formatOutput = true;
                $dom->loadXML($xml->asXML());
                if ($dom->save($xmlFilePath)) {
                    $response = ['status' => 'success', 'message' => 'Station deleted successfully.'];
                } else {
                    $response['message'] = 'Failed to save XML file after deletion.';
                }
            } else {
                $response['message'] = 'Station with the specified title not found.';
            }
        } else {
            $response['message'] = 'Failed to load or parse XML file, or no items found.';
        }
    } else {
        $response['message'] = 'XML file not found at: ' . realpath(dirname($xmlFilePath)) . '/' . basename($xmlFilePath) . ' (Attempted: ' . $xmlFilePath . ')';
    }
} else {
    $response['message'] = 'Invalid input data. Title is required for deletion.';
}

echo json_encode($response);
