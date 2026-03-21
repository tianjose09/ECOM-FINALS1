<?php

require_once __DIR__ . '/../helpers/response.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (empty($_SESSION['user_id']) || ($_SESSION['user_role'] ?? '') !== 'admin') {
    jsonResponse([
        'success' => false,
        'message' => 'Admin access only.'
    ], 403);
}