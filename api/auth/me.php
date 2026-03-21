<?php

require_once __DIR__ . '/../helpers/response.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!empty($_SESSION['user_id'])) {
    jsonResponse([
        'success' => true,
        'loggedIn' => true,
        'user' => [
            'id' => (int) $_SESSION['user_id'],
            'name' => $_SESSION['user_name'] ?? '',
            'role' => $_SESSION['user_role'] ?? 'customer'
        ]
    ]);
}

jsonResponse([
    'success' => true,
    'loggedIn' => false
]);