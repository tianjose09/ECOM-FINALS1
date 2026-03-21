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
        throw new Exception('Database connection failed: ' . $conn->connect_error);
    }

    $sql = "SELECT id, name, password, role FROM users WHERE name = ? LIMIT 1";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception('Prepare failed: ' . $conn->error);
    }

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

    $isValidPassword = false;

    if (password_verify($password, $user['password'])) {
        $isValidPassword = true;
    } elseif ($password === $user['password']) {
        $isValidPassword = true;
    }

    if (!$isValidPassword) {
        jsonResponse([
            'success' => false,
            'message' => 'Invalid username or password.'
        ], 401);
    }

    $_SESSION['user_id'] = (int) $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_role'] = $user['role'];

    $redirect = '../../index.html';

    if ($user['role'] === 'admin') {
        $redirect = '../../pages/Admin Dashboard/index.html';
    }

    jsonResponse([
        'success' => true,
        'message' => 'Login successful.',
        'user' => [
            'id' => (int) $user['id'],
            'name' => $user['name'],
            'role' => $user['role']
        ],
        'redirect' => $redirect
    ]);
} catch (Throwable $e) {
    jsonResponse([
        'success' => false,
        'message' => $e->getMessage()
    ], 500);
}