<?php
include_once "../connection/conn.php";

$requestData = $_REQUEST;

$dados = array();

if ($requestData["operation"] == "create") {
    try {
        if (
            empty($requestData["nome_staff"]) ||
            empty($requestData["setor"]) ||
            empty($requestData["funcao"]) 
        ) {
            $dados = array(
                "type" => "error",
                "message" => "Existe(m) campo(s) obrigatório(s) não preenchido",
            );
        } else {
            $nome_staff = $requestData['nome_staff'];
            $setor = $requestData['setor'];
            $funcao = $requestData['funcao'];

            if (!empty($requestData["id_imagem"])) {
                $id_imagem = $requestData['id_imagem']; 

                $sql_check_category = "SELECT categoria FROM imagens WHERE id_imagem = :id_imagem";
                $stmt_check_category = $pdo->prepare($sql_check_category);
                $stmt_check_category->bindParam(':id_imagem', $id_imagem);
                $stmt_check_category->execute();
                $categoria_imagem = $stmt_check_category->fetchColumn();

                // Verificando se o id que o admin selecionou é da categoria "staff"
                if ($categoria_imagem !== "staff") {
                    $dados = array(
                        "type" => "error",
                        "message" => "A imagem selecionada não é da categoria 'staff'",
                    );
                }
            
            }

                // Continua com o processo de inserção
                $sql_create = "INSERT INTO staff (nome_staff, setor, funcao, id_imagem)
                VALUES (:nome_staff, :setor, :funcao, :id_imagem)";
                $stmt = $pdo->prepare($sql_create);

                $stmt->bindParam(':nome_staff', $nome_staff);
                $stmt->bindParam(':setor', $setor);
                $stmt->bindParam(':funcao', $funcao);
                $stmt->bindParam(':id_imagem', $id_imagem);

                $stmt->execute();

                $dados = array(
                    "type" => "success",
                    "message" => "Registro salvo com sucesso!",
                );
            } 
        } catch (PDOException $e) {
            $dados = array(
                "type" => "error",
                "message" => "Erro ao salvar o registro: " . $e->getMessage(),
            );
    }
}

if ($requestData["operation"] == "read") {
        $sql_read ="SELECT
            S.id_staff,
            S.nome_staff,
            S.setor,
            S.funcao,
            S.id_imagem,
            I.path
        FROM staff S
        LEFT JOIN imagens I ON S.id_imagem = I.id_imagem";
        $result = $pdo->query($sql_read);

        try {
            if ($result) {
                $dados = array();
                while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                    // Verifique se a imagem associada ao staff ainda existe
                    $imagem_staff = $row['path'];
                    if (!file_exists($imagem_staff)) {
                        // A imagem não existe, use a imagem padrão
                        $row['path'] = 'http://localhost/WEBSITELINENSE/assets/images/default-profile.png';
                    }
    
                    $dados[] = $row;
                }
            
                if (empty($dados)) {
                    $dados = array(
                        "type" => "null",
                        "message" => "Não há registros salvos",
                    );
                }
                
            } 
        else {
            $dados = array(
                "type" => "error",
                "message" => "Erro ao buscar registros",
            );
        }
    } catch (PDOException $e) {
        $dados = array(
            "type" => "error",
            "message" => "Erro na consulta: " . $e,
        );
    }
}


if ($requestData["operation"] == "update") {
    if (
        empty($requestData["nome_staff"]) ||
        empty($requestData["setor"]) ||
        empty($requestData["funcao"]) ||
        empty($requestData["id_staff"]) 
    ) {
        $dados = array(
            "type" => "error",
            "message" => "Existe(m) campo(s) obrigatório(s) não preenchido",
        );
    } else {
        try {
            //verificando se foi enviada um nova img
            $newImageId = $requestData["id_imagem"];
            
            //verificando a selecao
            $sql_select_image = "SELECT id_imagem FROM staff WHERE id_staff = ?";
            $stmt_select_image = $pdo->prepare($sql_select_image);
            $stmt_select_image->execute
            ([
                $requestData ["id_staff"]
            ]);
            $currentImageId = $stmt_select_image->fetchColumn();

            //att a img, caso altera para outra
            if (!empty($newImageId) && $newImageId != $currentImageId) {
                    //verificando se existe o id
                $sql_check_image = "SELECT COUNT(*) FROM imagens WHERE id_imagem = ?";
                $stmt_check_image = $pdo->prepare($sql_check_image);
                $stmt_check_image->execute([$newImageId]);
                $imageExists = $stmt_check_image->fetchColumn();

                if ($imageExists) {
                        //caso exusta ele altera
                    $sql_update_image = "UPDATE staff SET id_imagem = ? WHERE id_staff = ?";
                    $stmt_update_image = $pdo->prepare($sql_update_image);
                    $stmt_update_image->execute([$newImageId, $requestData["id_staff"]]);
                }
            }

            $sql_update_without_image = "UPDATE staff SET 
                nome_staff = ?,
                setor = ?,
                funcao = ?
                WHERE id_staff = ?";
            $stmt_update_without_image = $pdo->prepare($sql_update_without_image);
            $stmt_update_without_image->execute([
                $requestData["nome_staff"],
                $requestData["setor"],
                $requestData["funcao"],
                $requestData["id_staff"],
            ]);

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


if ($requestData["operation"] == "delete") {
    if (empty($requestData["id_staff"])) {
        $dados = array(
            "type" => "error",
            "message" => "Existe(m) campo(s) obrigatório(s) não preenchido",
        );
    }
    try {
        $sql_delete = "DELETE FROM staff WHERE id_staff = ?";
        $stmt = $pdo->prepare($sql_delete);
        $stmt->execute([$requestData["id_staff"]]);
        $dados = array(
            "type" => "success",
            "message" => "Registro excluído com sucesso!",
        );
    } catch (PDOException $e) {
        $dados = array(
            "type" => "error",
            "message" => "Erro ao excluir o registro: " . $e->getMessage(),
        );
    }
}


echo json_encode($dados);