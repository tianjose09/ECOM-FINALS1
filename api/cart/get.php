<?php
require_once __DIR__ . '/../utils/database.utils.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/response.php';

$userId = getCurrentUserId();

try {
    $stmt = $pdo->prepare("
        SELECT id
        FROM carts
        WHERE user_id = ? AND status = 'active'
        ORDER BY id DESC
        LIMIT 1
    ");
    $stmt->execute([$userId]);
    $cart = $stmt->fetch();

    if (!$cart) {
        jsonResponse([
            "success" => true,
            "cart" => [],
            "count" => 0
        ]);
    }

    $stmt = $pdo->prepare("
        SELECT
            ci.id,
            ci.product_id,
            ci.product_name AS name,
            ci.category,
            ci.image AS img,
            ci.base_price,
            ci.unit_price AS price,
            ci.quantity AS qty,
            ci.size,
            ci.pieces,
            ci.notes
        FROM cart_items ci
        WHERE ci.cart_id = ?
        ORDER BY ci.id ASC
    ");
    $stmt->execute([$cart["id"]]);
    $items = $stmt->fetchAll();

    foreach ($items as &$item) {
        $item["id"] = (int)$item["id"];
        $item["product_id"] = (int)$item["product_id"];
        $item["base_price"] = (float)$item["base_price"];
        $item["price"] = (float)$item["price"];
        $item["qty"] = (int)$item["qty"];
        $item["pieces"] = $item["pieces"] !== null ? (int)$item["pieces"] : null;
        $item["addons"] = $item["notes"] ? [$item["notes"]] : [];
    }

    $count = array_sum(array_map(fn($i) => (int)$i["qty"], $items));

    jsonResponse([
        "success" => true,
        "cart" => $items,
        "count" => $count
    ]);
} catch (Throwable $e) {
    jsonResponse([
        "success" => false,
        "error" => $e->getMessage()
    ], 500);
}