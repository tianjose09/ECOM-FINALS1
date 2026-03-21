<?php

require_once __DIR__ . '/../require_admin.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../../utils/database.utils.php';

try {
    $id = (int)($_GET['id'] ?? 0);

    if ($id <= 0) {
        jsonResponse(['success' => false, 'message' => 'Invalid user id.'], 422);
    }

    global $conn;

    $check = $conn->prepare("SELECT role FROM users WHERE id = ? LIMIT 1");
    $check->bind_param('i', $id);
    $check->execute();
    $result = $check->get_result();

    if ($result->num_rows === 0) {
        jsonResponse(['success' => false, 'message' => 'User not found.'], 404);
    }

    $user = $result->fetch_assoc();

    if ($user['role'] === 'admin') {
        jsonResponse(['success' => false, 'message' => 'Cannot delete admin user here.'], 403);
    }

    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();

    jsonResponse(['success' => true, 'message' => 'User deleted.']);
} catch (Throwable $e) {
    jsonResponse(['success' => false, 'message' => $e->getMessage()], 500);
}