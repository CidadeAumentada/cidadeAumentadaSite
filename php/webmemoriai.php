<?php
   /*webservice relativo à tabela de memórias*/

    include "conectai.php";    // conecta com o banco de dados

    $funcao = $_GET[funcao];  // recebe função a ser executada

    if ($funcao == 'novaMemoria') {
        $getData = $_GET[getData];      // recebe informações a seren inseridas no banco
        $data = json_decode($getData);  // decodifica o json recebido

        /*guarda informações recebidas em variáveis*/
        $nome = $data->{"nome"};
        $ano = $data->{"ano"};
        $descricao = $data->{"descricao"};
        $rua = $data->{"rua"};
        $numero = $data->{"numero"};
        $bairro = $data->{"bairro"};
        $cidade = $data->{"cidade"};
        $estado = $data->{"estado"};
        $lat = $data->{"lat"};
        $lng = $data->{"lng"};
        $login = $data->{"login"};
        $texto = $data->{"texto"};
        $imagem = $data->{"imagem"};
        $video = $data->{"video"};
        $audio = $data->{"audio"};
        $date = date('Y-m-d H:i:s');  // define formato da data e salva data atual



        $insert_query = "INSERT INTO tbl_conteudo (conteudo_nome, conteudo_descricao,
                                     conteudo_endereco, conteudo_numero,
                                     conteudo_bairro, conteudo_cidade,
                                     conteudo_estado, conteudo_longitude_x,
                                     conteudo_latitude_y, conteudo_ano, natureza_id,
                                     conteudo_criado_por, conteudo_criado_em)
                                VALUES ('$nome', '$descricao', '$rua',
                                      '$numero', '$bairro', '$cidade',
                                      '$estado', '$lng', '$lat', '$ano',
                                      '2', '$login', '$date')";   // requerimento para inserir nova memória na tabela

        if (!$result = $con->query($insert_query)) {
            die('There was an error running the query [' . $con->error . ']');
        }

        $id = mysqli_insert_id($con);

        if ($texto != "") {
            $insert_query = "INSERT INTO tbl_resource (conteudo_id, resource_texto, tipo_resource_id, status_id) VALUES ('$id', '$texto', '3', '3')";

            if(!$result = $con->query($insert_query)) {
                die('There was an error running the query [' . $con->error . ']');
            }
        }

        if ($imagem != "") {
            $command = "UPDATE tbl_resource SET conteudo_id = '$id' WHERE resource_arquivo = '$imagem'";
            if(!$result = $con->query($command)) {
                die('There was an error running the query [' . $con->error . ']');
            }
        }
        if ($video != "") {
            $command = "UPDATE tbl_resource SET conteudo_id = '$id' WHERE resource_arquivo = '$video'";
            if(!$result = $con->query($command)) {
                die('There was an error running the query [' . $con->error . ']');
            }
        }
        if ($audio != "") {
            $command = "UPDATE tbl_resource SET conteudo_id = '$id' WHERE resource_arquivo = '$audio'";
            if(!$result = $con->query($command)) {
                die('There was an error running the query [' . $con->error . ']');
            }
        }

        $sql = "DELETE FROM tbl_resource WHERE conteudo_id=-1";

        if ($con->query($sql) === TRUE) {
            echo "Record deleted successfully";
        } else {
            echo "Error deleting record: " . $con->error;
        }

        $mail_smtp_server = "ssl://smtp.gmail.com";
        $mail_smtp_user = "inova.cidadeaumentada@gmail.com";
        $mail_smtp_pass = "inovacidades2014";
        $mail_from = "inova.cidadeaumentada@gmail.com";
        $mail_porta = "465";

        $mail_subject = "Assunto";
        $mail_format = 'H';

        $query = "SELECT email FROM sec_users WHERE login='" . $login . "'";

        if(!$result = $con->query($query)) {
            die('There was an error running the query [' . $con->error . ']');
        }

        $mail_to = $result->fetch_assoc();	// <---------------------

        require_once("/phpmailer/class.phpmailer.php");

        $mail = new PHPMailer();

        $mail->IsSMTP();
        $mail->SMTPSecure = false;
        $mail->CharSet = "UTF-8";
        $mail->Host = $mail_smtp_server;
        $mail->Port = $mail_porta;
        $mail->SMTPAuth = true;
        $mail->Username = $mail_smtp_user;
        $mail->Password = $mail_smtp_pass;
        $mail->From = $mail_smtp_user;
        $mail->FromName = "Cidade Aumentada";

        $x_dest_email = $mail_to[email];
        $x_dest_nome = $login;     // <---------------------

        $mail->AddAddress($x_dest_email,$x_dest_nome);
        $mail->IsHTML(true);

        $x_txt_html="Olá $x_dest_nome!";   // <-----------------------------
        $x_txt_html.="<br><br>A sua memória <i>" . $nome . " - " . $ano . "</i> foi enviada para moderação!";
        $x_txt_html.="<br>Você receberá um e-mail quando o seu conteudo for aprovado.";
        $x_txt_html.="<br><br>Att,";
        $x_txt_html.="<br><b><i>Projeto Cidade Aumentada</i></b>";

        $array_de=array();
        $array_para=array();
        $array_de[]="<br>";
        $array_para[]="\r\n";
        $array_de[]="<b>";
        $array_para[]="";
        $array_de[]="</b>";
        $array_para[]="";
        $array_de[]="<i>";
        $array_para[]="";
        $array_de[]="</i>";
        $array_para[]="";

        $x_txt_puro=str_replace($array_de,$array_para,$x_txt_html);

        $mail->Subject  = "Memória em Moderação";
        $mail->Body = $x_txt_html;
        $mail->AltBody = $x_txt_puro;

        $enviado = $mail->Send();

        $mail->ClearAllRecipients();
        $mail->ClearAttachments();

//        if ($enviado) {
//            print "<script>window.alert('E-mail enviado com sucesso!');</script>";
//        } else {
//            print "<script>window.alert('Não foi possível enviar o e-mail.');</script>";
//        }

    } else if ($funcao == 'selectAll') {
        /*seleceiona todas as entradas da tabela de memórias*/
        $query = "SELECT * FROM tbl_conteudo";

        if(!$result = $con->query($query)) {
            die('There was an error running the query [' . $con->error . ']');
        }

        $jsonObject = array();
        $i = 0;

        while ($row = $result->fetch_assoc()) {
            $jsonObject[$i] = $row;
            $i++;
        }

        $finalRes = json_encode($jsonObject);
        echo $finalRes . "<br/><br/>";

        /*seleceiona todas as entradas da tabela de resources*/
        $query2 = "SELECT * FROM tbl_resource";

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

    $con->close();  // fecha a conexão com o banco
?>
