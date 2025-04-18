<?php
session_start();

$host = 'localhost';
$dbname = 'projectdb'; 
$username = 'root';
$password = ''; 

try {
   
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "CREATE TABLE IF NOT EXISTS new_users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                firstName VARCHAR(50) NOT NULL,
                lastName VARCHAR(50) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                address VARCHAR(150), 
                phoneNumber VARCHAR(20),
                reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );";

    $pdo->exec($sql);
} catch (PDOException $e) {
    die("Could not connect to the database $dbname :" . $e->getMessage());
}
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $firstName = htmlspecialchars(strip_tags($_POST['firstName']));
    $lastName = htmlspecialchars(strip_tags($_POST['lastName']));
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT); 
    $address = htmlspecialchars(strip_tags($_POST['address']));
    $phoneNumber = htmlspecialchars(strip_tags($_POST['phoneNumber']));

    try {
        $sql = "INSERT INTO new_users (firstName, lastName, email, password, address, phoneNumber) 
                VALUES (:firstName, :lastName, :email, :password, :address, :phoneNumber)";
        
        $stmt = $pdo->prepare($sql);
        
        $stmt->bindParam(':firstName', $firstName, PDO::PARAM_STR);
        $stmt->bindParam(':lastName', $lastName, PDO::PARAM_STR);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->bindParam(':password', $password, PDO::PARAM_STR);
        $stmt->bindParam(':address', $address, PDO::PARAM_STR);
        $stmt->bindParam(':phoneNumber', $phoneNumber, PDO::PARAM_STR);
        $stmt->execute();
        
        $_SESSION['success_message'] = "Account created successfully. Please log in.";
        header("Location: signin.html");
        exit();
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            $_SESSION['error_message'] = "An account with this email already exists. Please sign in.";
            header("Location: signin.html");
            exit();
        } else {
            $_SESSION['error_message'] = "Something went wrong. Please try again later.";
            header("Location: signup.html");
            exit();
        }
    } finally {
    
        unset($stmt);
    }
}

unset($pdo);
?>
