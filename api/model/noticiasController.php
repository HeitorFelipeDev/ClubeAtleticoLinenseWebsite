<?php
include_once "../connection/conn.php";

$requestData = $_REQUEST;

$dados = array();

if ($requestData["operation"] == "create") {
    try {
        if (
            empty($requestData["nome_materia"]) ||
            empty($requestData["descricao_materia"]) ||
            empty($requestData["data_criacao"]) 
        ) {
            $dados = array(
                "type" => "error",
                "message" => "Existe(m) campo(s) obrigatório(s) não preenchido",
            );
        } else {
            $nome_materia = $requestData['nome_materia'];
            $descricao_materia = $requestData['descricao_materia'];
            $data_criacao = $requestData['data_criacao'];

            if (!empty($requestData["id_imagem"])) {
                $id_imagem = $requestData['id_imagem']; 

                $sql_check_category = "SELECT categoria FROM imagens WHERE id_imagem = :id_imagem";
                $stmt_check_category = $pdo->prepare($sql_check_category);
                $stmt_check_category->bindParam(':id_imagem', $id_imagem);
                $stmt_check_category->execute();
                $categoria_imagem = $stmt_check_category->fetchColumn();

                // Verificando se o id que o admin selecionou é da categoria "noticia"
                if ($categoria_imagem !== "noticia") {
                    $dados = array(
                        "type" => "error",
                        "message" => "A imagem selecionada não é da categoria 'noticia'",
                    );
                }
            
            }

                // Continua com o processo de inserção
                $sql_create = "INSERT INTO noticias (nome_materia, descricao_materia, data_criacao, id_imagem)
                VALUES (:nome_materia, :descricao_materia, :data_criacao, :id_imagem)";
                $stmt = $pdo->prepare($sql_create);

                $stmt->bindParam(':nome_materia', $nome_materia);
                $stmt->bindParam(':descricao_materia', $descricao_materia);
                $stmt->bindParam(':data_criacao', $data_criacao);
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
    $sql_read = "SELECT
    N.id_noticia,
    N.nome_materia,
    N.descricao_materia,
    N.data_criacao,
    N.id_imagem,
    I.path
    FROM noticias N
    LEFT JOIN imagens I ON N.id_imagem = I.id_imagem";
    $result = $pdo->query($sql_read);

    try {
        if ($result) {
            $dados = array();
            while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                // Verifique se a imagem associada à noticia ainda existe
                $imagem_noticia = $row['path'];
                if (!file_exists($imagem_noticia)) {
                    // A imagem não existe, use a imagem padrão
                    $row['path'] = 'http://localhost/WEBSITELINENSE/assets/images/image-default.jpg';
                }

                $dados[] = $row;
            }

            if (empty($dados)) {
                $dados = array(
                    "type" => "null",
                    "message" => "Não há registros salvos",
                );
            }
        } else {
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
        empty($requestData["nome_materia"]) ||
        empty($requestData["descricao_materia"]) ||
        empty($requestData["data_criacao"])||
        empty($requestData["id_noticia"]) 
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
            $sql_select_image = "SELECT id_imagem FROM noticias WHERE id_noticia = ?";
            $stmt_select_image = $pdo->prepare($sql_select_image);
            $stmt_select_image->execute
            ([
                $requestData ["id_noticia"]
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
                    $sql_update_image = "UPDATE noticias SET id_imagem = ? WHERE id_noticia = ?";
                    $stmt_update_image = $pdo->prepare($sql_update_image);
                    $stmt_update_image->execute([$newImageId, $requestData["id_noticia"]]);
                }
            }

            $sql_update_without_image = "UPDATE noticias SET 
                nome_materia = ?,
                descricao_materia = ?,
                data_criacao = ?
                WHERE id_noticia = ?";
            $stmt_update_without_image = $pdo->prepare($sql_update_without_image);
            $stmt_update_without_image->execute([
                $requestData["nome_materia"],
                $requestData["descricao_materia"],
                $requestData["data_criacao"],
                $requestData["id_noticia"],
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
    if (empty($requestData["id_noticia"])) {
        $dados = array(
            "type" => "error",
            "message" => "Existe(m) campo(s) obrigatório(s) não preenchido",
        );
    }
    try {
        $sql_delete = "DELETE FROM noticias WHERE id_noticia = ?";
        $stmt = $pdo->prepare($sql_delete);
        $stmt->execute([$requestData["id_noticia"]]);
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




