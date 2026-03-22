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

    if ((int) ($_SESSION['user_id'] ?? 0) === $id) {
        jsonResponse(['success' => false, 'message' => 'You cannot delete your own admin account.'], 422);
    }

    global $conn;

    $checkStmt = $conn->prepare("SELECT role FROM users WHERE id = ? LIMIT 1");
    $checkStmt->bind_param('i', $id);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    $user = $result->fetch_assoc();

    if (!$user) {
        jsonResponse(['success' => false, 'message' => 'User not found.'], 404);
    }

    if (($user['role'] ?? '') === 'admin') {
        jsonResponse(['success' => false, 'message' => 'Deleting admin users is blocked here.'], 403);
    }

    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param('i', $id);

    if (!$stmt->execute()) {
        throw new Exception('Delete failed: ' . $stmt->error);
    }

    jsonResponse([
        'success' => true,
        'message' => 'User deleted successfully.'
    ]);
} catch (Throwable $e) {
    jsonResponse([
        'success' => false,
        'message' => $e->getMessage()
    ], 500);
}