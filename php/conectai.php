<?php
    /*informacões para concexão com o banco de dados*/
    $servername = "dbmy0010.whservidor.com";       // nome do servidor
    $username = "u162031767_user";   // nome de usuário
    $password = "inovacidades2014";  // senha
    $dbname = "u162031767_cidad";    // nome do banco de dados

    $con = new mysqli($servername, $username, $password, $dbname);           // define parametros para conceção

    if ($con->connect_errno > 0) {
        die('Unable o connect to database [' . $con->connect_errno . ']');
    }
?>
