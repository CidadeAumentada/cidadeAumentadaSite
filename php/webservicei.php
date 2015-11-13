<?php
    /*webservie relacionado as tabelas dos usuários*/

    include 'conectai.php';    // conecta com o banco de dados

    $funcao = $_GET[funcao];  // recebe função a ser executada

    if ($funcao == 'valida_email') {
        $email = $_GET[email];

        /*requerimento para verificar se email recebido já está no banco*/
        $query = "SELECT email FROM sec_users WHERE email='" . $email . "'";

        if(!$result = $con->query($query)) {
            die('There was an error running the query [' . $con->error . ']');
        }

        $jsonObject = array();
        while ($row = $result->fetch_assoc()) {
            $jsonObject = $row;
        }

        /*retorna o email caso ele já esteja no banco*/
        $finalRes = json_encode($jsonObject);

        echo $finalRes;
    } else if ($funcao == 'valida_cpf') {
        $cpf = $_GET[cpf];

        /*requerimento para verificar se o cpf já está no banco*/
        $query = "SELECT cpf FROM sec_users WHERE cpf='" . $cpf . "'";

        if(!$result = $con->query($query)) {
            die('There was an error running the query [' . $con->error . ']');
        }

        $jsonObject = array();
        while ($row = $result->fetch_assoc()) {
            $jsonObject = $row;
        }

        /*retorna o cpf caso ele já esteja no banco*/
        $finalRes = json_encode($jsonObject);

        echo $finalRes;
    } else if ($funcao == 'valida_userName') {
        $userName = $_GET[userName];

        /*requerimento para verificar se o nome de usuário já está no banco*/
        $query = "SELECT login FROM sec_users WHERE login='" . $userName . "'";
        if(!$result = $con->query($query)) {
            die('There was an error running the query [' . $con->error . ']');
        }

        $jsonObject = array();
        while ($row = $result->fetch_assoc()) {
            $jsonObject = $row;
        }

        /*retorna o nome de usuário caso ele já esteja no banco*/
        $finalRes = json_encode($jsonObject);

        echo $finalRes;
    } else if ($funcao == 'novoUsuario') {

        /*inserção de novo usuário no banco*/
        $getData = $_GET[getData];      // recebe dados a serem inseridos (json)
        $data = json_decode($getData);  // decodifica json recebido
        /*salva informações recebidas em variáveis*/
        $login = $data->{"userName"};
        $pswdprov = $data->{"senha"};
        $pswd = md5($pswdprov);  // criptografa senha recebida
        $name = $data->{"nome"};
        $email = $data->{"email"};
        $cpf = $data->{"cpf"};

        /*insere informações de usuário na tabela sec_users*/
        $insert_query = "INSERT INTO sec_users (login, pswd, name, email, active, cpf) VALUES ('$login', '$pswd', '$name', '$email', 'N', '$cpf')";
        if(!$result = $con->query($insert_query)) {
            die('There was an error running the query [' . $con->error . ']');
        }

        /*insere infomrações de usuário na tabela sec_users_groups*/
        $insert_group_query = "INSERT INTO sec_users_groups (login, group_id) VALUES ('$login', '3')";
        if(!$result = $con->query($insert_group_query)) {
            die('There was an error running the query [' . $con->error . ']');
        }

        $mail_smtp_server = "ssl://smtp.gmail.com";
        $mail_smtp_user = "inova.cidadeaumentada@gmail.com";
        $mail_smtp_pass = "inovacidades2014";
        $mail_from = "inova.cidadeaumentada@gmail.com";
        $mail_porta = "465";

        $mail_subject = "Assunto";
        $mail_format = 'H';

        $mail_to = $email;	// <---------------------

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

        $x_dest_email = $mail_to;
        $x_dest_nome = $login;     // <---------------------

        $mail->AddAddress($x_dest_email,$x_dest_nome);
        $mail->IsHTML(true);

        $x_txt_html="Olá $x_dest_nome!";   // <-----------------------------
        $x_txt_html.="<br><br>O seu cadastro está quase concluído!";
        $x_txt_html.="<br>Leia o nosso <i>termo de compromisso</i> e acesse o link abaixo para ativar seu cadastro.";
        $x_txt_html.="<br><a href='http://www.polisedemarchi.com/cidadeAumentadaSite/php/webservicei.php?funcao=confirmaCadastro&email=" . $email . "'>Ativar Cadastro</a><br>";
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

        $mail->Subject  = "Confirmação de Cadastro";
        $mail->Body = $x_txt_html;
        $mail->AltBody = $x_txt_puro;

        $enviado = $mail->Send();

        $mail->ClearAllRecipients();
        $mail->ClearAttachments();

    } else if ($funcao == 'confirmaCadastro') {

        $email = $_GET[email];

        $command = "UPDATE sec_users SET active = 'Y' WHERE email = '$email'";

        if(!$result = $con->query($command)) {
            die('There was an error running the query [' . $con->error . ']');
        }

        echo "Cadastro Realizado Com Sucesso!";

    } else if ($funcao == 'minhasMemorias') {
        $user = $_GET[user];

        $query = "SELECT conteudo_id, conteudo_nome, conteudo_ano FROM tbl_conteudo WHERE conteudo_criado_por ='" . $user . "'";

        if(!$result = $con->query($query)) {
           die('There was an error running the query [' . $con->error . ']');
        }

        $jsonObject = array();
        $i = 0;

        while ($row = $result->fetch_assoc()) {
           $jsonObject[$i][0] = $row[conteudo_id];
           $jsonObject[$i][1] = $row[conteudo_nome];
           $jsonObject[$i][2] = $row[conteudo_ano];
           $i++;
        }

        $finalRes = json_encode($jsonObject);
        echo $finalRes;
    } else if ($funcao == 'deleta') {
        $id_conteudo = $_GET[id_conteudo];

        $query02 = "SELECT * FROM tbl_conteudo WHERE conteudo_id='" . $id_conteudo . "'";

        if(!$result02 = $con->query($query02)) {
            die('There was an error running the query [' . $con->error . ']');
        }

        $row = $result02->fetch_assoc();
        $nome = $row['conteudo_nome'];
        echo $nome;
        $ano = $row['conteudo_ano'];
        echo $ano;
        $login = $row['conteudo_criado_por'];
        echo $login;

        $sql = "DELETE FROM tbl_resource WHERE conteudo_id=" . $id_conteudo;

        if ($con->query($sql) === TRUE) {
            echo "Record deleted successfully";
        } else {
            echo "Error deleting record: " . $con->error;
        }

        $sql2 = "DELETE FROM tbl_conteudo WHERE conteudo_id =" . $id_conteudo;

        if ($con->query($sql2) === TRUE) {
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
        $x_txt_html.="<br><br>A sua memória <i>" . $nome . " - " . $ano . "</i> foi excluída com sucesso!";
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

        $mail->Subject  = "Memória Excluída";
        $mail->Body = $x_txt_html;
        $mail->AltBody = $x_txt_puro;

        $enviado = $mail->Send();

        $mail->ClearAllRecipients();
        $mail->ClearAttachments();

    } else if ($funcao == 'select_all') {
        $query = "SELECT * FROM sec_users";

        if(!$result = $con->query($query)) {
            die('There was an error running the query [' . $con->error . ']');
        }

        echo $result;

        $jsonObject = array();
        $i = 0;
        while ($row = $result->fetch_assoc()) {
            $jsonObject[$i] = $row;
            $i++;
        }

        $finalRes = json_encode($jsonObject);
        echo $finalRes;

        $query = "SELECT * FROM sec_users_groups";

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
        echo "<br/><br/>" . $finalRes;
    }
    $con->close();
?>
