<?php

require_once __DIR__ . '/../require_admin.php';
require_once __DIR__ . '/../../../utils/database.utils.php';
require_once __DIR__ . '/../../helpers/response.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['success' => false, 'message' => 'Invalid request method.'], 405);
    }

    $input = json_decode(file_get_contents('php://input'), true);

    $name = trim($input['name'] ?? '');
    $password = trim($input['password'] ?? '');
    $role = trim($input['role'] ?? 'customer');

    if ($name === '' || $password === '') {
        jsonResponse(['success' => false, 'message' => 'Username and password are required.'], 422);
    }

    if (!in_array($role, ['customer', 'admin'], true)) {
        jsonResponse(['success' => false, 'message' => 'Invalid role.'], 422);
    }

    global $conn;

    $checkStmt = $conn->prepare("SELECT id FROM users WHERE name = ? LIMIT 1");
    $checkStmt->bind_param('s', $name);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows > 0) {
        jsonResponse(['success' => false, 'message' => 'Username already exists.'], 409);
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO users (name, password, role) VALUES (?, ?, ?)");
    $stmt->bind_param('sss', $name, $hashedPassword, $role);

    if (!$stmt->execute()) {
        throw new Exception('Create failed: ' . $stmt->error);
    }

    jsonResponse([
        'success' => true,
        'message' => 'User created successfully.'
    ]);
} catch (Throwable $e) {
    jsonResponse([
        'success' => false,
        'message' => $e->getMessage()
    ], 500);
}