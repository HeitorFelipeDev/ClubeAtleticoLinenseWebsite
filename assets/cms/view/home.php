
<?php
    include_once("../../../api/connection/conn.php");
    session_start();

if (!isset($_SESSION['id_adm'])) {
    header('Location: assets/login/view/loginAdm.html');
    exit();
}


$id_adm_logado = $_SESSION['id_adm'];


$sql = "SELECT user_adm FROM adm WHERE id_adm = :id_adm_logado";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':id_adm_logado', $id_adm_logado);
$stmt->execute();

if ($stmt->rowCount() > 0) {
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $user = explode(".", $row['user_adm']);
} else {
    $user = "Nome de Usuário Não Encontrado";
}
?>


<div class="text-info">
    <img src="assets/images/image-home.png" alt="" class="image-home">
    <h3>Seja bem-vindo(a), <span id="username"> <?php echo $user[0] ?></span>! <br> Este é o  gerenciador de conteúdo do site do <span> <br> Clube Atlético Linense </span> </h3>
    <hr>
    <p>
        Nesta área do sistema você podera ter acesso às informações do site principal, <br> dessa forma poderá alterar e manipular quaisquer dados. 
    </p>
</div>


<script>
    const adminId = <?php echo $_SESSION['id_adm']; ?>;
</script>