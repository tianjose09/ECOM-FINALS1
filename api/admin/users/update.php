<?php

require_once __DIR__ . '/../require_admin.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../../utils/database.utils.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);

    $name = trim($input['name'] ?? '');
    $password = trim($input['password'] ?? '');
    $role = trim($input['role'] ?? 'customer');

    if ($name === '' || !in_array($role, ['admin', 'customer'], true) || $password === '') {
        jsonResponse(['success' => false, 'message' => 'Invalid user data.'], 422);
    }

    global $conn;

    $check = $conn->prepare("SELECT id FROM users WHERE name = ? LIMIT 1");
    $check->bind_param('s', $name);
    $check->execute();
    $exists = $check->get_result();

    if ($exists->num_rows > 0) {
        jsonResponse(['success' => false, 'message' => 'Username already exists.'], 409);
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO users (name, password, role) VALUES (?, ?, ?)");
    $stmt->bind_param('sss', $name, $hashedPassword, $role);
    $stmt->execute();

    jsonResponse(['success' => true, 'message' => 'User created.']);
} catch (Throwable $e) {
    jsonResponse(['success' => false, 'message' => $e->getMessage()], 500);
}