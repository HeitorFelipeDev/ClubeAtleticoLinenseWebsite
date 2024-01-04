<?php
include_once "../connection/conn.php";

$requestData = $_REQUEST;

$dados = array();

if ($requestData["operation"] == "create") {
    try {
        if (
            empty($requestData["nome_parceiro"]) ||
            empty($requestData["link"])
        ) {
            $dados = array(
                "type" => "error",
                "message" => "Existe(m) campo(s) obrigatório(s) não preenchido",
            );
        } else {
            $nome_parceiro = $requestData['nome_parceiro'];
            $link = $requestData['link'];

            if (!empty($requestData["id_imagem"])) {
                $id_imagem = $requestData['id_imagem'];

                $sql_check_category = "SELECT categoria FROM imagens WHERE id_imagem = :id_imagem";
                $stmt_check_category = $pdo->prepare($sql_check_category);
                $stmt_check_category->bindParam(':id_imagem', $id_imagem);
                $stmt_check_category->execute();
                $categoria_imagem = $stmt_check_category->fetchColumn();

                // Verificando se o id que o admin selecionou é da categoria "parceiro"
                if ($categoria_imagem !== "parceiro") {
                    $dados = array(
                        "type" => "error",
                        "message" => "A imagem selecionada não é da categoria 'parceiro'",
                    );
                }

            }

            // Continua com o processo de inserção
            $sql_create = "INSERT INTO parceiro (nome_parceiro, link, id_imagem)
                VALUES (:nome_parceiro, :link, :id_imagem)";
            $stmt = $pdo->prepare($sql_create);

            $stmt->bindParam(':nome_parceiro', $nome_parceiro);
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
        P.id_parceiro,
        P.nome_parceiro,
        P.link,
        P.id_imagem,
        I.path
    FROM parceiro P
    LEFT JOIN imagens I ON P.id_imagem = I.id_imagem";
    $result = $pdo->query($sql_read);

    try {
        if ($result) {
            $dados = array();
            while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                // Verifique se a imagem associada ao staff ainda existe
                $imagem_parceiro = $row['path'];
                if (!file_exists($imagem_parceiro)) {
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
        empty($requestData["nome_parceiro"]) ||
        empty($requestData["link"]) ||
        empty($requestData["id_parceiro"])
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
            $sql_select_image = "SELECT id_imagem FROM parceiro WHERE id_parceiro = ?";
            $stmt_select_image = $pdo->prepare($sql_select_image);
            $stmt_select_image->execute
                ([
                $requestData["id_parceiro"],
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
                    $sql_update_image = "UPDATE parceiro SET id_imagem = ? WHERE id_parceiro = ?";
                    $stmt_update_image = $pdo->prepare($sql_update_image);
                    $stmt_update_image->execute([$newImageId, $requestData["id_parceiro"]]);
                }
            }

            $sql_update_without_image = "UPDATE parceiro SET
                nome_parceiro = ?,
                link = ?
                WHERE id_parceiro = ?";
            $stmt_update_without_image = $pdo->prepare($sql_update_without_image);
            $stmt_update_without_image->execute([
                $requestData["nome_parceiro"],
                $requestData["link"],
                $requestData["id_parceiro"],
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
    if (empty($requestData["id_parceiro"])) {
        $dados = array(
            "type" => "error",
            "message" => "Existe(m) campo(s) obrigatório(s) não preenchido",
        );
    }
    try {
        $sql_delete = "DELETE FROM parceiro WHERE id_parceiro = ?";
        $stmt = $pdo->prepare($sql_delete);
        $stmt->execute([$requestData["id_parceiro"]]);
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
