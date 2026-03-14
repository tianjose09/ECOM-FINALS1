<?php
$host = "localhost";
$dbname = "brewha_db";
$username = "root";
$password = "";

// Create connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    error_log("Database connection failed: " . $conn->connect_error);
    $conn = null;
} else {
    // Set charset to UTF-8
    $conn->set_charset("utf8");
}

// Function to check connection
function is_db_connected() {
    global $conn;
    return isset($conn) && $conn && !$conn->connect_error;
}
?>