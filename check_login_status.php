<?php
header('Content-Type: application/json');

session_start();
$response = ['loggedin' => false];

try {
    if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
        $response['loggedin'] = true;
    }
} catch (Exception $e) {
    $response['error'] = 'An error occurred.';
}

echo json_encode($response);
?>