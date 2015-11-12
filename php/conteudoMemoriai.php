<?php
    include 'conectai.php';

    $funcao = $_GET[funcao];
    $id_conteudo = $_GET[id_conteudo];

    if ($funcao == 'info') {
        $query = "SELECT conteudo_nome, conteudo_ano, conteudo_descricao, conteudo_latitude_y, conteudo_longitude_x, conteudo_criado_por FROM tbl_conteudo WHERE conteudo_id='" . $id_conteudo .  "'";

        if(!$result = $con->query($query)) {
            die('There was an error running the query [' . $con->error . ']');
        }

        $jsonObject = array();

        while ($row = $result->fetch_assoc()) {
            $jsonObject = $row;
        }

        $finalRes = json_encode($jsonObject);
        echo $finalRes;

    } else if ($funcao == 'content') {
        $query2 = "SELECT resource_arquivo, resource_texto, tipo_resource_id FROM tbl_resource WHERE conteudo_id='" . $id_conteudo . "'";

        if(!$result2 = $con->query($query2)) {
            die('There was an error running the query [' . $con->error . ']');
        }

        $jsonObject2 = array();
        $i = 0;

        while ($row2 = $result2->fetch_assoc()) {
            $jsonObject2[$i] = $row2;
            $i++;
        }

        $finalRes = json_encode($jsonObject2);
        echo $finalRes;
    }

    $con->close();
?>
