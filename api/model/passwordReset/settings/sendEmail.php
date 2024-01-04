<?php

include_once '../../../connection/conn.php';

require '../PHPMailer/PHPMailer.php';
require '../PHPMailer/SMTP.php';
require '../PHPMailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

$username = $_REQUEST['username'];

$sql_check_user = "SELECT email_adm FROM adm WHERE user_adm = :username";
$stmt_check_user = $pdo->prepare($sql_check_user);
$stmt_check_user->bindParam(':username', $username);
$stmt_check_user->execute();

if ($stmt_check_user->rowCount() > 0) {
    $user_data = $stmt_check_user->fetch(PDO::FETCH_ASSOC);
    $email_adm = $user_data['email_adm'];

    if ($_REQUEST['operation'] == "sendEmail") {

        date_default_timezone_set('America/Sao_Paulo');

        $token = bin2hex(random_bytes(32));

        $expiryDate = date('Y-m-d H:i:s', strtotime('+5 minutes'));

        $sql_update_token = "UPDATE adm SET token = :token, expiry_date = :expiry_data WHERE email_adm = :email_adm";
        $stmt_update_token = $pdo->prepare($sql_update_token);
        $stmt_update_token->bindParam(':token', $token);
        $stmt_update_token->bindParam(':expiry_data', $expiryDate);
        $stmt_update_token->bindParam(':email_adm', $email_adm);
        $stmt_update_token->execute();

        // Configurar o PHPMailer
        $mail = new PHPMailer();
        $mail->CharSet = 'UTF-8';
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->Port = 587;
        $mail->SMTPSecure = 'tls';
        $mail->SMTPAuth = true;
        $mail->Username = 'callinense@gmail.com';
        $mail->Password = 'mjxz mhub kpcw wzrn';

        // Configurações do remetente e destinatário
        $mail->setFrom('Master@admlinense.com', 'Clube Atlético Linense');
        $mail->addAddress($email_adm);

        // Configurações do e-mail
        $mail->isHTML(true);
        $mail->Subject = 'Redefinição de Senha';
        $mail->Body =
            "<html>
        <head>
            <style>

            body {
                background-color: black;
            }
    
            header {
                background: #1A1A1A;
                width: 870px;
                text-align: center;
                padding: 10px 0;
                border-bottom: 5px solid #EC1B23;
            }
    
            img {
                width: 80px;
            }
    
            #hr-1 {
                border-style: none;
                background: #EC1B23;
                width: 870px;
                height: 5px;
                flex-shrink: 0;
            }
    
            .box {
                margin-top: 60px;
                width: 870px;
                height: 524px;
                flex-shrink: 0;
                background: #1A1A1A;
            }
    
            .box h2 {
                padding: 30px;
                color: #EC1B23;
                text-align: center;
                font-size: 30px;
                font-style: normal;
                font-weight: 800;
                line-height: normal;
            }
    
            .box h3 {
                padding: 30px;
                color: #939393;
                text-align: center;
                font-size: 20px;
                font-style: normal;
                font-weight: 550;
                line-height: normal;
            }

            .box h4{
                color: #939393;
                text-align: center;
                font-size: 15px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                margin-top: 20px;
            }
    
            .box hr {
                margin: 70px 120px;
                height: 2px;
                width: 600px;
                background-color: #C9C0C0;
            }
    
            #hr-2 {
                border-style: none;
                background: #EC1B23;
                width: 870px;
                height: 5px;
                flex-shrink: 0;
            }
    
            footer {
                border-top: 5px solid #EC1B23;
                margin-top: 70px;
                width: 870px;
                background: #1A1A1A;
                height: 145px;
            }
    
            footer p {
                text-align: center;
                color: #ffffff;
                font-weight: 200;
            }
    
            footer img {
                width: 55px;
                height: 55px;
                margin-left: 45px;
            }
    
            footer div {
                display: flex;
                align-items: center;
                justify-content: start;
                width: 100%;
                padding: 14px 180px;
            }
    
            </style>
        </head>

        <body>

        <header>
            <img src='https://assets.unlayer.com/projects/186223/1695584129395-CAL_logo_p.png'>
        </header>
    
        <div class='box'>
            <h2>REDEFINIÇÃO DE SENHA</h2>
    
            <h3>Olá, Administrador!  
            <br> Clique no botão abaixo para redefinir sua senha.</h3>

            <hr>
    

            <h4>Válido por 5 minutos.</h4>

            <button style='
            border: none;
            background-color: #EC1B23;
            padding: 10px 20px;
            border-radius: 3px;
            color: #ffffff;
            text-decoration: none;
            text-transform: uppercase;
            font-size: 20px;
            font-weight: 600;
            width: 300px;
            height: 70px;
            margin-left: 275px;
            '>
            <a style='color: #ffffff; 
            text-decoration: none; 
            font-weight: 600;' 


            href='http://localhost/WEBSITELINENSE/api/model/passwordReset/settings/sendEmail.php?operation=createSession&token=$token&username=$username'>Clique aqui</a></button>
            </div>
        </div>
    
        <footer>
            <p>Esta é uma mensagem automática. Por favor, não responda a este e-mail.</p>
            <div>
                <img src='https://assets.unlayer.com/projects/186223/1695584129395-CAL_logo_p.png'>
                <h1 style='
                color: #939393;
                margin-left: 10px;
                line-height: 20px;
                font-weight: 200;
                
                '>CLUBE ATLÉTICO LINENSE</h1>
            </div>
        </footer>
    </body>
        </html>
        ";

        // Envio do e-mail
        if ($mail->send()) {
            $response = [
                'success' => true,
                'email' => $email_adm,
            ];
        } else {
            $response = [
                'success' => false,
                'error' => 'Falha ao enviar o e-mail: ' . $mail->ErrorInfo,
            ];
        }
        echo json_encode($response);
    }


    if ($_REQUEST["operation"] == "createSession") {
        session_start();

        $tokenS = $_REQUEST["token"];

        $_SESSION['token'] = $tokenS;

        $dados = array(
            "message" => $_SESSION["token"]
        );

        echo json_encode($dados);

        header("Location:  ../../../../assets/login/view/resetPassword.php?");

        exit();
    }
}
