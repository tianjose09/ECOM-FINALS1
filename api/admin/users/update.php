<?php

require_once __DIR__ . '/../require_admin.php';
require_once __DIR__ . '/../../../utils/database.utils.php';
require_once __DIR__ . '/../../helpers/response.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['success' => false, 'message' => 'Invalid request method.'], 405);
    }

    $id = (int) ($_GET['id'] ?? 0);

    if ($id <= 0) {
        jsonResponse(['success' => false, 'message' => 'Invalid user ID.'], 422);
    }

    $input = json_decode(file_get_contents('php://input'), true);

    $name = trim($input['name'] ?? '');
    $password = trim($input['password'] ?? '');
    $role = trim($input['role'] ?? 'customer');

    if ($name === '') {
        jsonResponse(['success' => false, 'message' => 'Username is required.'], 422);
    }

    if (!in_array($role, ['customer', 'admin'], true)) {
        jsonResponse(['success' => false, 'message' => 'Invalid role.'], 422);
    }

    global $conn;

    $checkStmt = $conn->prepare("SELECT id FROM users WHERE name = ? AND id <> ? LIMIT 1");
    $checkStmt->bind_param('si', $name, $id);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows > 0) {
        jsonResponse(['success' => false, 'message' => 'Username already exists.'], 409);
    }

    if ($password !== '') {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("UPDATE users SET name = ?, password = ?, role = ? WHERE id = ?");
        $stmt->bind_param('sssi', $name, $hashedPassword, $role, $id);
    } else {
        $stmt = $conn->prepare("UPDATE users SET name = ?, role = ? WHERE id = ?");
        $stmt->bind_param('ssi', $name, $role, $id);
    }

    if (!$stmt->execute()) {
        throw new Exception('Update failed: ' . $stmt->error);
    }

    jsonResponse([
        'success' => true,
        'message' => 'User updated successfully.'
    ]);
} catch (Throwable $e) {
    jsonResponse([
        'success' => false,
        'message' => $e->getMessage()
    ], 500);
}