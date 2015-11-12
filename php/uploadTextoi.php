<?php

    include "conectai.php";

    $id = $_GET[id];
    $texto = $_GET[texto];

    $insert_query = "INSERT INTO tbl_resource (conteudo_id, resource_texto, tipo_resource_id, status_id) VALUES ('$id', '$texto', '3', '3')";

    if(!$result = $con->query($insert_query)) {
        die('There was an error running the query [' . $con->error . ']');
    }

    $con->close();
?>
