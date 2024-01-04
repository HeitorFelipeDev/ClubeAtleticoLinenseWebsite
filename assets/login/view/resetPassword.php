<?php

session_start();

include_once '../../../api/connection/conn.php';


?>

<!DOCTYPE html>
<html lang="pt-br">

<head>

    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- link-css -->
    <link rel="stylesheet" href="../../../assets/css/resetPassword.css">

    <!-- script-js -->
    <script src="../controller/showAlertsResetPassword.js"></script>
    <script src="../../../assets/login/controller/resetPassword.js" defer></script>
    <script src="../../js/buttonVerSenha.js" defer></script>
    <script src="../../js/darkModeSettings.js" defer></script>

    <!-- font-awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer" />

    <!-- SweetAlert -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11.0.19/dist/sweetalert2.min.css" />

    <!-- favicon -->
    <link rel="shortcut icon" href="../../images/CAL_logo_p.png" type="image/x-icon">

    <title>Redefinição de Senha</title>

</head>

<body>
    <?php

    // Verificação se está no tempo
    $token = $_SESSION['token'];
    date_default_timezone_set('America/Sao_Paulo');

    $sql_check_token = "SELECT expiry_date, email_adm FROM adm WHERE token = :token";
    $stmt_check_token = $pdo->prepare($sql_check_token);
    $stmt_check_token->bindParam(':token', $token);
    $stmt_check_token->execute();

    if ($stmt_check_token->rowCount() > 0) {
        $result = $stmt_check_token->fetch(PDO::FETCH_ASSOC);
        $expiryDate = $result['expiry_date'];
        $email_adm = $result['email_adm'];

        if (strtotime($expiryDate) < time()) {
            echo '<script>showErrorTokenExpired();</script>';
        }

        $expiryDate = strtotime($stmt_check_token->fetchColumn());
    } else {
        echo '<script>showErrorTokenInvalid();</script>';
    }

    $token = $_SESSION['token'];
    $sql_check_token = "SELECT token, email_adm FROM adm WHERE token IS NULL";
    $stmt_check_token = $pdo->prepare($sql_check_token);
    $stmt_check_token->execute();

    if ($stmt_check_token->rowCount() < 0) {
        echo '<script>showErrorTokenNull();</script>';
    }


    ?>



    <div class="button-dark-mode">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-moon" viewBox="0 0 16 16">
            <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z" />
        </svg>
    </div>
    <section class="reset-password-container">
        <section id="reset-password-administrador">
            <div class="container">
                <h2 class="title-form-password">Redefinição de Senha</h2>

                <div class="input-group">
                    <div class="input-block">
                        <label for="senha">Nova senha</label>
                        <div class="input-container">
                            <div class="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-lock" viewBox="0 0 16 16">
                                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
                                </svg>
                            </div>
                            <input type="password" class="senha" id="senha" name="newPassword" placeholder="Digite a nova senha" required>
                            <i class="fa fa-eye-slash" id="button-ver-senha" aria-hidden="true"></i>
                        </div>
                    </div>
                    <div class="input-block">
                        <label for="confirm-senha">Confirmar senha</label>
                        <div class="input-container">
                            <div class="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-lock" viewBox="0 0 16 16">
                                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
                                </svg>
                            </div>
                            <input type="password" id="confirm-senha" name="confirmNewPassword" placeholder="Confirme sua senha" required>
                        </div>
                        <div id="div-token" token="<?php echo $_SESSION['token'] ?>"></div>
                    </div>
                </div>
                <button id="button-submit-reset-password">Confirmar</button>

            </div>
        </section>
    </section>


</body>

</html>