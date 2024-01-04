<?php

include_once "../connection/conn.php";

$requestData = $_REQUEST;

if ($requestData["operation"] == "create") {
    if (
        empty($requestData["titulo_imagem"]) ||
        empty($requestData["categoria"]) ||
        empty($requestData["descricao_imagem"]) ||
        empty($_FILES["path"]) ||
        empty($requestData["data_criacao"])
    ) {
        $dados = array(
            "type" => "error",
            "message" => "Existe(m) campo(s) obrigatório(s) não preenchido",
        );
    } else {

        try {

            $titulo_imagem = $requestData['titulo_imagem'];
            $categoria = $requestData['categoria'];
            $descricao_imagem = $requestData['descricao_imagem'];
            $data_criacao = $requestData['data_criacao']; // usuário não informa

            $allowedCategories = ["elenco", "staff", "patrocinador", "parceiro", "noticias"];

            if (!in_array($categoria, $allowedCategories)) {
                $dados = array(
                    "type" => "error",
                    "message" => "A categoria selecionada não é válida.",
                );
            } else {

                //salva no diretorio da determinada categoria
                $destino = "../../assets/images/{$categoria}/";

                //se nao exisitr o diretório da categoria válida, ele cria
                if (!file_exists($destino)) {
                    mkdir($destino, 0777, true);
                }

                $nomeArquivo = $_FILES["path"]["name"];
                $path = $destino . $nomeArquivo;

                if (move_uploaded_file($_FILES["path"]["tmp_name"], $path)) {
                    $sql_create = "INSERT INTO imagens (titulo_imagem, categoria, descricao_imagem, path, data_criacao)
                                    VALUES (:titulo_imagem, :categoria, :descricao_imagem, :path, :data_criacao)";
                    $stmt = $pdo->prepare($sql_create);

                    $stmt->bindParam(':titulo_imagem', $titulo_imagem);
                    $stmt->bindParam(':categoria', $categoria);
                    $stmt->bindParam(':descricao_imagem', $descricao_imagem);
                    $stmt->bindParam(':path', $path);
                    $stmt->bindParam(':data_criacao', $data_criacao);

                    $stmt->execute();

                    $dados = array(
                        "type" => "success",
                        "message" => "Registro salvo com sucesso!",
                    );
                } else {
                    $dados = array(
                        "type" => "error",
                        "message" => "Erro ao fazer upload da imagem.",
                    );
                }
            }
        } catch (PDOException $e) {
            $dados = array(
                "type" => "error",
                "mensagem" => "Erro: " . $e,
            );
        }
    }
}

if ($requestData["operation"] == "read") {

    $sql_read = "SELECT * FROM imagens";
    $result = $pdo->query($sql_read);

    try {
        if ($result) {
            $dados = array();
            while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
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
            "message" => "Erro: " . $e,
        );
    }
}

if ($requestData["operation"] == "update") {
    if (
        empty($requestData['id_imagem']) ||
        empty($requestData["titulo_imagem"]) ||
        empty($requestData["categoria"]) ||
        empty($requestData["descricao_imagem"])
    ) {
        $dados = array(
            "type" => "error",
            "message" => "Existe(m) campo(s) obrigatório(s) não preenchido",
        );
    } else {
        try {
            $titulo_imagem = $requestData['titulo_imagem'];
            $categoria = $requestData['categoria'];
            $descricao_imagem = $requestData['descricao_imagem'];
            $id_imagem = $requestData['id_imagem'];

            $sql_get_category = "SELECT categoria, path FROM imagens WHERE id_imagem = :id_imagem";
            $stmt = $pdo->prepare($sql_get_category);
            $stmt->bindParam(':id_imagem', $id_imagem);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $currentCategory = $result['categoria'];
            $currentImagePath = $result['path'];

            $allowedCategories = ["elenco", "staff", "patrocinador", "parceiro", "noticias"];

            if (!in_array($categoria, $allowedCategories)) {
                $dados = array(
                    "type" => "error",
                    "message" => "A categoria selecionada não é válida.",
                );
            } else {
                $baseDirectory = "../../assets/images/";

                //verificando se o diretorio da categoria selecionada existe
                $newCategoryDirectory = $baseDirectory . $categoria;
                if (!is_dir($newCategoryDirectory)) {
                    //se o diretorio da categoria nao existir, crie-o
                    if (mkdir($newCategoryDirectory, 0777, true)) {
                    } else {
                        $dados = array(
                            "type" => "error",
                            "message" => "Erro ao criar o diretório da nova categoria.",
                        );
                    }
                }

                if (isset($_FILES["path"])) {
                    $destino = $newCategoryDirectory . "/";
                    $nomeArquivo = $_FILES["path"]["name"];
                    $path = $destino . $nomeArquivo;

                    if (move_uploaded_file($_FILES["path"]["tmp_name"], $path)) {
                        //quando altera a categoria, aktera o caminho e a categoria
                        if ($categoria !== $currentCategory) {
                            //tira o arquivo antigo
                            if (file_exists($currentImagePath)) {
                                unlink($currentImagePath);
                            }
                            $currentCategory = $categoria;
                        }

                        $sql_update = "UPDATE imagens SET titulo_imagem = :titulo_imagem, categoria = :categoria, descricao_imagem = :descricao_imagem, path = :path WHERE id_imagem = :id_imagem;";
                        $stmt = $pdo->prepare($sql_update);
                        $stmt->bindParam(':titulo_imagem', $titulo_imagem);
                        $stmt->bindParam(':categoria', $categoria);
                        $stmt->bindParam(':descricao_imagem', $descricao_imagem);
                        $stmt->bindParam(':path', $path);
                        $stmt->bindParam(':id_imagem', $id_imagem);

                        $stmt->execute();

                        $dados = array(
                            "type" => "success",
                            "message" => "Registro salvo com sucesso!",
                        );
                    } else {
                        $dados = array(
                            "type" => "error",
                            "message" => "Erro ao fazer upload da imagem.",
                        );
                    }
                } else {
                    if ($categoria !== $currentCategory) {
                        $currentCategory = $categoria;

                        //movendo o arquivo para o novo diretório referente a categoria que colocou
                        $newPath = $newCategoryDirectory . '/' . basename($currentImagePath);
                        if (rename($currentImagePath, $newPath)) {
                            $currentImagePath = $newPath;
                        }
                    }

                    $sql_update = "UPDATE imagens SET titulo_imagem = :titulo_imagem, categoria = :categoria, descricao_imagem = :descricao_imagem, path = :path WHERE id_imagem = :id_imagem;";
                    $stmt = $pdo->prepare($sql_update);
                    $stmt->bindParam(':titulo_imagem', $titulo_imagem);
                    $stmt->bindParam(':categoria', $categoria);
                    $stmt->bindParam(':descricao_imagem', $descricao_imagem);
                    $stmt->bindParam(':path', $currentImagePath);
                    $stmt->bindParam(':id_imagem', $id_imagem);

                    $stmt->execute();

                    $sql_update_elenco = "UPDATE elenco SET id_imagem = NULL WHERE 
                    id_imagem = :old_id_imagem";
                    $stmt = $pdo->prepare($sql_update_elenco);
                    $stmt->bindParam(':old_id_imagem', $requestData['id_imagem']); // ID antigo da imagem
                    $stmt->execute();

                    $dados = array(
                        "type" => "success",
                        "message" => "Registro salvo com sucesso!",
                    );
                }
            }
        } catch (PDOException $e) {
            $dados = array(
                "type" => "error",
                "message" => "Erro: " . $e->getMessage(),
            );
        }
    }
}


