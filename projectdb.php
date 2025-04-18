<?php
session_start();
$host = 'localhost';
$dbname = 'projectdb'; 
$username = 'root';
$password = ''; 

$conn = mysqli_connect($host, $username, $password, $dbname);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

header('Content-Type: application/json');

if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    echo json_encode(['loggedin' => true]);
} else {
    echo json_encode(['loggedin' => false]);
}
?>