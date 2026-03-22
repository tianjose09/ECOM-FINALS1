<?php
require_once __DIR__ . '/../utils/database.utils.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/response.php';

$userId = getCurrentUserId();
$input = json_decode(file_get_contents("php://input"), true);

$paymentMethod = trim($input["payment_method"] ?? "");
$deliveryMethod = trim($input["delivery_method"] ?? "pickup");
$deliveryFee = (float)($input["delivery_fee"] ?? 0);
$address = trim($input["address"] ?? "");

if ($paymentMethod === "") {
    jsonResponse(["success" => false, "error" => "Payment method is required"], 400);
}

try {
    $pdo->beginTransaction();

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
        $pdo->rollBack();
        jsonResponse(["success" => false, "error" => "No active cart found"], 400);
    }

    $cartId = (int)$cart["id"];

    $stmt = $pdo->prepare("
        SELECT *
        FROM cart_items
        WHERE cart_id = ?
        ORDER BY id ASC
    ");
    $stmt->execute([$cartId]);
    $items = $stmt->fetchAll();

    if (!$items) {
        $pdo->rollBack();
        jsonResponse(["success" => false, "error" => "Cart is empty"], 400);
    }

    $subtotal = 0;
    $itemCount = 0;

    foreach ($items as $item) {
        $lineTotal = ((float)$item["unit_price"]) * ((int)$item["quantity"]);
        $subtotal += $lineTotal;
        $itemCount += (int)$item["quantity"];
    }

    $total = $subtotal + $deliveryFee;

    $estimatedMinutes = 15;
    if ($deliveryMethod === "delivery") {
        $estimatedMinutes += 15;
    }
    if ($itemCount >= 3) {
        $estimatedMinutes += 5;
    }
    if ($itemCount >= 6) {
        $estimatedMinutes += 10;
    }

    $orderNumber = 'ORD-' . date('YmdHis') . '-' . rand(100, 999);

    $paymentStatus = $paymentMethod === 'COD' ? 'Unpaid' : 'Payment Pending';
    $status = $deliveryMethod === 'pickup' ? 'Preparing' : 'Preparing';

    $stmt = $pdo->prepare("
        INSERT INTO orders (
            order_number, user_id, cart_id, status, payment_status,
            payment_method, delivery_method, address, subtotal, delivery_fee, total, estimated_minutes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $orderNumber,
        $userId,
        $cartId,
        $status,
        $paymentStatus,
        $paymentMethod,
        $deliveryMethod,
        $address ?: null,
        $subtotal,
        $deliveryFee,
        $total,
        $estimatedMinutes
    ]);

    $orderId = (int)$pdo->lastInsertId();

    $stmt = $pdo->prepare("
        INSERT INTO order_items (
            order_id, product_id, product_name, category, image,
            unit_price, quantity, size, pieces, notes, line_total
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    foreach ($items as $item) {
        $lineTotal = ((float)$item["unit_price"]) * ((int)$item["quantity"]);
        $stmt->execute([
            $orderId,
            $item["product_id"],
            $item["product_name"],
            $item["category"],
            $item["image"],
            $item["unit_price"],
            $item["quantity"],
            $item["size"],
            $item["pieces"],
            $item["notes"],
            $lineTotal
        ]);
    }

    $stmt = $pdo->prepare("UPDATE carts SET status = 'ordered' WHERE id = ?");
    $stmt->execute([$cartId]);

    $pdo->commit();

    jsonResponse([
        "success" => true,
        "message" => "Order placed successfully",
        "order_id" => $orderId,
        "order_number" => $orderNumber
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