<?php

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../../utils/database.utils.php';

try {
    global $conn;

    if (!isset($conn) || $conn->connect_error) {
        throw new Exception('Database connection failed.');
    }

    $products = [];
    $categories = ['drinks', 'pasta', 'pastry'];

    foreach ($categories as $category) {
        $stmt = $conn->prepare("
            SELECT id, name, category, price, description, image_path
            FROM products
            WHERE category = ?
            ORDER BY RAND()
            LIMIT 2
        ");
        $stmt->bind_param('s', $category);
        $stmt->execute();
        $result = $stmt->get_result();

        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
    }

    jsonResponse([
        'success' => true,
        'products' => $products
    ]);
} catch (Throwable $e) {
    jsonResponse([
        'success' => false,
        'message' => $e->getMessage()
    ], 500);
}