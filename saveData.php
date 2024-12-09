<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit;
}

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "No data received"]);
    exit;
}

$name = $data["name"] ?? "";
$motherName = $data["motherName"] ?? "";
$dob = $data["dob"] ?? "";
$contact = $data["contact"] ?? "";

// Validate input
if (empty($name) || empty($motherName) || empty($dob) || empty($contact)) {
    echo json_encode(["status" => "error", "message" => "All fields are required"]);
    exit;
}

// Check for duplicates in the CSV file
$file = "DataBase.csv";
$isDuplicate = false;

if (($handle = fopen($file, "r")) !== false) {
    $rowCount = 0;

    // Count only valid rows (skip empty rows and headers)
    while (($row = fgetcsv($handle)) !== false) {
        if (!empty(array_filter($row))) { // Ensure the row is not empty
            $rowCount++;
        }
    }
    fclose($handle);

    // Calculate the new index (exclude the header row)
    $newIndex = $rowCount; // The new row will have this index
} else {
    $newIndex = 1; // Start with 1 if the file doesn't exist or is empty
}

if (($handle = fopen($file, "a")) !== false) {
    // Save in the correct order: dob, mother's name, name, # (index), contact
    fputcsv($handle, [$dob, $motherName, $name, $newIndex, $contact]);
    fclose($handle);

    // Return a success JSON response
    echo json_encode(["status" => "success", "message" => "Data added successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Unable to open file"]);
}


?>
