<?php
header('Content-Type: application/json');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

$response = ['success' => false, 'data' => [], 'error' => ''];

try {
    // Fix: Correct path to database.utils.php
    // Assuming your file structure is:
    // ECOM-FINALS1/
    //   ├── api/
    //   │   └── get_products.php
    //   └── utils/
    //       └── database.utils.php
    
    $dbUtilsPath = __DIR__ . '/../utils/database.utils.php';
    
    if (!file_exists($dbUtilsPath)) {
        throw new Exception('Database configuration file not found. Path: ' . $dbUtilsPath);
    }
    
    require_once $dbUtilsPath;
    
    // Check if connection exists
    global $conn;
    if (!isset($conn) || $conn->connect_error) {
        throw new Exception('Database connection failed: ' . ($conn->connect_error ?? 'Connection not established'));
    }
    
    // Fetch all products from database
    $query = "SELECT id, name, category, price, availability, description, image, image_path FROM products ORDER BY category, name";
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
        // For testing, add sample data if no products exist
        $products = [
            'drinks' => [
                ['name' => 'Caramel Latte', 'price' => 120, 'img' => 'latte.webp', 'category' => 'drinks', 'availability' => 'Available', 'description' => 'Rich caramel flavored latte'],
                ['name' => 'Matcha', 'price' => 130, 'img' => 'matcha.webp', 'category' => 'drinks', 'availability' => 'Available', 'description' => 'Premium Japanese matcha']
            ],
            'pastry' => [
                ['name' => 'Croissant', 'price' => 80, 'img' => 'croissant.webp', 'category' => 'pastry', 'availability' => 'Available', 'description' => 'Buttery flaky croissant']
            ],
            'pasta' => [
                ['name' => 'Carbonara', 'price' => 180, 'img' => 'carbonara.webp', 'category' => 'pasta', 'availability' => 'Available', 'description' => 'Creamy carbonara pasta']
            ]
        ];
    } else {
        while ($row = $result->fetch_assoc()) {
            $product = [
                'id' => $row['id'],
                'name' => $row['name'],
                'description' => $row['description'] ?: 'Delicious item from our menu.',
                'price' => (float)$row['price'],
                'img' => $row['image_path'] ?: ($row['image'] ?: 'default.png'),
                'category' => $row['category'],
                'availability' => $row['availability'] ?: 'Available'
            ];
            
            // Direct mapping based on category
            $category = strtolower(trim($row['category']));
            if ($category === 'drinks' || $category === 'drink') {
                $products['drinks'][] = $product;
            } elseif ($category === 'pastry' || $category === 'pastries') {
                $products['pastry'][] = $product;
            } elseif ($category === 'pasta' || $category === 'pastas') {
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