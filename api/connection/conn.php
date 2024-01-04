<?php

$dbhost = "localhost";
$dbname = "linense";
$dbusername = "root";
$dbpassword = "eusereiumprogramador";

try {
    $pdo = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbusername, $dbpassword);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // echo "Conexão realizada com sucesso!";
} catch (PDOexception $err) {
    // echo "Erro: " . $err->getMessage();
}  

?>