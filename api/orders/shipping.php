<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../../utils/database.utils.php';

$orderId = isset($_GET['order_id']) ? (int)$_GET['order_id'] : 0;

if ($orderId <= 0) {
    echo json_encode([
        "success" => false,
        "error" => "Invalid order ID"
    ]);
    exit;
}

// ✅ GET ORDER
$stmt = $conn->prepare("
    SELECT *
    FROM orders
    WHERE id = ?
    LIMIT 1
");
$stmt->bind_param("i", $orderId);
$stmt->execute();
$result = $stmt->get_result();
$order = $result->fetch_assoc();

if (!$order) {
    echo json_encode([
        "success" => false,
        "error" => "Order not found"
    ]);
    exit;
}

// ✅ GET ORDER ITEMS
$stmt = $conn->prepare("
    SELECT *
    FROM order_items
    WHERE order_id = ?
");
$stmt->bind_param("i", $orderId);
$stmt->execute();
$result = $stmt->get_result();

$items = [];

while ($row = $result->fetch_assoc()) {
    $items[] = [
        "name" => $row["product_name"],
        "quantity" => (int)$row["quantity"],
        "price" => (float)$row["unit_price"],
        "meta" => ($row["size"] ?? '') . ($row["pieces"] ? " • ".$row["pieces"]." pcs" : "")
    ];
}

// ✅ RESPONSE FORMAT (MATCHES YOUR JS)
echo json_encode([
    "success" => true,
    "data" => [
        "merchant" => [
            "logo" => ""
        ],
        "shipping" => [
            "estimatedTimeText" => $order["estimated_minutes"] . " mins",
            "statusMessage" => "Preparing your food. Your rider will pick it up soon.",
            "deliveryModeLabel" => ucfirst($order["delivery_method"]),
            "currentStage" => 2
        ],
        "items" => $items,
        "pricing" => [
            "subtotal" => (float)$order["subtotal"],
            "deliveryFee" => (float)$order["delivery_fee"],
            "total" => (float)$order["total"]
        ]
    ]
]);