<?php

require_once __DIR__ . '/require_admin.php';
require_once __DIR__ . '/../../utils/database.utils.php';

try {
    global $conn;

    if (!isset($conn) || $conn->connect_error) {
        throw new Exception('Database connection failed.');
    }

    $products = [];
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
        GROUP BY
            p.id, p.name, p.category, p.price, p.availability, p.description, p.image_path
        ORDER BY p.category ASC, p.name ASC
    ";
    $productResult = $conn->query($productSql);

    if (!$productResult) {
        throw new Exception('Failed to fetch products: ' . $conn->error);
    }

    while ($row = $productResult->fetch_assoc()) {
        $products[] = [
            'id' => (int) $row['id'],
            'name' => $row['name'],
            'category' => $row['category'],
            'price' => (float) $row['price'],
            'availability' => (int) $row['availability'],
            'description' => $row['description'] ?? '',
            'image_path' => $row['image_path'] ?? '',
            'total_orders' => (int) $row['total_orders']
        ];
    }

    $users = [];
    $userSql = "SELECT id, name, role FROM users ORDER BY role DESC, name ASC";
    $userResult = $conn->query($userSql);

    if (!$userResult) {
        throw new Exception('Failed to fetch users: ' . $conn->error);
    }

    while ($user = $userResult->fetch_assoc()) {
        $userId = (int) $user['id'];

        $orders = [];
        $orderSql = "
            SELECT
                p.name AS product_name,
                CONCAT(
                    COALESCE(oi.quantity, 0),
                    ' | ',
                    COALESCE(NULLIF(oi.size, ''), '-')
                ) AS qty_size,
                COALESCE(o.order_number, CONCAT('ORD-', o.id)) AS order_number
            FROM orders o
            LEFT JOIN order_items oi ON oi.order_id = o.id
            LEFT JOIN products p ON p.id = oi.product_id
            WHERE o.user_id = ?
            ORDER BY o.id DESC, oi.id DESC
        ";
        $orderStmt = $conn->prepare($orderSql);

        if (!$orderStmt) {
            throw new Exception('Prepare failed: ' . $conn->error);
        }

        $orderStmt->bind_param('i', $userId);
        $orderStmt->execute();
        $orderResult = $orderStmt->get_result();

        while ($order = $orderResult->fetch_assoc()) {
            $orders[] = [
                'product_name' => $order['product_name'] ?? 'Unknown Product',
                'qty_size' => $order['qty_size'] ?? '-',
                'order_number' => $order['order_number'] ?? '-'
            ];
        }

        $users[] = [
            'id' => $userId,
            'name' => $user['name'],
            'role' => $user['role'],
            'orders' => $orders
        ];
    }

    jsonResponse([
        'success' => true,
        'products' => $products,
        'users' => $users
    ]);
} catch (Throwable $e) {
    jsonResponse([
        'success' => false,
        'message' => $e->getMessage()
    ], 500);
}