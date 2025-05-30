<?php
// Handles adding new stations
header('Content-Type: application/json');

$xmlFilePath = __DIR__ . '/../../data/pacifica_affiliates.xml';
$response = ['status' => 'error', 'message' => 'An unknown error occurred.'];

// Get the JSON data from the request body
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE); //convert JSON into array

if ($input && isset($input['title'], $input['link'], $input['description'])) {
    $title = htmlspecialchars($input['title'], ENT_XML1, 'UTF-8');
    $link = htmlspecialchars($input['link'], ENT_XML1, 'UTF-8');
    $description = htmlspecialchars($input['description'], ENT_XML1, 'UTF-8');

    if (file_exists($xmlFilePath)) {
        $xml = simplexml_load_file($xmlFilePath);
        if ($xml !== false && isset($xml->channel)) {
            $newItem = $xml->channel->addChild('item');
            $newItem->addChild('title', $title);
            $newItem->addChild('link', $link);
            $newItem->addChild('description', $description);

            // Format XML for readability
            $dom = new DOMDocument('1.0');
            $dom->preserveWhiteSpace = false;
            $dom->formatOutput = true;
            $dom->loadXML($xml->asXML());

            if ($dom->save($xmlFilePath)) {
                $response = ['status' => 'success', 'message' => 'Station added successfully.'];
            } else {
                $response['message'] = 'Failed to save XML file.';
            }
        } else {
            $response['message'] = 'Failed to load or parse XML file, or channel missing.';
        }
    } else {
        $response['message'] = 'XML file not found.';
    }
} else {
    $response['message'] = 'Invalid input data. Title, link, and description are required.';
}

echo json_encode($response);
