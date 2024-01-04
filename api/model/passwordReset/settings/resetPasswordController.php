<?php
    include_once '../../../connection/conn.php';

    $dados = array();

    if ($_REQUEST["operation"] == "updatePassword") {
        if (isset($_REQUEST['newPassword']) || $_REQUEST['token']) {
            $newPassword = $_REQUEST['newPassword'];
            $token = $_REQUEST['token'];
            
            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    
            try {
    
                $sql_update_password = "UPDATE adm SET senha_adm = :newPassword, token = NULL, expiry_date = NULL WHERE token = :token";
                $stmt = $pdo->prepare($sql_update_password);
                $stmt->bindParam(':newPassword', $hashedPassword);
                $stmt->bindParam(':token', $token);
                $stmt->execute();

                if ($stmt->execute()) {
                    $dados = array(
                        "type" => 1,
                        "token" => $token,
                        "mensagem" => "Senha alterada com sucesso"
                    );
                } else {
                    $dados = array(
                        "type" => 2,
                        "mensagem" => "Ocorreu um erro ao redefinir sua senha"
                    );
                }
            } catch (PDOException $e) {
                $dados = array(
                    "type" => "error",
                    "mensagem" => "Erro ao buscar registros: " . $e
                );
            }
        } else {
            $dados = array (
                "mensagem" => "bobo"
            );
        }
    } else {
        $dados = array (
            "mensagem" => 'rrrrrr'
        );
    }
    
    echo json_encode($dados);
?>