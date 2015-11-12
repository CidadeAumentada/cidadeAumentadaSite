<?php
    /*realiza o upload de imagens para o servidor*/

    $name = $_POST['newName'];

    $ds = DIRECTORY_SEPARATOR;            // define atalho para separado de diretório "/"
    $storeFolder = 'uploads/imagens';  // define pasta para salvar os arquivos

    /*gera novo nome para armazenar o arquivo*/
    $ext = pathinfo($_FILES['userfile']['name'], PATHINFO_EXTENSION);  // recebe extensão da imagem enviada
    $uploadOk = 1;                                                 // permite o upload do arquivo

    if (!empty($_FILES)) {
        if (strtolower($ext) != "jpg" && strtolower($ext) != "png" && strtolower($ext) != "jpeg" && strtolower($ext) != "gif") {
            echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";  // exibe mensagem de erro
            $uploadOk = 0;                                               // impede o upload do arquivo
        }

        if ($uploadOk == 1) {
            $tempFile = $_FILES['userfile']['tmp_name'];                       // busca nome do arquivo enviado
            $targetPath = "../" . $storeFolder . $ds;  // recebe caminho da pasta para onde será enviado o arquivo
            $targetFile =  $targetPath . $name;                             // cria o caminho do arquivo a ser enviado
            move_uploaded_file($tempFile,$targetFile);                     // envia o arquivo para o servidor

            include "conectai.php";

            $insert_query = "INSERT INTO tbl_resource (conteudo_id, resource_arquivo, tipo_resource_id, status_id) VALUES ('-1', '$name', '2', '3')";

            if(!$result = $con->query($insert_query)) {
                die('There was an error running the query [' . $con->error . ']');
            }

            $con->close();
        }
    }
?>
