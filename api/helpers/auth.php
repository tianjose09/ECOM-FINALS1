<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function isLoggedIn(): bool
{
    return !empty($_SESSION['user_id']);
}

function getCurrentUserId(): int
{
    if (!isLoggedIn()) {
        throw new Exception('User is not logged in.');
    }

    return (int) $_SESSION['user_id'];
}

function requireLogin(): void
{
    if (!isLoggedIn()) {
        if (!headers_sent()) {
            http_response_code(401);
            header('Content-Type: application/json; charset=utf-8');
        }

        echo json_encode([
            'success' => false,
            'message' => 'You must login first.'
        ]);
        exit;
    }
}