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
        jsonResponse(['success' => false, 'message' => 'Invalid product ID.'], 422);
    }

    global $conn;

    $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");

    if (!$stmt) {
        throw new Exception('Prepare failed: ' . $conn->error);
    }

    $stmt->bind_param('i', $id);

    if (!$stmt->execute()) {
        throw new Exception('Delete failed: ' . $stmt->error);
    }

    jsonResponse([
        'success' => true,
        'message' => 'Product deleted successfully.'
    ]);
} catch (Throwable $e) {
    jsonResponse([
        'success' => false,
        'message' => $e->getMessage()
    ], 500);
}