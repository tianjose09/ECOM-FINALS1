<?php
require_once __DIR__ . '/../utils/database.utils.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/response.php';

$userId = getCurrentUserId();
$input = json_decode(file_get_contents("php://input"), true);

$itemId = (int)($input["item_id"] ?? 0);

if ($itemId <= 0) {
    jsonResponse(["success" => false, "error" => "Invalid cart item ID"], 400);
}

try {
    $stmt = $pdo->prepare("
        DELETE ci FROM cart_items ci
        INNER JOIN carts c ON c.id = ci.cart_id
        WHERE ci.id = ? AND c.user_id = ? AND c.status = 'active'
    ");
    $stmt->execute([$itemId, $userId]);

    jsonResponse([
        "success" => true,
        "message" => "Item removed"
    ]);
} catch (Throwable $e) {
    jsonResponse([
        "success" => false,
        "error" => $e->getMessage()
    ], 500);
}