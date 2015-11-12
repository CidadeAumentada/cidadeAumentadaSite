<?php
    // Email parameters
    $mail_smtp_server = "ssl://smtp.gmail.com"; //"mx1.hostinger.com.br"; 			// SMTP server name or IP address
    $mail_smtp_user   = "inova.cidadeaumentada@gmail.com"; //"michele@cidadeaumentada.esy.es"; 		// SMTP user name
    $mail_smtp_pass   = "inovacidades2014"; //"meubem"; 			// SMTP password
    $mail_from        = "inova.cidadeaumentada@gmail.com"; //"michele@cidadeaumentada.esy.es";			// From email
    $mail_porta		 = "465"; //"2525"; 			// Porta

    $mail_subject     = "Assunto";
    $mail_format      = 'H';                             // Message format: (T)ext or (H)tml

    // Email parameters
    $mail_to					= "marico.castro@gmail.com";	// To email


    /* INICIO DO BLOCO DE CODIGOS */

    // Inclui o arquivo class.phpmailer.php localizado na pasta phpmailer
    require_once("/phpmailer/class.phpmailer.php");

    // Inicia a classe PHPMailer
    $mail = new PHPMailer();

    // Define os dados do servidor e tipo de conexão
    $mail->IsSMTP(); // Define que a mensagem será SMTP
    //$mail->Host = "smtp.seudominio.com.br"; // Endereço do servidor SMTP
    //$mail->SMTPAuth = true; // Autenticação
    //$mail->Username = 'e-mail@seudominio.com.br'; // Usuário do servidor SMTP
    //$mail->Password = 'sua senha'; // Senha da caixa postal utilizada

    //$mail->Host = "smtp.vivointernetdiscada.com.br"; // Endereço do servidor SMTP
    //atenção! no php.ini habilite php_openssl.dll (certifique-se de que esse dll existe na pasta de extensões definida em "extension_dir")

    $mail->SMTPSecure = false;
    $mail->CharSet = "UTF-8";

    $mail->Host = $mail_smtp_server; //"ssl://smtp.gmail.com"; // Endereço do servidor SMTP
    $mail->Port = $mail_porta;

    $mail->SMTPAuth = true; // Autenticação
    $mail->Username = $mail_smtp_user; // Usuário do servidor SMTP
    $mail->Password = $mail_smtp_pass; // Senha da caixa postal utilizada

    // Define o remetente
    $mail->From = $mail_smtp_user; //cuidado aqui! use o mesmo dominio do SMTP para não ser qualificado como SPAM (no exemplo , gmail.com)
    $mail->FromName = "Cidade Aumentada";

    //$x_dest_email = "michele.afreitas@gmail.com";
    //$x_dest_nome = "Michele Alves";
    $x_dest_email = $mail_to;
    $x_dest_nome = "Mario";
    // Define os destinatário(s)
    //$mail->AddAddress($x_dest_email,$x_dest_nome);
    $mail->AddAddress($x_dest_email,$x_dest_nome);

    //$mail->AddAddress('e-mail@destino2.com.br');
    //$mail->AddCC('michele.afreitas@gmail.com', 'Copia');
    //$mail->AddBCC('CopiaOculta@dominio.com.br', 'Copia Oculta');
    //$mail->AddBCC('michele.afreitas@gmail.com', 'Michele Alves');

    // Define os dados técnicos da Mensagem
    $mail->IsHTML(true); // Define que o e-mail será enviado como HTML
    //$mail->CharSet = 'iso-8859-1'; // Charset da mensagem (opcional)

    $x_txt_html="Olá $x_dest_nome!<br><br>";
    $x_txt_html.="<br>Você é Lindo!";
    $x_txt_html.="<br><br>Att,";
    //$x_txt_html.="<br><b><i>Serviço Automático de Recuperação de Senha</i></b>";
    $x_txt_html.="<br><b><i>Projeto Cidade Aumentada</i></b>";

    //substitui as tags HTML para o modo texto puro. Todas as TAGS da var $x_txt_html deve estar prevista aqui
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

    // Texto e Assunto
    $mail->Subject  = "Testeeeeeeeeee"; // Assunto da mensagem
    $mail->Body = $x_txt_html; //texto com formatações html
    $mail->AltBody = $x_txt_puro; //texto puro
    // Anexos (opcional)
    //$mail->AddAttachment("e:\home\login\web\documento.pdf", "novo_nome.pdf");

    // Envio da Mensagem
    $enviado = $mail->Send();

    // Limpa os destinatários e os anexos
    $mail->ClearAllRecipients();
    $mail->ClearAttachments();

    // Exibe uma mensagem de resultado
    if ($enviado) {
        print "<script>window.alert('E-mail enviado com sucesso!');</script>";
    } else {
        print "<script>window.alert('Não foi possível enviar o e-mail.');</script>";
    }

    /* FINAL DO BLOCO DE CODIGOS */
?>
