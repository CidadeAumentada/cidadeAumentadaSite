<?php
    /*realiza login com novo usuário*/

    $username = $_POST['userName'];    // recebe nome do novo usuário

    session_start();                   // inicia sessão de usuário

//    $_SESSION['login'] = $username;    // define o nome do usuário da sessão
    $_SESSION['falha'] = false;
    header('location: ../index.php');  // redireciona a página para a página inicial
    die();  // finaliza processos
?>
