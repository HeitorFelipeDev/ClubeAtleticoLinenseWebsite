<?php
    include_once("../connection/conn.php");

    $requestData = $_REQUEST;

    // CREATE
    if ($requestData["operation"] == "create") {
        if (
            empty($requestData["user_adm"]) || 
            empty($requestData["email_adm"]) ||
            empty($requestData["senha_adm"]) ||
            empty($requestData["confirmar_senha"])
            ) {
            $dados = array(
                "type" => "error",
                "mensagem" => "Existe(m) campo(s) obrigatório(s) não preenchido"
            );
        } else {

            if ($requestData["senha_adm"] == $requestData["confirmar_senha"]) {
                try {
                    if (!filter_var($requestData["email_adm"], FILTER_VALIDATE_EMAIL)) {
                        $dados = array (
                            "type" => "error",
                            "mensagem" => "Esse endereço de e-mail não é válido"
                        );
                    } else {
                        $stmt_check_email = $pdo->prepare("SELECT * FROM adm WHERE email_adm = :email");
                        $stmt_check_email->bindParam(':email', $requestData["email_adm"]);
                        $stmt_check_email->execute();
                        
                        if ($stmt_check_email->rowCount() > 0) {
                            $dados = array (
                                "type" => "error",
                                "mensagem" => "Esse e-mail já está cadastrado"
                            );
                        } else {

                            $stmt_check_user = $pdo->prepare("SELECT * FROM adm WHERE user_adm = :user");
                            $stmt_check_user->bindParam(':user', $requestData["user_adm"]);
                            $stmt_check_user->execute();
                            
                            if ($stmt_check_user->rowCount() > 0) {
                                $dados = array (
                                    "type" => "error",
                                    "mensagem" => "Esse nome de usuário já existe"
                                );
                            } else {
                                $senha_hash = password_hash($requestData["senha_adm"], PASSWORD_DEFAULT);
                            
                                $sql = "INSERT INTO adm (user_adm, email_adm, senha_adm ) VALUES (?, ?, ?)";
                                $stmt = $pdo->prepare($sql);
                                $stmt->execute([
                                    $requestData["user_adm"],
                                    $requestData["email_adm"],
                                    $senha_hash
                                ]);
                            
                                $dados = array(
                                    "type" => "success",
                                    "mensagem" => "Registro salvo com sucesso!"
                                );
                            }
                        }
                    }

                } catch (PDOException $e) {
                    $dados = array(
                            "type" => "error",
                            "mensagem" => "Erro ao salvar o registro: " . $e
                    );
                }
            } else {
                $dados = array (
                    "type" => "error",
                    "mensagem" => "Senhas incoerentes"
                );
            }
        }
    }
    
    // READ

    
    if ($requestData["operation"] == "read") {
        session_start();
        if (!isset($_SESSION['id_adm'])) {
            $dados = array(
                "type" => "error",
                "mensagem" => "Sessão do administrador não iniciada."
            );
        } else {
            $id_adm_logado = $_SESSION['id_adm'];
    
            $sql = "SELECT * FROM adm WHERE id_adm = $id_adm_logado";
            $result = $pdo->query($sql);
    
            try {
                if ($result) {
                    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                        $dados[] = array_map(null, $row);
                    }
                } else {
                    $dados = array(
                        "Mensagem" => "Não foi encontrado nenhum registro!"
                    );
                }
            } catch (PDOException $e) {
                $dados = array(
                    "type" => "error",
                    "mensagem" => "Erro ao buscar registros: " . $e
                );
            }
        }
    }
    
// UPDATE
if ($requestData["operation"] == "update") {
    if (
        empty($requestData["user_adm"]) ||
        empty($requestData["email_adm"]) ||
        empty($requestData["id_adm"]) ||
        empty($requestData["senha_adm"])
    ) {
        $dados = array(
            "type" => "error",
            "message" => "Existe(m) campo(s) obrigatório(s) não preenchido",
        );
    } else {
        try {
            $senhaHash = password_hash($requestData["senha_adm"], PASSWORD_DEFAULT);

            $sql_update = $pdo->prepare("UPDATE adm SET 
            user_adm = :user,
            email_adm = :email,
            senha_adm = :senha
            WHERE id_adm = :id");

            $sql_update->bindParam(':user', $requestData["user_adm"]);
            $sql_update->bindParam(':email', $requestData["email_adm"]);
            $sql_update->bindParam(':senha', $senhaHash);
            $sql_update->bindParam(':id', $requestData["id_adm"]);
            $sql_update->execute();

            $dados = array(
                "type" => "success",
                "message" => "Registro atualizado com sucesso!",
            );

        } catch (PDOException $e) {
            $dados = array(
                "type" => "error",
                "message" => $e->getMessage(),
            );
        }
    }
}
echo json_encode($dados);
