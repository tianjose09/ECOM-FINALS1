<?php
require_once __DIR__ . '/../utils/database.utils.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/response.php';

$userId = getCurrentUserId();
$orderId = isset($_GET["order_id"]) ? (int)$_GET["order_id"] : 0;

if ($orderId <= 0) {
    jsonResponse(["success" => false, "error" => "Missing order_id"], 400);
}

try {
    $stmt = $pdo->prepare("
        SELECT *
        FROM orders
        WHERE id = ? AND user_id = ?
        LIMIT 1
    ");
    $stmt->execute([$orderId, $userId]);
    $order = $stmt->fetch();

    if (!$order) {
        jsonResponse(["success" => false, "error" => "Order not found"], 404);
    }

    $stmt = $pdo->prepare("
        SELECT
            product_name AS name,
            quantity,
            unit_price AS price,
            size,
            pieces,
            notes
        FROM order_items
        WHERE order_id = ?
        ORDER BY id ASC
    ");
    $stmt->execute([$orderId]);
    $itemsRaw = $stmt->fetchAll();

    $createdAt = new DateTime($order["created_at"]);
    $now = new DateTime();
    $elapsedMinutes = max(0, (int)floor(($now->getTimestamp() - $createdAt->getTimestamp()) / 60));
    $remainingMinutes = max(1, (int)$order["estimated_minutes"] - $elapsedMinutes);

    $status = $order["status"];
    $stage = 1;
    $statusMessage = "Your order has been received.";

    if ($status === "Pending" || $status === "Preparing") {
        $stage = 2;
        $statusMessage = "Preparing your food. Your rider will pick it up once it’s ready.";
    } elseif ($status === "Out for Delivery") {
        $stage = 3;
        $statusMessage = "Your order is on the way.";
    } elseif ($status === "Delivered" || $status === "Completed") {
        $stage = 4;
        $statusMessage = "Your order has arrived.";
        $remainingMinutes = 0;
    }

    $items = [];
    foreach ($itemsRaw as $item) {
        $meta = [];
        if (!empty($item["size"])) {
            $meta[] = $item["size"];
        }
        if (!empty($item["pieces"])) {
            $meta[] = $item["pieces"] . " pcs";
        }
        if (!empty($item["notes"])) {
            $meta[] = $item["notes"];
        }

        $items[] = [
            "name" => $item["name"],
            "quantity" => (int)$item["quantity"],
            "price" => (float)$item["price"],
            "meta" => implode(" • ", $meta)
        ];
    }

    jsonResponse([
        "success" => true,
        "data" => [
            "orderId" => $order["id"],
            "merchant" => [
                "name" => "BREW-HA",
                "logo" => "",
                "pickupPlaceLabel" => "Brew-Ha Kitchen, P. Paredes St., Sampaloc, Manila"
            ],
            "shipping" => [
                "estimatedTimeText" => $remainingMinutes > 0 ? $remainingMinutes . " mins" : "Arrived",
                "currentStage" => $stage,
                "statusMessage" => $statusMessage,
                "deliveryModeLabel" => $order["delivery_method"] === "delivery"
                    ? ($order["address"] ?: "(Delivery address)")
                    : "(Brew-Ha Kitchen)"
            ],
            "pricing" => [
                "subtotal" => (float)$order["subtotal"],
                "deliveryFee" => (float)$order["delivery_fee"],
                "total" => (float)$order["total"]
            ],
            "items" => $items
        ]
    ]);
} catch (Throwable $e) {
    jsonResponse([
        "success" => false,
        "error" => $e->getMessage()
    ], 500);
}