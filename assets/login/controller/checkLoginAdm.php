<?php

    include_once("../../../api/connection/conn.php");

    $requestData = $_REQUEST;

    if ($requestData["operation"] == "login") {
        if (
            empty($requestData["user_adm"]) || 
            empty($requestData["senha_adm"])
        ) {
            $dados = array (
                "type" => "error",
                "mensagem" => "Existe(m) campo(s) obrigatório(s) não preenchido"
            );
        } else {
            try {
                $user_adm = filter_var($requestData['user_adm'], FILTER_SANITIZE_STRING);
                $senha_adm = $requestData['senha_adm'];
    
                $sql = "SELECT * FROM adm WHERE user_adm=:user_adm";
    
                $stmt = $pdo->prepare($sql);
    
                $stmt->bindValue(':user_adm', $user_adm);
                $stmt->execute();
    
                $dados_adm = $stmt->fetch(PDO::FETCH_ASSOC);
    
                if ($dados_adm && password_verify($senha_adm, $dados_adm['senha_adm'])) {
    
                    $dados = array (
                        "type" => "success",
                        "mensagem" => "Login realizado com sucesso!",
                    );
                } else {
                    $dados = array (
                        "type" => "error",
                        "mensagem" => "Usuário ou senha inválidos!"
                    );
                }
            } catch (PDOException $e) {
                $dados = array(
                        "type" => "error",
                        "mensagem" => "Erro ao salvar o registro: " . $e
                );
            }
        }
    } 

    if ($requestData["operation"] == "userExists") {
        if (empty($requestData["user_adm"])) {
            $dados = array (
                "type" => "error",
                "mensagem" => "Usuário Inválido"
            );
        } else {

            
            $stmt_check_user = $pdo->prepare("SELECT * FROM adm WHERE user_adm = :user");
            $stmt_check_user->bindParam(':user', $requestData["user_adm"]);
            $stmt_check_user->execute();

            
        
            
            if (!$stmt_check_user->rowCount()) {
                $dados = array (
                    "type" => "error",
                    "mensagem" => "Não foi possível localizar nenhum usuário com o nome " . "'" .$requestData["user_adm"] . "'"
                );
            } else {
                $stmt = $pdo->prepare("SELECT email_adm FROM adm WHERE user_adm = :user");
                $stmt->bindParam(':user', $requestData["user_adm"]);
                $stmt->execute();
            
                if ($stmt->rowCount() > 0) {
                    function ocultarEmailComAsteriscos($email) {
                        $partes = explode('@', $email);
                        $nomeUsuario = $partes[0];
                        $dominio = $partes[1];
                    
                        $tamanhoUsuario = strlen($nomeUsuario);
                        $emailOculto = str_repeat('*', $tamanhoUsuario) . '@' . $dominio;
                        return $emailOculto;
                    }
                    
                    $row = $stmt->fetch(PDO::FETCH_ASSOC);
                    $emailUsuario = $row["email_adm"];
                    $dados = array (
                        "type" => "success",
                        "email" =>  ocultarEmailComAsteriscos($emailUsuario)
                    );
                    
                }
            }
        }
    }

    if ($requestData["operation"] == "sendToCms") {
        session_start();

        $user_adm = $requestData["user_adm"];

        echo $user_adm;

        $sql = "SELECT * FROM adm WHERE user_adm=:user_adm";
    
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':user_adm', $user_adm);
        $stmt->execute();
        $dados_adm = $stmt->fetch(PDO::FETCH_ASSOC);

        $_SESSION['id_adm'] = $dados_adm['id_adm'];
        $_SESSION['user_adm'] = $dados_adm['user_adm'];

        $dados = array (
            "message" => $_SESSION["id_adm"]
        );

        header("Location:  ../../../cms.php");

        exit();
    }
            
    echo json_encode($dados);

?>