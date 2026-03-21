<?php

require_once __DIR__ . '/../require_admin.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../../utils/database.utils.php';

try {
    $id = (int)($_GET['id'] ?? 0);
    $input = json_decode(file_get_contents('php://input'), true);

    $name = trim($input['name'] ?? '');
    $category = trim($input['category'] ?? '');
    $price = (float)($input['price'] ?? 0);
    $availability = (int)($input['availability'] ?? 1);
    $description = trim($input['description'] ?? '');
    $imagePath = trim($input['image_path'] ?? '');

    if ($id <= 0 || $name === '' || !in_array($category, ['drinks', 'pastry', 'pasta'], true) || $price < 0) {
        jsonResponse(['success' => false, 'message' => 'Invalid product data.'], 422);
    }

    global $conn;
    $stmt = $conn->prepare("
        UPDATE products
        SET name = ?, category = ?, price = ?, availability = ?, description = ?, image_path = ?
        WHERE id = ?
    ");
    $stmt->bind_param('ssdissi', $name, $category, $price, $availability, $description, $imagePath, $id);
    $stmt->execute();

    jsonResponse(['success' => true, 'message' => 'Product updated.']);
} catch (Throwable $e) {
    jsonResponse(['success' => false, 'message' => $e->getMessage()], 500);
}