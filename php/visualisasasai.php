<?php
    include 'conectai.php';

    $query = "SELECT conteudo_id, conteudo_latitude_y, conteudo_longitude_x FROM tbl_conteudo";

    if(!$result = $con->query($query)) {
        die('There was an error running the query [' . $con->error . ']');
    }

    $jsonObject = array();
    $i = 0;

    while ($row = $result->fetch_assoc()) {
        $jsonObject[$i][0] = $row[conteudo_id];
        $jsonObject[$i][1] = $row[conteudo_latitude_y];
        $jsonObject[$i][2] = $row[conteudo_longitude_x];

        $query2 = "SELECT resource_arquivo, resource_texto, tipo_resource_id FROM tbl_resource WHERE conteudo_id='" . $row[conteudo_id] . "'";

        if(!$result2 = $con->query($query2)) {
            die('There was an error running the query [' . $con->error . ']');
        }

        $jsonObjectResource = array();
        $j = 0;

        while ($row2 = $result2->fetch_assoc()) {
            $jsonObjectResource[$j] = $row2;
            $j++;
        }

        $jsonObject[$i][3] = $jsonObjectResource;
        $i++;
    }

    $finalRes = json_encode($jsonObject);
    echo $finalRes;

    $con->close();
?>