if ($requestData["operation"] == "delete") {
    if (empty($requestData['id_imagem'])) {
        $dados = array(
            "type" => "error",
            "message" => "Existe(m) campo(s) obrigatório(s) não preenchido",
        );
    } else {
        try {
            // Consulta para obter a categoria da imagem
            $sql_select_category = "SELECT categoria FROM imagens WHERE id_imagem = :id_imagem";
            $stmt_category = $pdo->prepare($sql_select_category);
            $stmt_category->bindParam(':id_imagem', $requestData['id_imagem']);
            $stmt_category->execute();
            $category_result = $stmt_category->fetch(PDO::FETCH_ASSOC);

            if ($category_result) {
                $categoria = $category_result['categoria'];

                // Crie a consulta SQL para atualizar a tabela com base na categoria
                $sql_update = "UPDATE $categoria SET id_imagem = NULL WHERE id_imagem = :id_imagem";
                $stmt_update = $pdo->prepare($sql_update);
                $stmt_update->bindParam(':id_imagem', $requestData['id_imagem']);
                $stmt_update->execute();
            } else {
                $dados = array(
                    "type" => "error",
                    "message" => "Imagem não encontrada com ID: $requestData[id_imagem]",
                );
            }

            $sql_select_path = "SELECT path FROM imagens WHERE id_imagem = :id_imagem";
            $stmt = $pdo->prepare($sql_select_path);
            $stmt->bindParam(':id_imagem', $requestData['id_imagem']);
            $stmt->execute();
            $path_result = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($path_result) {
                $path_to_delete = $path_result['path'];

                $sql_delete = "DELETE FROM imagens WHERE id_imagem = :id_imagem";
                $stmt = $pdo->prepare($sql_delete);
                $stmt->bindParam(':id_imagem', $requestData['id_imagem']);
                $stmt->execute();

                if (file_exists($path_to_delete)) {
                    unlink($path_to_delete);
                }
                $dados = array(
                    "type" => "success",
                    "message" => "Registro excluído com sucesso!",
                );
            } else {
                $dados = array(
                    "type" => "error",
                    "message" => "Imagem não encontrada com ID: $requestData[id_imagem]",
                );
            }
        } catch (PDOException $e) {
            $dados = array(
                "type" => "error",
                "mensagem" => "Erro: " . $e,
            );
        }
    }
}

if ($requestData["operation"] == "elenco") {

    $sql_read = "SELECT id_imagem, path FROM imagens WHERE categoria = 'elenco'";
    $result = $pdo->query($sql_read);

    try {
        if ($result) {
            $dados = array();
            while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
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
            "message" => "Erro: " . $e,
        );
    }
}

if ($requestData["operation"] == "getImagePlayer") {
    $sql = "SELECT path FROM imagens WHERE id_imagem = :id_imagem";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':id_imagem', $requestData['id_imagem']);
    $stmt->execute();

    try {
        if ($stmt) {
            $dados = array();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
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
            "message" => "Erro: " . $e,
        );
    }
}

if ($requestData["operation"] == "getImageNoticia") {
    $sql = "SELECT path FROM imagens WHERE id_imagem = :id_imagem";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':id_imagem', $requestData['id_imagem']);
    $stmt->execute();

    try {
        if ($stmt) {
            $dados = array();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
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
            "message" => "Erro: " . $e,
        );
    }
}


echo json_encode($dados);
