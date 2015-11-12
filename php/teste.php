<?php
    include "conectai.php";

    $id_conteudo = $_GET[id_conteudo];

    echo $id_conteudo;

    $query = "SELECT * FROM tbl_conteudo WHERE conteudo_id='" . $id_conteudo . "'";

    if(!$result = $con->query($query)) {
        die('There was an error running the query [' . $con->error . ']');
    }

    $row = $result->fetch_assoc();

    echo "<br>" . $row;

    $nome = $row[conteudo_nome];

    echo "<br>" . $nome;

    $ano = $row[conteudo_ano];

    echo "<br>" . $ano;

    $login = $row[conteudo_criado_por];

    echo "<br>" . $login;

    $con->close();
?>
