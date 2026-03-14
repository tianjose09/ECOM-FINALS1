<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/response.php';

$userId = getCurrentUserId();
$input = json_decode(file_get_contents("php://input"), true);

$itemId = (int)($input["item_id"] ?? 0);
$qty = max(1, (int)($input["qty"] ?? 1));

if ($itemId <= 0) {
    jsonResponse(["success" => false, "error" => "Invalid cart item ID"], 400);
}

try {
    $stmt = $pdo->prepare("
        UPDATE cart_items ci
        INNER JOIN carts c ON c.id = ci.cart_id
        SET ci.quantity = ?, ci.updated_at = CURRENT_TIMESTAMP
        WHERE ci.id = ? AND c.user_id = ? AND c.status = 'active'
    ");
    $stmt->execute([$qty, $itemId, $userId]);

    jsonResponse([
        "success" => true,
        "message" => "Cart updated"
    ]);
} catch (Throwable $e) {
    jsonResponse([
        "success" => false,
        "error" => $e->getMessage()
    ], 500);
}