<?php

require_once __DIR__ . '/../helpers/response.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/../../utils/database.utils.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse([
            'success' => false,
            'message' => 'Invalid request method.'
        ], 405);
    }

    $input = json_decode(file_get_contents('php://input'), true);

    $name = trim($input['name'] ?? '');
    $password = trim($input['password'] ?? '');

    if ($name === '' || $password === '') {
        jsonResponse([
            'success' => false,
            'message' => 'Please fill in all fields.'
        ], 422);
    }

    global $conn;

    if (!isset($conn) || $conn->connect_error) {
        throw new Exception('Database connection failed.');
    }

    $sql = "SELECT id, name, password, role FROM users WHERE name = ? LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $name);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        jsonResponse([
            'success' => false,
            'message' => 'Invalid username or password.'
        ], 401);
    }

    $user = $result->fetch_assoc();

    if (!password_verify($password, $user['password'])) {
        jsonResponse([
            'success' => false,
            'message' => 'Invalid username or password.'
        ], 401);
    }

    $_SESSION['user_id'] = (int) $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_role'] = $user['role'];

    jsonResponse([
        'success' => true,
        'message' => 'Login successful.',
        'user' => [
            'id' => (int) $user['id'],
            'name' => $user['name'],
            'role' => $user['role']
        ]
    ]);
} catch (Throwable $e) {
    jsonResponse([
        'success' => false,
        'message' => $e->getMessage()
    ], 500);
}