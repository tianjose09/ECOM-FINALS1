<?php

require_once __DIR__ . '/require_admin.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../../utils/database.utils.php';

try {
    global $conn;

    $products = [];
    $users = [];

    $productSql = "
        SELECT 
            p.id,
            p.name,
            p.category,
            p.price,
            p.availability,
            p.description,
            p.image_path,
            COUNT(oi.id) AS total_orders
        FROM products p
        LEFT JOIN order_items oi ON oi.product_id = p.id
        GROUP BY p.id, p.name, p.category, p.price, p.availability, p.description, p.image_path
        ORDER BY p.category, p.name
    ";
    $productResult = $conn->query($productSql);

    while ($row = $productResult->fetch_assoc()) {
        $products[] = $row;
    }

    $usersSql = "SELECT id, name, role FROM users ORDER BY role DESC, name ASC";
    $usersResult = $conn->query($usersSql);

    while ($user = $usersResult->fetch_assoc()) {
        $userId = (int)$user['id'];

        $ordersSql = "
            SELECT 
                oi.product_name,
                CONCAT(
                    oi.quantity,
                    ' | ',
                    COALESCE(NULLIF(oi.size, ''), CONCAT(COALESCE(oi.pieces, 1), ' pc'))
                ) AS qty_size,
                o.order_number
            FROM orders o
            INNER JOIN order_items oi ON oi.order_id = o.id
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC, oi.id DESC
        ";

        $ordersStmt = $conn->prepare($ordersSql);
        $ordersStmt->bind_param('i', $userId);
        $ordersStmt->execute();
        $ordersResult = $ordersStmt->get_result();

        $orders = [];
        while ($order = $ordersResult->fetch_assoc()) {
            $orders[] = $order;
        }

        $user['id'] = $userId;
        $user['orders'] = $orders;
        $users[] = $user;
    }

    jsonResponse([
        'success' => true,
        'selectedCategory' => 'drinks',
        'products' => $products,
        'users' => $users
    ]);
} catch (Throwable $e) {
    jsonResponse([
        'success' => false,
        'message' => $e->getMessage()
    ], 500);
}