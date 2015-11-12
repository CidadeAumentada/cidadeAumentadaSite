<?php
    /*realiza login com usuário cadastrado caso informações digitadas sejam validas*/
    /*habilita mensagem de erro caso não*/

    include 'conectai.php';             // conecta com o banco de dados

    $username = $_POST['userName'];    // recebe nome de usuário
    $passprov = $_POST['senha'];       // recebe senha
    $pass = md5($passprov);            // criptografa senha recebida

    $query = "SELECT * FROM sec_users WHERE login='" . $username . "' AND pswd='" . $pass . "' AND active='Y' LIMIT 1";  // cria requerimento de procura no banco por usuário e senha compatíveis

    if(!$result = $con->query($query)) {
        die('There was an error running the query [' . $con->error . ']');
    }

    if (mysqli_num_rows($result) == 1) {
        session_start();                // inicia sessão de usuário

        $data = mysqli_fetch_array($result);   // recebe resultado do requerimento
        $_SESSION['login'] = $data['login'];  // define nome do usuário da sessão
        $_SESSION['falha'] = false;           // desabilita mensagem de erro de login

        header('location: ../index.php');     // redireciona a pagina para a pagina inicial
        die();  // finaliza processos
    } else {
        session_start();                // inicia sessão de usuário
        $_SESSION['falha'] = true;      // habilita mensagem de erro de login
        header('location: ../index.php');     // redireciona a pagina para a pagina inicial
        die();  // finaliza processos
    }

    $con->close();  // fecha conexão com banco de dados
?>
