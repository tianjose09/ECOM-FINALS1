<?php

require_once __DIR__ . '/../helpers/response.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/../../utils/database.utils.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse([
            'success' => false,
            'message' => 'Invalid request method.'
        ], 405);
    }

    $input = json_decode(file_get_contents('php://input'), true);

    $name = trim($input['name'] ?? '');
    $password = trim($input['password'] ?? '');
    $confirmPassword = trim($input['confirmPassword'] ?? '');

    if ($name === '' || $password === '' || $confirmPassword === '') {
        jsonResponse([
            'success' => false,
            'message' => 'Please fill in all fields.'
        ], 422);
    }

    if (strlen($name) < 3) {
        jsonResponse([
            'success' => false,
            'message' => 'Username must be at least 3 characters long.'
        ], 422);
    }

    if (!preg_match('/^[A-Za-z0-9_]+$/', $name)) {
        jsonResponse([
            'success' => false,
            'message' => 'Username can only contain letters, numbers, and underscore.'
        ], 422);
    }

    if ($password !== $confirmPassword) {
        jsonResponse([
            'success' => false,
            'message' => 'Passwords do not match.'
        ], 422);
    }

    if (strlen($password) < 8) {
        jsonResponse([
            'success' => false,
            'message' => 'Password must be at least 8 characters long.'
        ], 422);
    }

    global $conn;

    if (!isset($conn) || $conn->connect_error) {
        throw new Exception('Database connection failed.');
    }

    $checkSql = "SELECT id FROM users WHERE name = ? LIMIT 1";
    $checkStmt = $conn->prepare($checkSql);

    if (!$checkStmt) {
        throw new Exception('Prepare failed: ' . $conn->error);
    }

    $checkStmt->bind_param('s', $name);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows > 0) {
        jsonResponse([
            'success' => false,
            'message' => 'Username is already registered.'
        ], 409);
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $insertSql = "INSERT INTO users (name, password, role) VALUES (?, ?, 'customer')";
    $insertStmt = $conn->prepare($insertSql);

    if (!$insertStmt) {
        throw new Exception('Prepare failed: ' . $conn->error);
    }

    $insertStmt->bind_param('ss', $name, $hashedPassword);

    if (!$insertStmt->execute()) {
        throw new Exception('Insert failed: ' . $insertStmt->error);
    }

    jsonResponse([
        'success' => true,
        'message' => 'Registration successful.'
    ]);
} catch (Throwable $e) {
    jsonResponse([
        'success' => false,
        'message' => $e->getMessage()
    ], 500);
}