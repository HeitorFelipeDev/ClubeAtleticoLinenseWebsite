<?php
include_once "../connection/conn.php";

$requestData = $_REQUEST;

$dados = array();

if ($requestData["operation"] == "create") {
    try {
        if (
            empty($requestData["nome_patrocinador"]) ||
            empty($requestData["link"])
        ) {
            $dados = array(
                "type" => "error",
                "message" => "Existe(m) campo(s) obrigatório(s) não preenchido",
            );
        } else {
            $nome_patrocinador = $requestData['nome_patrocinador'];
            $link = $requestData['link'];

            if (!empty($requestData["id_imagem"])) {
                $id_imagem = $requestData['id_imagem'];

                $sql_check_category = "SELECT categoria FROM imagens WHERE id_imagem = :id_imagem";
                $stmt_check_category = $pdo->prepare($sql_check_category);
                $stmt_check_category->bindParam(':id_imagem', $id_imagem);
                $stmt_check_category->execute();
                $categoria_imagem = $stmt_check_category->fetchColumn();

                // Verificando se o id que o admin selecionou é da categoria "patrocinador"
                if ($categoria_imagem !== "patrocinador") {
                    $dados = array(
                        "type" => "error",
                        "message" => "A imagem selecionada não é da categoria 'patrocinador'",
                    );
                }

            }

            // Continua com o processo de inserção
            $sql_create = "INSERT INTO patrocinador (nome_patrocinador, link, id_imagem)
                VALUES (:nome_patrocinador, :link, :id_imagem)";
            $stmt = $pdo->prepare($sql_create);

            $stmt->bindParam(':nome_patrocinador', $nome_patrocinador);
            $stmt->bindParam(':link', $link);
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
        P.id_patrocinador,
        P.nome_patrocinador,
        P.link,
        P.id_imagem,
        I.path
    FROM patrocinador P
    LEFT JOIN imagens I ON P.id_imagem = I.id_imagem";
    $result = $pdo->query($sql_read);

    try {
        if ($result) {
            $dados = array();
            while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                // Verifique se a imagem associada ao staff ainda existe
                $imagem_patrocinador = $row['path'];
                if (!file_exists($imagem_patrocinador)) {
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
        empty($requestData["nome_patrocinador"]) ||
        empty($requestData["link"]) ||
        empty($requestData["id_patrocinador"])
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
            $sql_select_image = "SELECT id_imagem FROM patrocinador WHERE id_patrocinador = ?";
            $stmt_select_image = $pdo->prepare($sql_select_image);
            $stmt_select_image->execute([$requestData["id_patrocinador"]]);
            $currentImageId = $stmt_select_image->fetchColumn();

            //att a img, caso altera para outra
            if (!empty($newImageId) && $newImageId != $currentImageId) {
                //verificando se existe o id
                $sql_check_image = "SELECT COUNT(*) FROM imagens WHERE id_imagem = ?";
                $stmt_check_image = $pdo->prepare($sql_check_image);
                $stmt_check_image->execute([$newImageId]);
                $imageExists = $stmt_check_image->fetchColumn();

                if ($imageExists) {
                    //caso exista ele altera
                    $sql_update_image = "UPDATE patrocinador SET id_imagem = ? WHERE id_patrocinador = ?";
                    $stmt_update_image = $pdo->prepare($sql_update_image);
                    $stmt_update_image->execute([$newImageId, $requestData["id_patrocinador"]]);
                }
            }

            $sql_update_without_image = "UPDATE patrocinador SET
                nome_patrocinador = ?,
                link = ?
                WHERE id_patrocinador = ?";
            $stmt_update_without_image = $pdo->prepare($sql_update_without_image);
            $stmt_update_without_image->execute([
                $requestData["nome_patrocinador"],
                $requestData["link"],
                $requestData["id_patrocinador"],
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
    if (empty($requestData["id_patrocinador"])) {
        $dados = array(
            "type" => "error",
            "message" => "Existe(m) campo(s) obrigatório(s) não preenchido",
        );
    }
    try {
        $sql_delete = "DELETE FROM patrocinador WHERE id_patrocinador = ?";
        $stmt = $pdo->prepare($sql_delete);
        $stmt->execute([$requestData["id_patrocinador"]]);
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
