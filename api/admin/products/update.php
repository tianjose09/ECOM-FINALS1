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

    $input = json_decode(file_get_contents('php://input'), true);

    $name = trim($input['name'] ?? '');
    $category = trim($input['category'] ?? '');
    $price = (float) ($input['price'] ?? 0);
    $availability = (int) ($input['availability'] ?? 1);
    $description = trim($input['description'] ?? '');
    $imagePath = trim($input['image_path'] ?? '');

    if ($name === '' || $category === '' || $price <= 0) {
        jsonResponse(['success' => false, 'message' => 'Please provide valid product details.'], 422);
    }

    global $conn;

    $stmt = $conn->prepare("
        UPDATE products
        SET name = ?, category = ?, price = ?, availability = ?, description = ?, image_path = ?
        WHERE id = ?
    ");

    if (!$stmt) {
        throw new Exception('Prepare failed: ' . $conn->error);
    }

    $stmt->bind_param('ssdissi', $name, $category, $price, $availability, $description, $imagePath, $id);

    if (!$stmt->execute()) {
        throw new Exception('Update failed: ' . $stmt->error);
    }

    jsonResponse([
        'success' => true,
        'message' => 'Product updated successfully.'
    ]);
} catch (Throwable $e) {
    jsonResponse([
        'success' => false,
        'message' => $e->getMessage()
    ], 500);
}