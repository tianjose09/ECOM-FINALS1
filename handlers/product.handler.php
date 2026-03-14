<?php

require_once "../utils/database.utils.php";

$action = $_POST['action'] ?? '';

switch($action){

case "addProduct":

$name = $_POST['name'];
$price = $_POST['price'];
$availability = $_POST['availability'];
$description = $_POST['description'];
$size = $_POST['size'];
$notes = $_POST['notes'];

$imagePath = NULL;

if(isset($_FILES['image']) && $_FILES['image']['error'] == 0){

    $uploadDir = "../assets/img/products/";

    $fileName = time() . "_" . basename($_FILES["image"]["name"]);

    $targetFile = $uploadDir . $fileName;

    move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile);

    $imagePath = "assets/img/products/" . $fileName;
}

$stmt = $conn->prepare("INSERT INTO products
(name,price,availability,description,size,notes,image_path)
VALUES (?,?,?,?,?,?,?)");

$stmt->bind_param(
"sdissss",
$name,
$price,
$availability,
$description,
$size,
$notes,
$imagePath
);

$stmt->execute();

echo "Product added";

break;

}
?>