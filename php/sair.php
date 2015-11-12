<?php
    /*finaliza sessão do usuário*/

    session_start();    // inicia sessão de usuário

    session_unset();    // remove variáveis registradas para a sessão
    session_destroy();  // destroi sessão de usuário

    header('location: ../index.php');  // redireciona a página para a inicial
    die();  // finaliza processos
?>
