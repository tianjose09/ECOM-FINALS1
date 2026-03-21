<?php

require_once __DIR__ . '/../require_admin.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../../utils/database.utils.php';

try {
    $id = (int)($_GET['id'] ?? 0);

    if ($id <= 0) {
        jsonResponse(['success' => false, 'message' => 'Invalid product id.'], 422);
    }

    global $conn;
    $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();

    jsonResponse(['success' => true, 'message' => 'Product deleted.']);
} catch (Throwable $e) {
    jsonResponse(['success' => false, 'message' => $e->getMessage()], 500);
}