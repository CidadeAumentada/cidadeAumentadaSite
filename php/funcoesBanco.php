<?php
    /*
        Função usuarioExiste
            - Tem como funcionalidade verificar se há um usuario existente no banco de dados;
            - Usado na tela de login para autenticação
    */
    function usuarioExiste($usuario, $senha)
    {
        include 'conecta.php';

        $command = "SELECT COUNT(*) as resultado FROM usuario WHERE user like '$usuario' and senha like '$senha'";

        $result_query = mysqli_query($con, $command) or die (mysqli_error());

        $row = mysqli_fetch_array($result_query, MYSQL_ASSOC);

        $retorno = $row['resultado'];
        mysqli_close($con);

        if($retorno >= 1) {
            return 1;
        } else {
            return 0;
        }
    }

    /*
        Função cadastraUsuario
            - Tem como funcionalidade cadastrar o usuario;
            - Usado na tela de cadastro de usuario;
    */
    function cadastraUsuario($usuario, $senha)
    {
        include 'conecta.php';

        $command = "INSERT INTO `usuario`(`id_usuario`, `user`, `senha`) VALUES (null, '$usuario', '$senha')";

        $result_query = mysqli_query($con, $command) or die (mysqli_error($con));

        mysqli_close($con);

        if($result_query == true){
            return 1;
        } else {
            return 0;
        }
    }


    function alteraSenha($usuario, $senha)
    {
        include 'conecta.php';

        echo $usuario . " " . $senha;

        $command = "UPDATE usuario SET senha = '$senha' WHERE user = '$usuario'";

        $result_query = mysqli_query($con, $command) or die (mysqli_error($con));

        mysqli_close($con);

        if($result_query == true){
            return 1;
        } else {
            return 0;
        }
    }

    $tipo_operacao = $_GET['tipoOperacao'];
    $nomeDeUsuario = $_GET['nomeDeUsuario'];
    $senha = $_GET['senha'];
    $confirmarSenha = $_GET['confirmarSenha'];

    if ($tipo_operacao == 1) {
        $resultado = usuarioExiste($nomeDeUsuario, $senha);
        if ($resultado == 1) {
            session_start();

            $_SESSION["login"] = $nomeDeUsuario;
            $_SESSION["falhaLogin"] = 0;
            $_SESSION["falhaCadastro"] = 0;
            $_SESSION["falhaAlterar"] = 0;

            header('location: home.php');
            die();
        } else {
            session_start();

            $_SESSION["falhaLogin"] = 1;
            $_SESSION["falhaCadastro"] = 0;
            $_SESSION["falhaAlterar"] = 0;

            header('location: index.php');
            die();
        }
    } else if ($tipo_operacao == 2) {
        if ($senha != $confirmarSenha) {
            session_start();

            $_SESSION["falhaLogin"] = 0;
            $_SESSION["falhaCadastro"] = 1;
            $_SESSION["falhaAlterar"] = 0;

            header('location: index.php');
            die();
        } else {
            $resultado = cadastraUsuario($nomeDeUsuario, $senha);
            if ($resultado == 1) {
                session_start();

                $_SESSION["falhaLogin"] = 0;
                $_SESSION["falhaCadastro"] = 2;
                $_SESSION["falhaAlterar"] = 0;

                header('location: index.php');
                die();
            } else {
                session_start();

                $_SESSION["falhaLogin"] = 1;
                $_SESSION["falhaCadastro"] = 0;
                $_SESSION["falhaAlterar"] = 0;

                header('location: index.php');
                die();
            }
        }
    } else if ($tipo_operacao == 3) {
        if ($senha != $confirmarSenha) {
            session_start();

            $_SESSION["falhaLogin"] = 0;
            $_SESSION["falhaCadastro"] = 0;
            $_SESSION["falhaAlterar"] = 1;

            header('location: home.php');
            die();
        } else {
            session_start();
            $resultado = alteraSenha($_SESSION['login'], $senha);
            if ($resultado == 1) {

                $_SESSION["falhaLogin"] = 0;
                $_SESSION["falhaCadastro"] = 0;
                $_SESSION["falhaAlterar"] = 2;

                header('location: index.php');
                die();
            } else {

                $_SESSION["falhaLogin"] = 0;
                $_SESSION["falhaCadastro"] = 0;
                $_SESSION["falhaAlterar"] = 0;

                header('location: index.php');
                die();
            }
        }
    }
?>
