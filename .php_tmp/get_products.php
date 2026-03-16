<?php
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 1);

$response = [
    'success' => false,
    'data' => [
        'drinks' => [],
        'pastry' => [],
        'pasta' => []
    ],
    'error' => ''
];

try {
    $dbUtilsPath = __DIR__ . '/../utils/database.utils.php';

    if (!file_exists($dbUtilsPath)) {
        throw new Exception('Database configuration file not found. Path: ' . $dbUtilsPath);
    }

    require_once $dbUtilsPath;

    global $conn;

    if (!isset($conn) || $conn->connect_error) {
        throw new Exception('Database connection failed: ' . ($conn->connect_error ?? 'Connection not established'));
    }

    // You can keep only available products
    $query = "
        SELECT id, name, category, price, availability, description, image, image_path
        FROM products
        WHERE availability = 'Available' OR availability IS NULL OR availability = ''
        ORDER BY category, name
    ";

    $result = $conn->query($query);

    if (!$result) {
        throw new Exception('Query failed: ' . $conn->error);
    }

    $products = [
        'drinks' => [],
        'pastry' => [],
        'pasta' => []
    ];

    if ($result->num_rows === 0) {
        // Optional fallback data for testing
        $products = [
            'drinks' => [
                [
                    'id' => 1,
                    'name' => 'Caramel Latte',
                    'price' => 120,
                    'img' => 'latte.webp',
                    'category' => 'drinks',
                    'availability' => 'Available',
                    'description' => 'Rich caramel flavored latte'
                ],
                [
                    'id' => 2,
                    'name' => 'Matcha',
                    'price' => 130,
                    'img' => 'matcha.webp',
                    'category' => 'drinks',
                    'availability' => 'Available',
                    'description' => 'Premium Japanese matcha'
                ]
            ],
            'pastry' => [
                [
                    'id' => 3,
                    'name' => 'Croissant',
                    'price' => 80,
                    'img' => 'croissant.webp',
                    'category' => 'pastry',
                    'availability' => 'Available',
                    'description' => 'Buttery flaky croissant'
                ]
            ],
            'pasta' => [
                [
                    'id' => 4,
                    'name' => 'Carbonara',
                    'price' => 180,
                    'img' => 'carbonara.webp',
                    'category' => 'pasta',
                    'availability' => 'Available',
                    'description' => 'Creamy carbonara pasta'
                ]
            ]
        ];
    } else {
        while ($row = $result->fetch_assoc()) {
            $category = strtolower(trim($row['category'] ?? ''));

            $product = [
                'id' => (int)$row['id'],
                'name' => $row['name'],
                'description' => $row['description'] ?: 'Delicious item from our menu.',
                'price' => (float)$row['price'],
                'img' => !empty($row['image_path']) ? $row['image_path'] : (!empty($row['image']) ? $row['image'] : 'default.png'),
                'category' => $category,
                'availability' => $row['availability'] ?: 'Available'
            ];

            if ($category === 'drinks' || $category === 'drink') {
                $product['category'] = 'drinks';
                $products['drinks'][] = $product;
            } elseif ($category === 'pastry' || $category === 'pastries') {
                $product['category'] = 'pastry';
                $products['pastry'][] = $product;
            } elseif ($category === 'pasta' || $category === 'pastas') {
                $product['category'] = 'pasta';
                $products['pasta'][] = $product;
            }
        }
    }

    $response['success'] = true;
    $response['data'] = $products;

} catch (Exception $e) {
    $response['error'] = $e->getMessage();
    error_log("get_products.php error: " . $e->getMessage());
}

echo json_encode($response);

if (isset($conn)) {
    $conn->close();
}
?>