<?php

$host = '127.0.0.1';
$port = '3306';
$dbname = 'brewha_db';
$username = 'root';
$password = '';

$conn = new mysqli($host, $username, $password, $dbname, (int)$port);

if ($conn->connect_error) {
    die('Database connection failed: ' . $conn->connect_error);
}

$conn->set_charset('utf8mb4');