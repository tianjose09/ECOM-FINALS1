<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/response.php';

header('Content-Type: application/json');

$userId = getCurrentUserId();
$input = json_decode(file_get_contents("php://input"), true);

$productId = (int)($input["product_id"] ?? 0);
$size = trim($input["size"] ?? "");
$pieces = isset($input["pieces"]) ? (int)$input["pieces"] : null;
$notes = trim($input["notes"] ?? "");
$qty = max(1, (int)($input["qty"] ?? 1));

if ($productId <= 0) {
    jsonResponse(["success" => false, "error" => "Invalid product ID"], 400);
}

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        SELECT id, name, category, price, image, availability
        FROM products
        WHERE id = ?
        LIMIT 1
    ");
    $stmt->execute([$productId]);
    $product = $stmt->fetch();

    if (!$product) {
        $pdo->rollBack();
        jsonResponse(["success" => false, "error" => "Product not found"], 404);
    }

    if ($product["availability"] !== "Available") {
        $pdo->rollBack();
        jsonResponse(["success" => false, "error" => "Product is not available"], 400);
    }

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
        $stmt = $pdo->prepare("INSERT INTO carts (user_id, status) VALUES (?, 'active')");
        $stmt->execute([$userId]);
        $cartId = (int)$pdo->lastInsertId();
    } else {
        $cartId = (int)$cart["id"];
    }

    $basePrice = (float)$product["price"];
    $unitPrice = $basePrice;

    if ($product["category"] === "drinks") {
        if ($size === "Grande") {
            $unitPrice += 10;
        } elseif ($size === "Venti") {
            $unitPrice += 25;
        }
    }

    if ($product["category"] === "pastry" || $product["category"] === "pasta") {
        $pieces = $pieces && $pieces > 0 ? $pieces : 1;
        $unitPrice = $basePrice * $pieces;
    }

    $stmt = $pdo->prepare("
        SELECT id, quantity
        FROM cart_items
        WHERE cart_id = ?
          AND product_id = ?
          AND COALESCE(size, '') = COALESCE(?, '')
          AND COALESCE(pieces, 0) = COALESCE(?, 0)
          AND COALESCE(notes, '') = COALESCE(?, '')
        LIMIT 1
    ");
    $stmt->execute([$cartId, $productId, $size ?: null, $pieces, $notes ?: null]);
    $existing = $stmt->fetch();

    if ($existing) {
        $stmt = $pdo->prepare("
            UPDATE cart_items
            SET quantity = quantity + ?,
                unit_price = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ");
        $stmt->execute([$qty, $unitPrice, $existing["id"]]);
    } else {
        $stmt = $pdo->prepare("
            INSERT INTO cart_items (
                cart_id, product_id, product_name, category, image,
                base_price, unit_price, quantity, size, pieces, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $cartId,
            $productId,
            $product["name"],
            $product["category"],
            $product["image"],
            $basePrice,
            $unitPrice,
            $qty,
            $size ?: null,
            $pieces,
            $notes ?: null
        ]);
    }

    $pdo->commit();

    $stmt = $pdo->prepare("
        SELECT COALESCE(SUM(quantity), 0) AS count
        FROM cart_items
        WHERE cart_id = ?
    ");
    $stmt->execute([$cartId]);
    $count = (int)$stmt->fetch()["count"];

    jsonResponse([
        "success" => true,
        "message" => "Added to cart",
        "count" => $count
    ]);
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    jsonResponse([
        "success" => false,
        "error" => $e->getMessage()
    ], 500);
}