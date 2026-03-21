<?php

require_once __DIR__ . '/../require_admin.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../../utils/database.utils.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);

    $name = trim($input['name'] ?? '');
    $category = trim($input['category'] ?? '');
    $price = (float)($input['price'] ?? 0);
    $availability = (int)($input['availability'] ?? 1);
    $description = trim($input['description'] ?? '');
    $imagePath = trim($input['image_path'] ?? '');

    if ($name === '' || !in_array($category, ['drinks', 'pastry', 'pasta'], true) || $price < 0) {
        jsonResponse(['success' => false, 'message' => 'Invalid product data.'], 422);
    }

    global $conn;
    $stmt = $conn->prepare("
        INSERT INTO products (name, category, price, availability, description, image_path)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param('ssdiss', $name, $category, $price, $availability, $description, $imagePath);
    $stmt->execute();

    jsonResponse(['success' => true, 'message' => 'Product created.']);
} catch (Throwable $e) {
    jsonResponse(['success' => false, 'message' => $e->getMessage()], 500);
}