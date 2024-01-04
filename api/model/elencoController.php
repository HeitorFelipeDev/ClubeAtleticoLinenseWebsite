<?php
include_once "../connection/conn.php";

$requestData = $_REQUEST;

$dados = array();


if ($requestData["operation"] == "create") {
    try {  
        if (
            empty($requestData["nome_jogador"]) ||
            empty($requestData["numero_camisa"]) ||
            empty($requestData["posicao"]) ||
            empty($requestData["data_nasc"]) ||
            empty($requestData["idade"]) ||
            empty($requestData["altura"]) ||
            empty($requestData["nacionalidade"]) ||
            empty($requestData["descricao"])
        ) {
            $dados = array(
                "type" => "error",
                "message" => "Existe(m) campo(s) obrigatório(s) não preenchido",
            );
        } else {
            $nome_jogador = $requestData['nome_jogador'];
            $numero_camisa = $requestData['numero_camisa'];
            $posicao = $requestData['posicao'];
            $data_nasc = $requestData['data_nasc'];
            $idade = $requestData['idade'];
            $altura = $requestData['altura'];
            $nacionalidade = $requestData['nacionalidade'];
            $descricao = $requestData['descricao'];

            // Verifica se uma imagem foi selecionada
            if (!empty($requestData["id_imagem"])) {
                $id_imagem = $requestData['id_imagem'];

                $sql_check_category = "SELECT categoria FROM imagens WHERE id_imagem = :id_imagem";
                $stmt_check_category = $pdo->prepare($sql_check_category);
                $stmt_check_category->bindParam(':id_imagem', $id_imagem);
                $stmt_check_category->execute();
                $categoria_imagem = $stmt_check_category->fetchColumn();

                // Verificando se o id que o admin selecionou é da categoria "elenco"
                if ($categoria_imagem !== "elenco") {
                    $dados = array(
                        "type" => "error",
                        "message" => "A imagem selecionada não é da categoria 'elenco'",
                    );
                }
            }

            $stml_check_numero = $pdo->prepare("SELECT * FROM elenco WHERE numero_camisa = :numero");
            $stml_check_numero->bindParam(':numero', $requestData["numero_camisa"]);
            $stml_check_numero->execute();
            
            if ($stml_check_numero->rowCount() > 0) {
                $dados = array (
                    "type" => "error",
                    "message" => "Essa camisa já está sendo usada"
                );
            } else {
                // Continua com o processo de inserção
                $sql_create = "INSERT INTO elenco (nome_jogador, numero_camisa, posicao, data_nasc, idade, altura, nacionalidade, descricao, id_imagem)
                                VALUES (:nome_jogador, :numero_camisa, :posicao, :data_nasc, :idade, :altura, :nacionalidade, :descricao, :id_imagem)";
                $stmt = $pdo->prepare($sql_create);

                $stmt->bindParam(':nome_jogador', $nome_jogador);
                $stmt->bindParam(':numero_camisa', $numero_camisa);
                $stmt->bindParam(':posicao', $posicao);
                $stmt->bindParam(':data_nasc', $data_nasc);
                $stmt->bindParam(':idade', $idade);
                $stmt->bindParam(':altura', $altura);
                $stmt->bindParam(':nacionalidade', $nacionalidade);
                $stmt->bindParam(':descricao', $descricao);
                $stmt->bindParam(':id_imagem', $id_imagem);

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
            "message" => "Erro ao salvar o registro: " . $e->getMessage(),
        );
    }
}


if ($requestData["operation"] == "read") {
    $sql_read = "SELECT
    E.id_elenco,
    E.nome_jogador,
    E.numero_camisa,
    E.posicao,
    E.data_nasc,
    E.idade,
    E.altura,
    E.nacionalidade,
    E.descricao,
    E.id_imagem,
    I.path
    FROM elenco E
    LEFT JOIN imagens I ON E.id_imagem = I.id_imagem";
    $result = $pdo->query($sql_read);

    try {
        if ($result) {
            $dados = array();
            while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                // Verifique se a imagem associada ao jogador ainda existe
                $imagem_jogador = $row['path'];
                if (!file_exists($imagem_jogador)) {
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
        empty($requestData["nome_jogador"]) ||
        empty($requestData["numero_camisa"]) ||
        empty($requestData["posicao"]) ||
        empty($requestData["data_nasc"]) ||
        empty($requestData["idade"]) ||
        empty($requestData["altura"]) ||
        empty($requestData["nacionalidade"]) ||
        empty($requestData["descricao"]) ||
        empty($requestData["id_elenco"])
    ) {
        $dados = array(
            "type" => "error",
            "message" => "Existe(m) campo(s) obrigatório(s) não preenchido",
        );
    } else {
        try {
            $stml_check_numero = $pdo->prepare("SELECT * FROM elenco WHERE numero_camisa = :numero AND id_elenco != :id");
            $stml_check_numero->bindParam(':numero', $requestData["numero_camisa"]);
            $stml_check_numero->bindParam(':id', $requestData["id_elenco"]);
            $stml_check_numero->execute();
            
            if ($stml_check_numero->rowCount() > 0) {
                $dados = array (
                    "type" => "error",
                    "message" => "Essa camisa já está sendo usada"
                );
            } else {
                //verificando se foi enviada um nova img
                $newImageId = $requestData["id_imagem"];
                
                //verificando a selecao
                $sql_select_image = "SELECT id_imagem FROM elenco WHERE id_elenco = ?";
                $stmt_select_image = $pdo->prepare($sql_select_image);
                $stmt_select_image->execute
                ([
                    $requestData ["id_elenco"]
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
                            //caso exista ele altera
                        $sql_update_image = "UPDATE elenco SET id_imagem = ? WHERE id_elenco = ?";
                        $stmt_update_image = $pdo->prepare($sql_update_image);
                        $stmt_update_image->execute([$newImageId, $requestData["id_elenco"]]);
                    }
                }

                $stml_check_numero = $pdo->prepare("SELECT * FROM elenco WHERE numero_camisa = :numero");
                $stml_check_numero->bindParam(':numero', $requestData["numero_camisa"]);
                $stml_check_numero->execute();

                $sql_update_without_image = "UPDATE elenco SET 
                    nome_jogador = ?,
                    numero_camisa = ?,
                    posicao = ?,
                    data_nasc = ?,
                    idade = ?,
                    altura = ?,
                    nacionalidade = ?,
                    descricao = ? 
                    WHERE id_elenco = ?";
                $stmt_update_without_image = $pdo->prepare($sql_update_without_image);
                $stmt_update_without_image->execute([
                    $requestData["nome_jogador"],
                    $requestData["numero_camisa"],
                    $requestData["posicao"],
                    $requestData["data_nasc"],
                    $requestData["idade"],
                    $requestData["altura"],
                    $requestData["nacionalidade"],
                    $requestData["descricao"],
                    $requestData["id_elenco"],
                ]);

                $dados = array(
                    "type" => "success",
                    "message" => "Registro atualizado com sucesso!",
                );
            }
        } catch (PDOException $e) {
            $dados = array(
                "type" => "error",
                "message" => $e->getMessage(),
            );
        }
    }
}


if ($requestData["operation"] == "delete") {
    if (empty($requestData["id_elenco"])) {
        $dados = array(
            "type" => "error",
            "message" => "Existe(m) campo(s) obrigatório(s) não preenchido",
        );
    }
    try {
        $sql_delete = "DELETE FROM elenco WHERE id_elenco = ?";
        $stmt = $pdo->prepare($sql_delete);
        $stmt->execute([$requestData["id_elenco"]]);
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
