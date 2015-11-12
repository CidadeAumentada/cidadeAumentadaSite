<?php
    include 'conectai.php';

    $query = "SELECT conteudo_id, conteudo_latitude_y, conteudo_longitude_x, conteudo_criado_por, conteudo_nome, conteudo_ano, ativo FROM v_conteudo_ativo ORDER BY conteudo_ano DESC";

    if(!$result = $con->query($query)) {
        die('There was an error running the query [' . $con->error . ']');
    }

    $jsonObject = array();
    $i = 0;

    while ($row = $result->fetch_assoc()) {
        $jsonObject[$i][0] = $row[conteudo_id];
        $jsonObject[$i][1] = $row[conteudo_latitude_y];
        $jsonObject[$i][2] = $row[conteudo_longitude_x];
        $jsonObject[$i][3] = $row[conteudo_criado_por];
        $jsonObject[$i][4] = $row[conteudo_nome];
        $jsonObject[$i][5] = $row[conteudo_ano];
        $jsonObject[$i][6] = $row[ativo];
        $i++;
    }

    $finalRes = json_encode($jsonObject);
    echo $finalRes;

    $con->close();
?>
