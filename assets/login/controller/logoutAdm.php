<?php

    session_start();
    session_unset();
    session_destroy();
    setcookie(session_name(), '', time() - 60, '/');
    header('Location: ../../login/view/loginAdm.html');
    exit();

?>

