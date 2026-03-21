<?php

require_once __DIR__ . '/../helpers/response.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (empty($_SESSION['user_id'])) {
    jsonResponse([
        'success' => false,
        'message' => 'Unauthorized.'
    ], 401);
}

if (($_SESSION['user_role'] ?? '') !== 'admin') {
    jsonResponse([
        'success' => false,
        'message' => 'Forbidden. Admin access only.'
    ], 403);
}