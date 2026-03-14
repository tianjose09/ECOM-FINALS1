<?php

require_once "../utils/database.utils.php";

$action = $_POST['action'] ?? '';

switch($action){

    case "register":

        $name = $_POST['name'];
        $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
        $role = "customer";

        $stmt = $conn->prepare("INSERT INTO users (name,password,role) VALUES (?,?,?)");
        $stmt->bind_param("sss",$name,$password,$role);
        $stmt->execute();

        echo "User registered";
        break;


    case "login":

        $name = $_POST['name'];
        $password = $_POST['password'];

        $stmt = $conn->prepare("SELECT * FROM users WHERE name=?");
        $stmt->bind_param("s",$name);
        $stmt->execute();

        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if($user && password_verify($password,$user['password'])){
            session_start();
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['role'] = $user['role'];

            echo "Login success";
        }else{
            echo "Invalid login";
        }

        break;


    case "deleteUser":

        session_start();

        if($_SESSION['role'] !== "admin"){
            die("Unauthorized");
        }

        $id = $_POST['id'];

        $stmt = $conn->prepare("DELETE FROM users WHERE id=?");
        $stmt->bind_param("i",$id);
        $stmt->execute();

        echo "User deleted";

        break;
}

?>