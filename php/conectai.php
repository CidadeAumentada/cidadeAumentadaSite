<?php
    /*informacões para concexão com o banco de dados*/
    $servername = "";       // nome do servidor
    $username = "";   // nome de usuário
    $password = "";  // senha
    $dbname = "";    // nome do banco de dados

    $con = new mysqli($servername, $username, $password, $dbname);           // define parametros para conceção

    if ($con->connect_errno > 0) {
        die('Unable o connect to database [' . $con->connect_errno . ']');
    }
?>
