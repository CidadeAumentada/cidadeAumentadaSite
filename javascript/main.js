/*jslint browser: true*/
/*global $, jQuery, Dropzone, codeAddress, map, markers, moveMemoria, zoom, alert, conteudoId, drawMarcador, tamMemorias, delAberto, imgUp, vidUp, audUp, txtUp*/

/*-------------------------------------------------------------------------------------------------------------------------------------
 * Declaração das variáveis globais
 */
var username,
    usernameValido = false, // controle de validez do nome de login
    senhaValido = false, // controle de validez da senha
    nomevalido = false, // controle de validez do nome
    emailValido = false, // controle de validez do email
    cpfValido = false, // controle de validez do cpf
    estado = 0, // estado do formulário de login/cadastro
    estadomem = -1, // estado do formulário de cadastro de memorias
    ultimoestado, // variável para armazenar o ultimo estado visitado do formulario de memória
    tituloValido = false, // controle de validez do titulo da memoria
    anoValido = false, // controle de validez do ano da memoria
    descricaoValido = false, // controle de validez da descricao da memoria
    arquivoEnviado = false, // controle de envio de arquivo
    dropImagem, // armazena dropzone de imagens
    dropVideo, // armazena dropzone de videos
    dropAudio, // armazena dropzone de audio
    w = window.innerWidth, // armazena largura atual da tela
    h = window.innerHeight, // armazena altura atual da tela
    bx, // posicao x do marcador de memoria
    by, // posicao y do marcador de memoria
    resizeMemoria = false, // permite reposicionamento do formulário de memoria
    resizeConteudo = false, // permite reposicionamento do conteudo das memorias
    bloqueio = false, // bloqueia interacoes quando conteudo de memoria está sendo visualizado
    permiteMov = true, // bloqueia movimento do mapa para posicionamento da memoria
    permiteVisualizacao = true, // bloqueia visualizacao de conteudo de memoria quando interagindo com outro menu
    mostraBotao = false, // controle da visualicao do botao de navegacao de imagens de memoria
    fotoAtual = 0, // foto atual vizualizada
    tamSlideshow, // quantidade de fotos na memoria
    signInAberto = false, // sinaliza se login/cadastro está aberto
    menuUserAberto = true, // sinaliza se menu de usuario está aberto
    minhasMemoriasAberto = false,
    adicionaMemAberto = false, // sinaliza se cadastro de memorias está aberto
    header = true, // sinaliza se header está aberto
    mousePressed = false, // sinalisa se mouse foi pressionado
    login = false, // sinaliza se login foi realizado
    lockedMarcador = false,
    conteudoAberto = false,
    xPos,
    xPosClick,
    yPos, // posicao x e y do mouse
    yPosClick,
    abrirDescricao = false,
    buscaAberto = false,
    mouseOverLog = false,
    recursoSelecionado = 0,
    animaTipo = false,
    errCode = [0, 0, 0, 0, 0],
    marcadorClicado = false,
    drawPonto = false,
    drawLinha1 = false,
    drawLinha2 = false,
    drawLinha3 = false,
    drawLinha4 = false,
    objLenght = -1,
    imagemAberta = false,
    audioAberto = false,
    videoAberto = false,
    textoAberto = false,
    videoPlay = false,
    textHeight,
    aberto01 = false,
    aberto02 = false,
    aberto03 = false,
    aberto04 = false,
    permiteZoom = true,
    abreSetas = true,
    lockedDescricao = false,
    bloqueiaDescricao = false,
    posAtual,
    recursosAbertos = 0,
    marcadorValido = true,
    ajustando = false,
    overMemoria = false,
    dancer = new Dancer();

/*-------------------------------------------------------------------------------------------------------------------------------------
 * Validação do formulário de login/cadastro
 *
 *valida nome de usuário*/
function permiteProx() {
    "use strict";
    var newQueue = jQuery({});
    if (usernameValido && senhaValido) {
        newQueue.delay(200);
        newQueue.queue(function (next) {
            $('#prox').fadeIn('fast');
            next();
        });
    } else {
        newQueue.delay(200);
        newQueue.queue(function (next) {
            $('#prox').fadeOut('fast');
            next();
        });
    }
}

function mostraErro() {
    "use strict";
    var errMsg;

    if (errCode[0] !== 0) {
        if (errCode[0] === 1) {
            document.getElementById('erro').style.bottom = "0px";
            errMsg = "usuário não deve conter símbolos<br>e ter pelo menos 5 caracteres";
        } else if (errCode[0] === 2) {
            document.getElementById('erro').style.bottom = "7px";
            errMsg = "nome de usuário não disponível";
        }
    } else if (errCode[1] !== 0) {
        document.getElementById('erro').style.bottom = "0px";
        errMsg = "senha deve conter pelo<br>menos 6 caracteres";
    } else if (errCode[2] !== 0) {
        document.getElementById('erro').style.bottom = "7px";
        errMsg = "confirmação de senha não confere";
    } else if (errCode[3] !== 0) {
        if (errCode[3] === 1) {
            document.getElementById('erro').style.bottom = "7px";
            errMsg = "digite um email válido";
        } else if (errCode[3] === 2) {
            document.getElementById('erro').style.bottom = "7px";
            errMsg = "email digitado já está sendo utilizado";
        }
    } else if (errCode[4] !== 0) {
        if (errCode[4] === 1) {
            document.getElementById('erro').style.bottom = "7px";
            errMsg = "digite um cpf válido";
        } else if (errCode[4] === 2) {
            document.getElementById('erro').style.bottom = "7px";
            errMsg = "cpf digitado já está sendo utilizado";
        }
    } else {
        errMsg = "";
    }
    document.getElementById('erro').innerHTML = errMsg;
}

function validateUsername() {
    "use strict";
    var userName = document.getElementById('userName'), // recebe nome de usário digitado
        nameformat = /^\w+([\.'-']?\w)+$/, // controle de formato do nome
        oReq = new XMLHttpRequest(); // objeto para acesso ao webservice
    if (estado === 1) {
        if (userName.value === "") { // verifica se formulário está vazio
            usernameValido = false;
            permiteProx();
            errCode[0] = 0;
            mostraErro();
            $('#userNameInvalido').fadeOut(100);
            $('#userNameValido').fadeOut(100);
        } else if (!userName.value.match(nameformat) || userName.value.length < 5) { // verifica formato e tamanho do nome
            usernameValido = false;
            permiteProx();
            errCode[0] = 1;
            mostraErro();
            $('#userNameInvalido').fadeIn(100);
            $('#userNameValido').fadeOut(100);
        } else {
            oReq.onload = function () {
                var json = oReq.responseText, // recebe resposta do webservice
                    obj = JSON.parse(json); // transforma json em objeto de JavaScript
                if (obj.login === undefined) { // verifica se nome já existe
                    usernameValido = true;
                    errCode[0] = 0;
                    mostraErro();
                    $('#userNameInvalido').fadeOut(100);
                    $('#userNameValido').fadeIn(100);
                } else {
                    usernameValido = false;
                    errCode[0] = 2;
                    mostraErro();
                    $('#userNameValido').fadeOut(100);
                    $('#userNameInvalido').fadeIn(100);
                }
                permiteProx();
            };
        }
        oReq.open("get", "php/webservicei.php?funcao=valida_userName&userName=" + userName.value, true);
        oReq.send(); // envia dados para o webservice
    }
}

/*valida nova senha*/
function checkPass() {
    "use strict";
    var pass1 = document.getElementById('senha'), // recebe primeira senha digitada
        pass2 = document.getElementById('confirmaSenha'); // recebe segunda senha digitada
    if (estado === 1) {
        if (pass1.value.length >= 6) {
            errCode[1] = 0;
            mostraErro();
            $('#senhaValido').fadeIn(100);
            $('#senhaInvalido').fadeOut(100);
        } else if (pass1.value === "") {
            errCode[1] = 0;
            mostraErro();
            $('#senhaValido').fadeOut(100);
            $('#senhaInvalido').fadeOut(100);
        } else {
            errCode[1] = 1;
            mostraErro();
            $('#senhaValido').fadeOut(100);
            $('#senhaInvalido').fadeIn(100);
        }
        if (pass1.value === "" || pass2.value === "") { // verifica se algum dos campos está vazio
            senhaValido = false;
        } else if (pass1.value === pass2.value && pass1.value.length >= 6) { // verifica se senhas coincidem e tem mais do que 6 caracteres
            errCode[2] = 0;
            mostraErro();
            senhaValido = true;
            $('#confirmaSenhaValido').fadeIn(100);
            $('#confirmaSenhaInvalido').fadeOut(100);
        } else {
            errCode[2] = 1;
            mostraErro();
            senhaValido = false;
            $('#confirmaSenhaValido').fadeOut(100);
            $('#confirmaSenhaInvalido').fadeIn(100);
        }
        if (pass2.value === "") {
            errCode[2] = 0;
            mostraErro();
            $('#confirmaSenhaValido').fadeOut(100);
            $('#confirmaSenhaInvalido').fadeOut(100);
        }
        permiteProx();
    }
}

/*permite envio do formulário*/
function permiteEnvio() {
    "use strict";
    var newQueue2 = jQuery({});
    if (nomevalido && emailValido && cpfValido) {
        newQueue2.delay(200);
        newQueue2.queue(function (next) {
            $('#prox').fadeIn('fast');
            next();
        });
        //        $('#enviaCadastro').fadeIn('fast');
    } else {
        newQueue2.delay(200);
        newQueue2.queue(function (next) {
            $('#prox').fadeOut('fast');
            next();
        });
        //        $('#enviaCadastro').fadeOut('fast');
    }
}

/*valida nome completo do usuário*/
function validateName() {
    "use strict";
    var name = document.getElementById('nome'); // recebe nome digitado
    /*verifica se campo está vazio*/
    if (name.value === "") {
        $('#nomeValido').fadeOut(100);
        nomevalido = false;
    } else {
        $('#nomeValido').fadeIn(100);
        nomevalido = true;
    }
    permiteEnvio();
}

/*valida email do usuário*/
function validateEmail() {
    "use strict";
    var email = document.getElementById('email'), // recebe email digitado pelo usuário
        mailformat = /^\w+([\.'-']?\w+)*@\w+([\.'-']?\w+)*(\.\w{2,3})+$/, // define formato do email
        oReq = new XMLHttpRequest();
    if (email.value === "") { // verifica se o campo está vazio
        errCode[3] = 0;
        mostraErro();
        emailValido = false;
        permiteEnvio();
        $('#emailValido').fadeOut(100);
        $('#emailInvalido').fadeOut(100);
    } else if (!email.value.match(mailformat)) { // verifica o formato do email
        errCode[3] = 1;
        mostraErro();
        emailValido = false;
        permiteEnvio();
        $('#emailValido').fadeOut(100);
        $('#emailInvalido').fadeIn(100);
    } else {
        oReq.onload = function () {
            var json = oReq.responseText, // recebe resposta do webservice
                obj = JSON.parse(json); // transforma json em objeto de JavaScript
            if (obj.email === undefined) { // verifica se email já está sendo utilizado
                errCode[3] = 0;
                mostraErro();
                emailValido = true;
                $('#emailValido').fadeIn(100);
                $('#emailInvalido').fadeOut(100);
            } else {
                errCode[3] = 2;
                mostraErro();
                emailValido = false;
                $('#emailValido').fadeOut(100);
                $('#emailInvalido').fadeIn(100);
            }
            permiteEnvio();
        };
    }
    oReq.open("get", "php/webservicei.php?funcao=valida_email&email=" + email.value, true);
    oReq.send(); // envia dados para o webservice
}


function remove(str, sub) {
    i = str.indexOf(sub);
    r = "";
    if (i == -1) return str; {
        r += str.substring(0, i) + remove(str.substring(i + sub.length), sub);
    }

    return r;
}

/*valida cpf do usuário*/
function validateCpf() {
    "use strict";
    var cpfinput = document.getElementById('cpf'),
        cpf, // recebe cpf digitado pelo usuário
        oReq = new XMLHttpRequest(), // objeto para acesso ao webservice
        output = [],
        i,
        mod01 = 0,
        mod02 = 0;

    cpfinput.value = cpfinput.value.replace(/\D/g, ""); //Remove tudo o que não é dígito
    cpfinput.value = cpfinput.value.replace(/(\d{3})(\d)/, "$1.$2"); //Coloca ponto entre o terceiro e o quarto dígitos
    cpfinput.value = cpfinput.value.replace(/(\d{3})(\d)/, "$1.$2"); //Coloca ponto entre o setimo e o oitava dígitos
    cpfinput.value = cpfinput.value.replace(/(\d{3})(\d)/, "$1-$2");

    cpf = cpfinput.value;
    cpf = remove(cpf, ".");
    cpf = remove(cpf, "-");

    if (cpf === "") { // verifica se o campo está vazio
        errCode[4] = 0;
        mostraErro();
        cpfValido = false;
        permiteEnvio();
        $('#cpfValido').fadeOut(100);
        $('#cpfInvalido').fadeOut(100);
    } else if (cpf === "00000000000" || cpf === "11111111111" || cpf === "22222222222" ||
        cpf === "33333333333" || cpf === "44444444444" || cpf === "55555555555" ||
        cpf === "66666666666" || cpf === "77777777777" || cpf === "88888888888" ||
        cpf === "99999999999") {
        errCode[4] = 1;
        mostraErro();
        cpfValido = false;
        permiteEnvio();
        $('#cpfValido').fadeOut(100);
        $('#cpfInvalido').fadeIn(100);
    } else if (cpf.length !== 11 || isNaN(cpf)) { // verifica o tamanho do numero digitado e se ele é de fato um numero
        errCode[4] = 1;
        mostraErro();
        cpfValido = false;
        permiteEnvio();
        $('#cpfValido').fadeOut(100);
        $('#cpfInvalido').fadeIn(100);
    } else if (cpf.length === 11) {
        for (i = 0; i < cpf.length; i += 1) {
            output.push(cpf.charAt(i));
            if (i < 9) {
                mod01 += output[i] * (i + 1);
            }
            if (i < 10) {
                mod02 += output[i] * i;
            }
        }
        mod01 = (mod01 % 11) % 10;
        mod02 = (mod02 % 11) % 10;
        if (mod01.toString() !== output[9] || mod02.toString() !== output[10]) {
            errCode[4] = 1;
            mostraErro();
            cpfValido = false;
            permiteEnvio();
            $('#cpfValido').fadeOut(100);
            $('#cpfInvalido').fadeIn(100);
        } else {
            oReq.onload = function () {
                var json = oReq.responseText, // recebe resposta do webservice
                    obj = JSON.parse(json); // transforma json em objeto de JavaScript
                if (obj.cpf === undefined) { // verifica se o cpf já está em uso
                    errCode[4] = 0;
                    mostraErro();
                    cpfValido = true;
                    $('#cpfValido').fadeIn(100);
                    $('#cpfInvalido').fadeOut(100);
                } else {
                    errCode[4] = 2;
                    mostraErro();
                    cpfValido = false;
                    $('#cpfValido').fadeOut(100);
                    $('#cpfInvalido').fadeIn(100);
                }
                permiteEnvio();
            };
        }
        oReq.open("get", "php/webservicei.php?funcao=valida_cpf&cpf=" + cpf, true);
        oReq.send(); // envia dados ao webservice
    }
}

/*envia dados de novo usuário para serem inseridos no banco de dados*/
function novoUsuario(name, email, cpf, userName, senha) {
    "use strict";
    var oReq = new XMLHttpRequest(), // objeto para acesso ao webservice
        getData = { // objeto para guardar informacoes a serem enviadas
            nome: name,
            email: email,
            cpf: cpf,
            userName: userName,
            senha: senha
        },
        json = JSON.stringify(getData); // transforma objeto de JavaScript em json
    oReq.open("get", "php/webservicei.php?funcao=novoUsuario&getData=" + json, true);
    oReq.send(); // envia dados ao webservice
}

/*-------------------------------------------------------------------------------------------------------------------------------------
 * Mostra/Oculta interface caso login tenha sido realizado
 */
function getusername(nome) {
    "use strict";
    var queue = jQuery({});
    username = nome;
    if (nome !== "") {
        menuUserAberto = true;
        document.getElementById('nomelog').innerHTML = "olá, <span>" + nome + "</span>!";
        $('#novaMemoria').show();
        $('#sair').show();
        $('#botaoLogin').css('filter', 'invert(0)');
        $('#botaoLogin').css('-o-filter', 'invert(0)');
        $('#botaoLogin').css('-ms-filter', 'invert(0)');
        $('#botaoLogin').css('-moz-filter', 'invert(0)');
        $('#botaoLogin').css('-webkit-filter', 'invert(0)');
        $('#menuUser').show();
        login = true;
    } else {
        queue.queue(function (next) {
            menuUserAberto = false;
            login = false;
            $('#videoIntroDiv').show();
            $('#videoIntro').trigger('load');
            next();
        });
        queue.delay(100);
        queue.queue(function (next) {
            $('#videoIntro').trigger('play');
            next();
        });
    }
    $('#conteudoMemoria').css({
        "bottom": (h / 2),
        "right": (w / 2)
    });
}

function escondeVideo() {
    $('#videoIntroDiv').fadeOut(300);
    $('#videoIntro').first().attr('src', '');
}

/*-------------------------------------------------------------------------------------------------------------------------------------
 * Validação do formulário de envio de memoria
 *
 *Mostra/Oculta botao para avancar formulario*/
function proxMem() {
    "use strict";
    var newQueue = jQuery({});
    /*verifica se informacoies são validas*/
    if (tituloValido && anoValido && descricaoValido && abreSetas) {
        newQueue.queue(function (next) {
            abreSetas = false;
            if ($('#antmem').css('left') !== '115px') {
                $('#antmem').animate({
                    left: '115px'
                }, 300);
            }
            next();
        });
        newQueue.delay(300);
        newQueue.queue(function (next) {
            $("#proxmem").fadeIn(300);
            next();
        });
    } else if (!tituloValido || !anoValido || !descricaoValido) {
        newQueue.queue(function (next) {
            $("#proxmem").fadeOut(300);
            next();
        });
        newQueue.delay(300);
        newQueue.queue(function (next) {
            if ($('#antmem').css('left') !== '170px') {
                $('#antmem').animate({
                    left: '170px'
                }, 300);
            }
            abreSetas = true;
            next();
        });
    }
}

/*valida titulo da memoria*/
function validateTitle() {
    "use strict";
    var name = document.getElementById('inputNomeMemoria'); // recebe titulo digitado
    /*verifica se o campo está vazio*/
    if (name.value === "") {
        tituloValido = false;
    } else {
        tituloValido = true;
    }
    proxMem();
}

/*valida ano da memoria*/
function validateAno() {
    "use strict";
    var ano = document.getElementById('inputAno'), // recebe ano digitado
        anoatual = new Date().getFullYear(); // recebe ano atual
    if (ano.value === "") { // verifica se o campo está vazio
        anoValido = false;
    } else if (ano.value.length !== 4 || isNaN(ano.value) || ano.value > anoatual) { // verifica formato e validez da data
        anoValido = false;
    } else {
        anoValido = true;
    }
    proxMem();
}

/*valida descricao da memoria*/
function validateDescricao() {
    "use strict";
    var descricao = document.getElementById('inputDescricao'),
        len = descricao.value.length;
    $('#charLeftDesc').text(1000 - len);

    if (descricao.value === "") {
        descricaoValido = false;
    } else {
        descricaoValido = true;
    }
    proxMem();
}

/*Verifica se input de recurso texto está vazio*/
function checkEmpty() {
    "use strict";

    var len = document.getElementById('inputTexto').value.length;
    $('#charLeft').text(140 - len);

    if (document.getElementById('inputTexto').value !== '') {
        $('#okTexto').fadeIn('fast');
    } else {
        $('#okTexto').fadeOut('fast');
    }
}

/*Altera formato do menu para permitir posicionamento da memoria*/
function mudaMenu() {
    "use strict";
    var tempQueue = jQuery({});
    tempQueue.queue(function (next) {
        $('#mensagemEnvia').fadeOut('fast');
        $('#endereco').fadeOut('fast');
        //        $('#numero').fadeOut('fast');
        $('#buscarendereco').fadeOut('fast');
        next();
    });
    tempQueue.delay(500);
    tempQueue.queue(function (next) {
        $('#antmem').css('opacity', '0.7');
        $('#antmem').fadeIn('fast');
        $('#inputNomeMemoria').fadeIn('fast');
        $('#inputAno').fadeIn('fast');
        $('#inputDescricao').fadeIn('fast');
        $('#descricao').fadeIn('fast');
        $('#charLeftDesc').fadeIn('fast');
        $('#descricao').fadeIn('fast');
        estadomem = 0;
        proxMem();
        codeAddress(); // completa formulário com informacoes do endereco digitado
        moveMemoria(); // atualiza visualizacao das memorias
        next();
    });
}

function verificaEndereco() {
    var endereco = document.getElementById('inputEndereco');

    if (endereco.value === "") {
        $('#buscarendereco').fadeOut('fast');
    } else {
        $('#buscarendereco').fadeIn('fast');
    }
}

/*Envia informacoes da memoria para o banco*/
function enviaMem(nome, ano, descricao, rua, bairro, cidade, estado, lat, lng, login, texto, imagem, video, audio) {
    "use strict";
    var oReq = new XMLHttpRequest(), // variavel para acesso ao webservice
        getData = { // objeto que recebe as informações relaticas à memória
            nome: nome,
            ano: ano,
            descricao: descricao,
            rua: rua,
            bairro: bairro,
            cidade: cidade,
            estado: estado,
            lat: lat,
            lng: lng,
            login: login,
            texto: texto,
            imagem: imagem,
            video: video,
            audio: audio
        },
        json = JSON.stringify(getData); // transforma objeto de JavaScript em json

    if (texto !== '') {
        var oReq2 = new XMLHttpRequest(),
            id = document.getElementById('idImagem').value;
        oReq2.open("get", "php/uploadTextoi.php?id=" + id + "&texto=" + texto, true);
        oReq2.send();
    }

    oReq.onload = function () {
        var jsonRes = oReq.responseText, // receber resposta do webservice
            obj = JSON.parse(jsonRes);
    };
    oReq.open("get", "php/webmemoriai.php?funcao=novaMemoria&getData=" + json, true); // define função do webservice
    oReq.send(); // envia dados ao webservice
}

/*-------------------------------------------------------------------------------------------------------------------------------------
 * Alterna botão da busca de endereco
 */
function verificaBusca() {
    "use strict";
    //    var val = document.getElementById('buscaEndereco').value,
    //        tempQueue = jQuery({});
    //    if (val === "") {
    //        tempQueue.queue(function (next) {
    //            $('#botaoBusca').fadeOut('fast');
    //            next();
    //        });
    //        tempQueue.delay(200);
    //        tempQueue.queue(function (next) {
    //            $('#cancelabusca').fadeIn('fast');
    //            next();
    //        });
    //    } else {
    //        tempQueue.queue(function (next) {
    //            $('#cancelabusca').fadeOut('fast');
    //            next();
    //        });
    //        tempQueue.delay(200);
    //        tempQueue.queue(function (next) {
    //            $('#botaoBusca').fadeIn('fast');
    //            next();
    //        });
    //    }
}

function abreMemoria(id) {
    "use strict";
    $(document).ready(function () {
        var tempQueue2 = jQuery({}),
            oReq = new XMLHttpRequest(),
            oReq2 = new XMLHttpRequest(),
            j;

        permiteMov = false;
//        bloqueio = true;
        imagemAberta = false;
        abrirDescricao = false;
        audioAberto = false;
        videoAberto = false;
        textoAberto = false;
        videoPlay = false;
        drawLinha1 = false;
        drawLinha2 = false;
        drawLinha3 = false;
        drawLinha4 = false;
        aberto01 = false;
        aberto02 = false;
        aberto03 = false;
        aberto04 = false;
        objLenght = -1;
        recursosAbertos = 0;
        dancer.pause();

        tempQueue2.queue(function (next) {
            oReq2.onload = function () {
                var json = oReq2.responseText,
                    obj = JSON.parse(json),
                    img,
                    video,
                    audio,
                    text,
                    i,
                    idResource = 1,
                    tempQueue = jQuery({});

                tempQueue.queue(function (next) {
                    //                    $('#fechaMemoria').hide();
                    $("#audioPlay").hide();
                    $('.visualizaImg').hide();
                    $('.visualizaVideo').hide();
                    $('.visualizaAudio').hide();
                    $('.visualizaTexto').hide();
                    $('.imagemResource').hide();
                    $('.audioResource').hide();
                    $('#fecharDescricao').hide();
                    $('#moveDescricao').hide();
                    $('#visuAudio').hide();
                    $('.videoResource').hide();
                    $('.textResource').hide();
                    $('#conteudoResource').children('div .1').removeClass('1');
                    $('#conteudoResource').children('div .2').removeClass('2');
                    $('#conteudoResource').children('div .3').removeClass('3');
                    $('#conteudoResource').children('div .4').removeClass('4');
                    $('.selecionado').parent().children('.estadoMem').css('cursor', 'pointer');
                    $('.selecionado').parent().children('.memoriaUserAno').fadeTo(100, 0.5).css('cursor', 'pointer');
                    $('.selecionado').fadeTo(100, 0.5).removeClass('selecionado').css('cursor', 'pointer');
                    $('#' + id).parent().children('.memoriaUser').addClass('selecionado').css('cursor', 'auto');
                    $('#' + id).parent().children('.memoriaUserAno').css('cursor', 'auto');
                    $('#' + id).css('cursor', 'auto');
                    $('.selecionado').fadeTo(100, 1);
                    $('.selecionado').parent().children('.memoriaUserAno').fadeTo(100, 1);
                    next();
                });
                tempQueue.delay(100);
                tempQueue.queue(function (next) {
                    objLenght = obj.length;
                    for (i = 0; i < obj.length; i += 1) {
                        if (obj[i].tipo_resource_id === '1') {
                            video = obj[i].resource_arquivo;
                        } else if (obj[i].tipo_resource_id === '2') {
                            img = obj[i].resource_arquivo;
                        } else if (obj[i].tipo_resource_id === '3') {
                            text = obj[i].resource_texto;
                        } else if (obj[i].tipo_resource_id === '4') {
                            audio = obj[i].resource_arquivo;
                        }
                    }

                    if (img !== undefined && img.length > 0) {
                        $('.imagemResource').addClass(idResource.toString());
                        $('.imagemResource').css({
                            backgroundImage: 'url(uploads/imagens/' + img + ')'
                        });
                        idResource += 1;
                    }
                    if (text !== undefined) {
                        $('.textResource').addClass(idResource.toString());
                        $('#textMem').text('"' + text + '"');
                        $('.textResource').hide();
                        idResource += 1;
                    }
                    if (audio !== undefined && audio.length > 0) {
                        $('.audioResource').addClass(idResource.toString());
                        $('#audioFile source').attr('src', 'uploads/audio/' + audio);
                        $("#audioFile").trigger('load');
                        idResource += 1;
                    }
                    if (video !== undefined && video.length > 0) {
                        $('.videoResource').addClass(idResource.toString());
                        $('#videoFile source').attr('src', 'uploads/video/' + video);
                        $("#videoFile").trigger('load');
                        idResource += 1;
                    }
                    next();
                });
                tempQueue.delay(100);
                tempQueue.queue(function (next) {
                    if (objLenght === 1) {
                        map.setCenter({
                            lat: markers[id].getPosition().lat(),
                            lng: markers[id].getPosition().lng() + 0.0022
                        });
                    } else {
                        map.setCenter(markers[id].getPosition());
                    }
                    zoom = 16;
                    map.setZoom(zoom);
                    $('#conteudoMemoria').show();
                    $('#conteudoResource').show();
                    $('#conteudoMemoria').css({
                        right: (w / 2)
                    });
                    next();
                });
                tempQueue.delay(150);
                tempQueue.queue(function (next) {
                    if (objLenght === 1) {
                        drawLinha1 = true;
                        if ($('#conteudoResource').children('div .1').hasClass("imagemResource")) {
                            $('.visualizaImg').css({
                                left: '-25px',
                                top: '-17.5px'
                            }).fadeTo(200, 0.5);
                        } else if ($('#conteudoResource').children('div .1').hasClass("videoResource")) {
                            $('.visualizaVideo').css({
                                left: '-25px',
                                top: '-17.5px'
                            }).fadeTo(200, 0.5);
                        } else if ($('#conteudoResource').children('div .1').hasClass("audioResource")) {
                            $('.visualizaAudio').css({
                                left: '-25px',
                                top: '-17.5px'
                            }).fadeTo(200, 0.5);
                        } else if ($('#conteudoResource').children('div .1').hasClass("textResource")) {
                            $('.visualizaTexto').css({
                                left: '-25px',
                                top: '-17.5px'
                            }).fadeTo(200, 0.5);
                        }
                    } else if (objLenght === 2) {
                        drawLinha2 = true;
                        if ($('#conteudoResource').children('div .1').hasClass("imagemResource")) {
                            $('.visualizaImg').css({
                                left: '25px',
                                top: '-60px'
                            }).fadeTo(200, 0.5);
                        } else if ($('#conteudoResource').children('div .1').hasClass("textResource")) {
                            $('.visualizaTexto').css({
                                left: '25px',
                                top: '-60px'
                            }).fadeTo(200, 0.5);
                        } else if ($('#conteudoResource').children('div .1').hasClass("audioResource")) {
                            $('.visualizaAudio').css({
                                left: '25px',
                                top: '-60px'
                            }).fadeTo(200, 0.5);
                        }

                        if ($('#conteudoResource').children('div .2').hasClass("textResource")) {
                            $('.visualizaTexto').css({
                                left: '-60px',
                                top: '25px'
                            }).fadeTo(200, 0.5);
                        } else if ($('#conteudoResource').children('div .2').hasClass("audioResource")) {
                            $('.visualizaAudio').css({
                                left: '-60px',
                                top: '25px'
                            }).fadeTo(200, 0.5);
                        } else if ($('#conteudoResource').children('div .2').hasClass("videoResource")) {
                            $('.visualizaVideo').css({
                                left: '-60px',
                                top: '25px'
                            }).fadeTo(200, 0.5);
                        }
                    } else if (objLenght === 3) {
                        drawLinha3 = true;
                        if ($('#conteudoResource').children('div .1').hasClass("imagemResource")) {
                            $('.visualizaImg').css({
                                left: '-60px',
                                top: '-60px'
                            }).fadeTo(200, 0.5);
                        } else if ($('#conteudoResource').children('div .1').hasClass("textResource")) {
                            $('.visualizaTexto').css({
                                left: '-60px',
                                top: '-60px'
                            }).fadeTo(200, 0.5);
                        }

                        if ($('#conteudoResource').children('div .2').hasClass("textResource")) {
                            $('.visualizaTexto').css({
                                left: '25px',
                                top: '-60px'
                            }).fadeTo(200, 0.5);
                        } else if ($('#conteudoResource').children('div .2').hasClass("audioResource")) {
                            $('.visualizaAudio').css({
                                left: '25px',
                                top: '-60px'
                            }).fadeTo(200, 0.5);
                        }

                        if ($('#conteudoResource').children('div .3').hasClass("audioResource")) {
                            $('.visualizaAudio').css({
                                left: '-60px',
                                top: '25px'
                            }).fadeTo(200, 0.5);
                        } else if ($('#conteudoResource').children('div .3').hasClass("videoResource")) {
                            $('.visualizaVideo').css({
                                left: '-60px',
                                top: '25px'
                            }).fadeTo(200, 0.5);
                        }

                    } else if (objLenght === 4) {
                        drawLinha4 = true;
                        $('.visualizaImg').css({
                            left: '-60px',
                            top: '-60px'
                        }).fadeTo(200, 0.5);
                        $('.visualizaTexto').css({
                            left: '25px',
                            top: '-60px'
                        }).fadeTo(200, 0.5);
                        $('.visualizaAudio').css({
                            left: '-60px',
                            top: '25px'
                        }).fadeTo(200, 0.5);
                        $('.visualizaVideo').css({
                            left: '25px',
                            top: '25px'
                        }).fadeTo(200, 0.5);
                    }
                    conteudoAberto = true;
                    next();
                });
            };
            oReq2.open("get", "php/conteudoMemoriai.php?funcao=content&id_conteudo=" + conteudoId[id], true);
            oReq2.send();
            next();
        });
        tempQueue2.queue(function (next) {
            oReq.onload = function () {
                var json = oReq.responseText,
                    obj = JSON.parse(json),
                    larg;

                $('#tituloMemoria').text(obj.conteudo_nome + " - " + obj.conteudo_ano);
                $('#descricaoMemoria').text(obj.conteudo_descricao);

                $('#coordenadalatMemoria').text(obj.conteudo_latitude_y);
                $('#coordenadalngMemoria').text(obj.conteudo_longitude_x);
                $('#criadorMemoria').text(obj.conteudo_criado_por);
                //                $('#fechaMemoria').fadeIn(200);
            };
            oReq.open("get", "php/conteudoMemoriai.php?funcao=info&id_conteudo=" + conteudoId[id], true);
            oReq.send();
            next();
        });
    });
}

function fechaMemoria() {
    "use strict";
    var tempQueue = jQuery({}),
        j;

    conteudoAberto = false;
    tempQueue.queue(function (next) {
        imagemAberta = false;
        audioAberto = false;
        videoAberto = false;
        textoAberto = false;
        drawLinha1 = false;
        drawLinha2 = false;
        drawLinha3 = false;
        drawLinha4 = false;
        aberto01 = false;
        aberto02 = false;
        aberto03 = false;
        aberto04 = false;
        abrirDescricao = false;
        objLenght = -1;
        recursosAbertos = 0;
        dancer.pause();
        $('.selecionado').parent().children('.estadoMem').css('cursor', 'pointer');
        $('.selecionado').parent().children('.memoriaUserAno').fadeTo(100, 0.5).css('cursor', 'pointer');
        $('.selecionado').fadeTo(100, 0.5).removeClass('selecionado').css('cursor', 'pointer');
        $('#fechaMemoria').fadeOut(100);
        $("#audioPlay").fadeOut(150);
        $('.visualizaImg').fadeOut(100);
        $('.visualizaVideo').fadeOut(100);
        $('.visualizaAudio').fadeOut(100);
        $('.visualizaTexto').fadeOut(100);
        $('.imagemResource').fadeOut(100);
        $('.audioResource').fadeOut(100);
        $('#visuAudio').fadeOut(100);
        $('.videoResource').fadeOut(100);
        $('.textResource').fadeOut(100);
        $('#tituloMemoria').fadeOut(100);
        $('#descricaoMemoria').fadeOut(100);
        $('#cordImg').fadeOut(100);
        $('#userImg').fadeOut(100);
        $('#coordenadalatMemoria').fadeOut(100);
        $('#coordenadalngMemoria').fadeOut(100);
        $('#criadorMemoria').fadeOut(100);
        next();
    });
    tempQueue.delay(100);
    tempQueue.queue(function (next) {
        permiteMov = true;
        $('#conteudoResource').children('div .1').removeClass('1');
        $('#conteudoResource').children('div .2').removeClass('2');
        $('#conteudoResource').children('div .3').removeClass('3');
        $('#conteudoResource').children('div .4').removeClass('4');
        $('#conteudoMemoria').hide();
        $('#conteudoDescricao').hide();
        $('#conteudoResource').hide();
        $('#tituloMemoria').text("");
        $('#descricaoMemoria').text("");
        $('#coordenadalatMemoria').text("");
        $('#coordenadalngMemoria').text("");
        $('#criadorMemoria').text("");
        $('#fecharDescricao').hide();
        $('#moveDescricao').hide();
        resizeConteudo = false;
        bloqueio = false;
        for (j = 0; j < markers.length; j += 1) {
            markers[j].setMap(map);
        }
        next();
    });
}

function deletaMemoria(id) {
    "use strict";
    $(document).ready(function () {
        var oReq = new XMLHttpRequest();

        oReq.open("get", "php/webservicei.php?funcao=deleta&id_conteudo=" + conteudoId[id], true);
        oReq.send();
    });
}

function abreDescricao() {
        var tempQueue = jQuery({});
//        tempQueue.delay(600);
        tempQueue.queue(function (next) {
            if (!abrirDescricao) {
                $('#conteudoDescricao').show();
                w = window.innerWidth;
                if (xPos > w / 2) {
                    $('#conteudoDescricao').css({
                        top: yPos - parseInt(document.getElementById('conteudoMemoria').style.bottom, 10) + 10,
                        left: xPos - parseInt(document.getElementById('conteudoMemoria').style.right, 10) + 10,
                        right: 'auto'
                    });
                } else {
                    $('#conteudoDescricao').css({
                        top: yPos - parseInt(document.getElementById('conteudoMemoria').style.bottom, 10) + 10,
                        left: 'auto',
                        right: parseInt(document.getElementById('conteudoMemoria').style.right, 10) - xPos + 10
                    });
                }
                $('#conteudoDescricao').animate({
                    width: '275px'
                }, 200);
            }
            next();
        });
        tempQueue.delay(200);
        tempQueue.queue(function (next) {
            if (!abrirDescricao) {
                $('#fecharDescricao').fadeIn(600);
                $('#moveDescricao').fadeIn(600);
                $('#tituloMemoria').slideDown(200).fadeTo(400, 1);
                $('#descricaoMemoria').slideDown(200).fadeTo(400, 1);
                $('#cordImg').slideDown(200).fadeTo(400, 1);
                $('#userImg').slideDown(200).fadeTo(400, 1);
                $('#coordenadalatMemoria').slideDown(200).fadeTo(400, 1);
                $('#coordenadalngMemoria').slideDown(200).fadeTo(400, 1);
                $('#criadorMemoria').slideDown(200).fadeTo(400, 1);
            }
            abrirDescricao = true;
            next();
        });
    }

function fechaDescricao() {
    var tempQueue = jQuery({});

    tempQueue.queue(function (next) {
        $('#conteudoDescricao').fadeOut(300);
        next();
    });
    tempQueue.delay(350);
    tempQueue.queue(function (next) {
        $('#tituloMemoria').css({
            opacity: '0',
            display: 'none'
        });
        $('#descricaoMemoria').css({
            opacity: '0',
            display: 'none'
        });
        $('#cordImg').css({
            opacity: '0',
            display: 'none'
        });
        $('#userImg').css({
            opacity: '0',
            display: 'none'
        });
        $('#coordenadalatMemoria').css({
            opacity: '0',
            display: 'none'
        });
        $('#coordenadalngMemoria').css({
            opacity: '0',
            display: 'none'
        });
        $('#criadorMemoria').css({
            opacity: '0',
            display: 'none'
        });
        $('#conteudoDescricao').css({
            width: '0px'
        });
        $('#fecharDescricao').hide();
        $('#moveDescricao').hide();
        abrirDescricao = false;
        next();
    });
}

/*-------------------------------------------------------------------------------------------------------------------------------------
 * Inicia funcoes do jQuery
 */
$(document).ready(function () {
    "use strict";

    var audiod = document.getElementById('audioFile');
    dancer.after(0, function () {
        var el = this,
            height = [],
            i = 0;

        height.push((el.getFrequency(0, 1) * 1000000) * (40 / 20000));
        height.push((el.getFrequency(2, 3) * 1000000) * (40 / 20000));
        height.push((el.getFrequency(4, 7) * 1000000) * (40 / 20000));
        height.push((el.getFrequency(8, 12) * 1000000) * (40 / 20000));
        height.push((el.getFrequency(13, 15) * 1000000) * (40 / 20000));
        height.push((el.getFrequency(16, 18) * 1000000) * (40 / 20000));
        height.push((el.getFrequency(19, 25) * 1000000) * (40 / 20000));
        height.push((el.getFrequency(26, 31) * 1000000) * (40 / 20000));
        height.push((el.getFrequency(32, 37) * 1000000) * (40 / 20000));
        height.push((el.getFrequency(38, 45) * 1000000) * (40 / 20000));
        height.push((el.getFrequency(46, 51) * 1000000) * (40 / 20000));
        height.push((el.getFrequency(52, 63) * 1000000) * (40 / 20000));
        height.push((el.getFrequency(64, 76) * 1000000) * (40 / 20000));
        height.push((el.getFrequency(77, 88) * 1000000) * (40 / 20000));
        height.push((el.getFrequency(89, 102) * 1000000) * (40 / 20000));
        height.push((el.getFrequency(103, 127) * 1000000) * (40 / 20000));
        height.push((el.getFrequency(128, 153) * 1000000) * (40 / 20000));
        height.push((el.getFrequency(154, 178) * 1000000) * (40 / 20000));
        height.push((el.getFrequency(179, 229) * 1000000) * (40 / 20000));
        height.push((el.getFrequency(230, 510) * 1000000) * (40 / 20000));


        for (i = 0; i < 20; i += 1) {
            if (height[i] < 1) {
                height[i] = 1;
            } else if (height[i] > 40) {
                height[i] = 40;
            }
        }
        $('#fr01').height(height[0]);
        $('#fr01d').height(height[0]);
        $('#fr02').height(height[1]);
        $('#fr02d').height(height[1]);
        $('#fr03').height(height[2]);
        $('#fr03d').height(height[2]);
        $('#fr04').height(height[3]);
        $('#fr04d').height(height[3]);
        $('#fr05').height(height[4]);
        $('#fr05d').height(height[4]);
        $('#fr06').height(height[5]);
        $('#fr06d').height(height[5]);
        $('#fr07').height(height[6]);
        $('#fr07d').height(height[6]);
        $('#fr08').height(height[7]);
        $('#fr08d').height(height[7]);
        $('#fr09').height(height[8]);
        $('#fr09d').height(height[8]);
        $('#fr10').height(height[9]);
        $('#fr10d').height(height[9]);
        $('#fr11').height(height[10]);
        $('#fr11d').height(height[10]);
        $('#fr12').height(height[11]);
        $('#fr12d').height(height[11]);
        $('#fr13').height(height[12]);
        $('#fr13d').height(height[12]);
        $('#fr14').height(height[13]);
        $('#fr14d').height(height[13]);
        $('#fr15').height(height[14]);
        $('#fr15d').height(height[14]);
        $('#fr16').height(height[15]);
        $('#fr16d').height(height[15]);
        $('#fr17').height(height[16]);
        $('#fr17d').height(height[16]);
        $('#fr18').height(height[17]);
        $('#fr18d').height(height[17]);
        $('#fr19').height(height[18]);
        $('#fr19d').height(height[18]);
        $('#fr20').height(height[19]);
        $('#fr20d').height(height[19]);
    }).load(audiod);

    /*Atualiza tamanhos e posicoes quando o tamanho da tela é alterado*/
    $(window).resize(function () {
        $('#processCanvas').attr('width', window.innerWidth); // Tamanho do canvas do processing
        $('#processCanvas').attr('height', window.innerHeight);
        bx = window.innerWidth / 2; // posicao do marcador de memoria
        by = window.innerHeight / 2;
        w = window.innerWidth;
        h = window.innerHeight;
        if (resizeMemoria) { // Reposiciona o formulario de memoria
            $('#novaMemoria').css({
                "bottom": (h / 2) - (350 / 2),
                "right": (w / 2) - (350 / 2)
            });
        }
        if (resizeConteudo) { // Reposiciona a interface de conteudo de memoria
            $('#conteudoMemoria').css({
                bottom: (h / 2) - 175,
                right: (w / 2) - 175
            });
        } else {
            $('#conteudoMemoria').css({
                "bottom": (h / 2),
                "right": (w / 2)
            });
        }
        $('#menuOpen').css({
            "left": (w / 2) - (35 / 2)
        });
    });

    /*----------------------------------------------------------------------------------------------------------------------------------
     * Funcoes de login/cadastro
     *
     *acbre formulário de login e cadastro*/
    $('html').mousemove(function (event) {
        var tempQueue = jQuery({});
        xPos = event.pageX;
        yPos = event.pageY;
        w = window.innerWidth;
        if (xPos > w / 2 - 30 && xPos < w / 2 + 30 && yPos < 60 && !header && !mousePressed) {
            tempQueue.queue(function (next) {
                header = true;
                $('#menuOpen').fadeOut(200);
                $('#header').animate({
                    height: '60px'
                }, 200);
                $('#formBusca').animate({
                    top: '80px'
                }, 200);
                next();
            });
            tempQueue.delay(300);
            tempQueue.queue(function (next) {
                if (login) {
                    $('#sair').fadeIn(300);
                }
                $('#botaoLogin').fadeIn(300);
                $('#logoImg').fadeIn(300);
                $('#falha').fadeIn(300);
                next();
            });
        }
        if (lockedDescricao) {
            var xoffset = xPos - xPosClick,
                yoffset = yPos - yPosClick,
                xNovo = posAtual.left + xoffset,
                yNovo = posAtual.top + yoffset;
            $('#conteudoDescricao').css({
                left: xNovo + 'px',
                top: yNovo + 'px'
            });
        }
        if (overMemoria) {
            $('#processCanvas').css({
                cursor: 'pointer'
            });
        } else {
            $('#processCanvas').css({
                cursor: 'auto'
            });
        }
    });

    $('#botaoLogin').click(function () {
        var tempQueue = jQuery({});

        if (!login) {
            if (!signInAberto) {
                tempQueue.queue(function (next) {
                    signInAberto = true;
                    $('#signin').show();
                    $('#form').show();
                    $('#userName').animate({
                        height: '35px'
                    }, 300);
                    next();
                });
                tempQueue.delay(250);
                tempQueue.queue(function (next) {
                    $('#userName').attr('placeholder', 'usuário');
                    $('#senha').animate({
                        height: '35px'
                    }, 300);
                    next();
                });
                tempQueue.delay(250);
                tempQueue.queue(function (next) {
                    $('#senha').attr('placeholder', 'senha');
                    $('#enviaCadastro').fadeIn(300);
                    $('#novoUser').fadeIn(300);
                    next();
                });
            } else if (signInAberto) {
                if (estado !== 0) {
                    tempQueue.queue(function (next) {
                        $('#erro').text('');
                        $('#voltar').fadeOut('fast');
                        $('#prox').fadeOut('fast');
                        $('#nome').removeAttr('required');
                        $('#email').removeAttr('required');
                        $('#cpf').removeAttr('required');
                        $('#confirmaSenha').removeAttr('required');
                        $('#form').removeAttr('onsubmit');
                        $('#form').attr("action", "php/logini.php");
                        $('#confirmaSenhaValido').fadeOut(150);
                        $('#confirmaSenhaInvalido').fadeOut(150);
                        $('#confirmaSenha').attr('placeholder', '');
                        $('#confirmaSenha').val('');
                        $('#confirmaSenha').animate({
                            height: '0px'
                        }, 300);
                        $('#cpfValido').fadeOut(150);
                        $('#cpfInvalido').fadeOut(150);
                        $('#cpf').attr('placeholder', '');
                        $('#cpf').val('');
                        $('#cpf').animate({
                            height: '0px'
                        }, 300);
                        $('#enviaCadastro').fadeOut(300);
                        next();
                    });
                } else {
                    tempQueue.queue(function (next) {
                        $('#enviaCadastro').fadeOut(300);
                        $('#novoUser').fadeOut(300);
                        next();
                    });
                }
                tempQueue.delay(250);
                tempQueue.queue(function (next) {
                    $('#enviaCadastro').css('top', '85px');
                    $('#msgFinal').fadeOut(200);
                    $('#msgLogin').fadeIn(200);
                    $('#msgLoginDiv').animate({
                        right: '65px'
                    }, 200);
                    $('#msgCadastro').fadeOut(200);
                    $('#msgCadastroDiv').animate({
                        right: '55px'
                    }, 200);
                    $('#senhaValido').fadeOut(150);
                    $('#senhaInvalido').fadeOut(150);
                    $('#senha').attr('placeholder', '');
                    $('#senha').val('');
                    $('#senha').animate({
                        height: '0px'
                    }, 300);
                    $('#emailValido').fadeOut(150);
                    $('#emailInvalido').fadeOut(150);
                    $('#email').attr('placeholder', '');
                    $('#email').val('');
                    $('#email').animate({
                        height: '0px'
                    }, 300);
                    next();
                });
                tempQueue.delay(250);
                tempQueue.queue(function (next) {
                    signInAberto = false;
                    $('#userNameValido').fadeOut(150);
                    $('#userNameInvalido').fadeOut(150);
                    $('#userName').attr('placeholder', '');
                    $('#userName').val('');
                    $('#userName').animate({
                        height: '0px'
                    }, 300);
                    $('#nomeValido').fadeOut(150);
                    $('#nome').attr('placeholder', '');
                    $('#nome').val('');
                    $('#nome').animate({
                        height: '0px'
                    }, 300);
                    $('#inputuser').fadeIn('fast');
                    $('#senhamaster').fadeIn('fast');
                    estado = 0;
                    next();
                });
                tempQueue.delay(300);
                tempQueue.queue(function (next) {
                    $('#signin').hide();
                    if (!mouseOverLog) {
                        $('#msgLogin').fadeOut(200);
                        $('#msgLoginDiv').animate({
                            right: '55px'
                        }, 200);
                    }
                    document.getElementById("form").reset();
                    $('#userName').show();
                    $('#senha').show();
                    $('#confirmaSenha').show();
                    $('#signin').css('height', '110px');
                    $('#enviaCadastro').text('ENVIAR').css('width', '70px');
                    $('#nome').hide().css('height', '35px').attr('placeholder', 'nome completo');
                    $('#email').hide().css('height', '35px').attr('placeholder', 'email');
                    $('#cpf').hide().css('height', '35px').attr('placeholder', 'cpf');
                    $('#voltar').css('top', '130px');
                    nomevalido = false;
                    senhaValido = false;
                    usernameValido = false;
                    emailValido = false;
                    cpfValido = false;
                    next();
                });
            }
        } else {
            if (!menuUserAberto) {
                $('#menuUser').show();
                $('#nomelog').fadeIn(400);
                $('#minhasMemorias').fadeIn(400);
                menuUserAberto = true;
            } else if (menuUserAberto) {
                if (minhasMemoriasAberto) {
                    tempQueue.queue(function (next) {
                        menuUserAberto = false;
                        $('.DelMemMsg').fadeOut(300);
                        $('.delSim').fadeOut(300);
                        $('.delNao').fadeOut(300);
                        $('.memoriaUserDiv').fadeOut(300);
                        $('.memvazio').fadeOut(300);
                        next();
                    });
                    tempQueue.delay(300);
                    tempQueue.queue(function (next) {
                        $('.DelMemDiv').css('height', '0px');
                        $('.excluir').css('cursor', 'pointer').css('opacity', '0.3');
                        $('.estadoMem').css('cursor', 'pointer');
                        $('.memoriaUser').css('cursor', 'pointer');
                        $('.memoriaUserAno').css('cursor', 'pointer');
                        delAberto = false;
                        minhasMemoriasAberto = false;
                        $('#memorias').animate({
                            width: '0px',
                            height: '0px'
                        }, 500);
                        $('#minhasMemorias').fadeTo(200, 0.75);
                        $('#MemMsg').fadeOut(200);
                        $('#MemMsgDiv').animate({
                            right: '65px'
                        }, 200);
                        next();
                    });
                    tempQueue.delay(500);
                }
                tempQueue.queue(function (next) {
                    menuUserAberto = false;
                    $('#memorias').hide();
                    $('#nomelog').fadeOut(400);
                    $('#minhasMemorias').fadeOut(400);
                    next();
                });
                tempQueue.delay(400);
                tempQueue.queue(function (next) {
                    $('#menuUser').hide();
                    next();
                });
            }
        }
    });

    $('#botaoLogin').hover(function () {
        mouseOverLog = true;
        if (!login) {
            if (!signInAberto) {
                $('#msgLogin').fadeIn(200);
                $('#msgLoginDiv').animate({
                    right: '65px'
                }, 200);
            }
        }
    }, function () {
        mouseOverLog = false;
        if (!login) {
            if (!signInAberto) {
                $('#msgLogin').fadeOut(200);
                $('#msgLoginDiv').animate({
                    right: '45px'
                }, 200);
            }
        }
    });

    $('#zoomMais').hover(function () {
        $('#zoomMais').fadeTo(100, 0.7);
    }, function () {
        $('#zoomMais').fadeTo(100, 0.4);
    });

    $('#zoomMais').click(function () {
        zoom += 1;
        if (zoom > 18) {
            zoom = 18;
        }
        map.setZoom(zoom);
    });

    $('#zoomMenos').hover(function () {
        $('#zoomMenos').fadeTo(100, 0.7);
    }, function () {
        $('#zoomMenos').fadeTo(100, 0.4);
    });

    $('#zoomMenos').click(function () {
        zoom -= 1;
        if (zoom < 4) {
            zoom = 4;
        }
        map.setZoom(zoom);
    });

    /*Abre formulario de cadastro*/
    $('#novoUser').click(function () {
        var tempQueue = jQuery({});
        tempQueue.queue(function (next) {
            $('#confirmaSenha').animate({
                height: '35px'
            }, 300);
            $('#novoUser').fadeOut(150);
            $('#enviaCadastro').fadeOut(150);
            $('#msgLogin').fadeOut(200);
            $('#msgLoginDiv').animate({
                right: '75px'
            }, 200);
            $('#msgCadastro').fadeIn(200);
            $('#msgCadastroDiv').animate({
                right: '65px'
            }, 200);
            next();
        });
        tempQueue.delay(250);
        tempQueue.queue(function (next) {
            $('#confirmaSenha').attr('placeholder', 'confirmar senha');
            $('#voltar').fadeTo('fast', 0.6);
            //            $('#prox').fadeIn('fast');
            $('#signin').css('height', '150px');
            $('#email').attr('required', 'true');
            $('#nome').attr('required', 'true');
            $('#cpf').attr('required', 'true');
            $('#enviaCadastro').text('CADASTRAR').css('width', '93px');
            $('#confirmaSenha').attr('required', 'true');
            $('#form').attr('onsubmit', 'novoUsuario(this.name.value,this.email.value,this.cpf.value,this.userName.value,this.senha.value)');
            $('#form').attr("action", "php/novo.php");
            estado = 1;
            validateUsername(); // valida nome de usuário digitado
            checkPass();
            next();
        });
    });

    /*controla comportamento do botao prox*/
    $('#prox').click(function () {
        if (usernameValido && senhaValido && estado === 1) { // avanca etapa do formulario
            validateName();
            validateEmail();
            validateCpf();
            mostraErro();
            permiteEnvio();
            estado = 2;
            if (!nomevalido || !emailValido || !cpfValido) {
                $('#prox').fadeOut('fast');
            }
            $('#userName').fadeOut('fast');
            $('#senha').fadeOut('fast');
            $('#confirmaSenha').fadeOut('fast');
            $('#nome').css("height", "35px").fadeIn('fast');
            $('#email').css("height", "35px").fadeIn('fast');
            $('#cpf').css("height", "35px").fadeIn('fast');
            $('#userNameValido').fadeOut('fast');
            $('#senhaValido').fadeOut('fast');
            $('#confirmaSenhaValido').fadeOut('fast');
        } else if (nomevalido && emailValido && cpfValido && estado === 2) {
            estado = 3;
            $('#prox').fadeOut('fast');
            $('#nome').fadeOut('fast');
            $('#email').fadeOut('fast');
            $('#cpf').fadeOut('fast');
            $('#enviaCadastro').css('top', '55px');
            $('#voltar').css('top', '57px');
            $('#enviaCadastro').fadeIn('fast');
            $('#msgFinal').fadeIn('fast');
            $('#nomeValido').fadeOut('fast');
            $('#emailValido').fadeOut('fast');
            $('#cpfValido').fadeOut('fast');
        }
    });

    /*verifica clique do botão voltar*/
    $('#voltar').click(function () {
        var tempQueue = jQuery({});
        if (estado === 3) {
            tempQueue.queue(function (next) {
                $('#erro').text('');
                $('#enviaCadastro').fadeOut('fast');
                $('#msgFinal').fadeOut('fast');
                next();
            });
            tempQueue.delay(300);
            tempQueue.queue(function (next) {
                $('#voltar').css('top', '130px');
                $('#nomeValido').fadeIn('fast');
                $('#emailValido').fadeIn('fast');
                $('#cpfValido').fadeIn('fast');
                $('#nome').fadeIn('fast');
                $('#email').fadeIn('fast');
                $('#cpf').fadeIn('fast');
                $('#prox').fadeIn('fast');
                estado = 2;
                next();
            });
        } else if (estado === 2) {
            tempQueue.queue(function (next) {
                $('#erro').text('');
                $('#nomeValido').fadeOut('fast');
                $('#emailValido').fadeOut('fast');
                $('#emailInvalido').fadeOut('fast');
                $('#cpfValido').fadeOut('fast');
                $('#cpfInvalido').fadeOut('fast');
                $('#userName').fadeIn('fast');
                $('#senha').fadeIn('fast');
                $('#confirmaSenha').fadeIn('fast');
                $('#nome').fadeOut('fast');
                $('#email').fadeOut('fast');
                $('#cpf').fadeOut('fast');
                $('#userNameValido').fadeIn('fast');
                $('#senhaValido').fadeIn('fast');
                $('#confirmaSenhaValido').fadeIn('fast');
                next();
            });
            tempQueue.delay(300);
            tempQueue.queue(function (next) {
                $('#prox').fadeTo('fast', 0.6);
                estado = 1;
                next();
            });
        } else if (estado === 1) {
            tempQueue.queue(function (next) {
                estado = 0;
                document.getElementById("form").reset();
                $('#enviaCadastro').text('ENVIAR').css('width', '70px');
                $('#erro').text('');
                $('#enviaCadastro').css('top', '85px');
                $('#confirmaSenha').attr('placeholder', '');
                $('#confirmaSenha').animate({
                    height: '0px'
                }, 300);
                $('#voltar').fadeOut('fast');
                $('#prox').fadeOut("fast");
                $('#msgLogin').fadeIn(200);
                $('#msgLoginDiv').animate({
                    right: '65px'
                }, 200);
                $('#msgCadastro').fadeOut(200);
                $('#msgCadastroDiv').animate({
                    right: '55px'
                }, 200);
                $('#userNameValido').fadeOut('fast');
                $('#userNameInvalido').fadeOut('fast');
                $('#senhaValido').fadeOut('fast');
                $('#senhaInvalido').fadeOut('fast');
                $('#confirmaSenhaValido').fadeOut('fast');
                $('#confirmaSenhaInvalido').fadeOut('fast');
                next();
            });
            tempQueue.delay(250);
            tempQueue.queue(function (next) {
                $('#signin').css('height', '110px');
                $('#enviaCadastro').fadeIn("fast");
                $('#novoUser').fadeIn('fast');
                $('#nome').removeAttr('required');
                $('#email').removeAttr('required');
                $('#cpf').removeAttr('required');
                $('#confirmaSenha').removeAttr('required');
                $('#form').removeAttr('onsubmit');
                $('#form').attr("action", "php/logini.php");
                nomevalido = false;
                senhaValido = false;
                usernameValido = false;
                emailValido = false;
                cpfValido = false;
                next();
            });
        }
    });

    /*verifica clique do botão de envio de cadastro*/
    $('#enviaCadastro').click(function () {
        var tempQueue = jQuery({});
        if (estado !== 0) {
            tempQueue.queue(function (next) {
                $('#erro').text('');
                $('#voltar').fadeOut('fast');
                $('#prox').fadeOut('fast');
                $('#enviaCadastro').fadeOut(300);
                next();
            });
        } else {
            tempQueue.queue(function (next) {
                $('#enviaCadastro').fadeOut(300);
                $('#novoUser').fadeOut(300);
                next();
            });
        }
        tempQueue.delay(250);
        tempQueue.queue(function (next) {
            $('#msgFinal').fadeOut(200);
            $('#msgCadastro').fadeOut(200);
            $('#msgCadastroDiv').animate({
                right: '55px'
            }, 200);
            $('#senha').attr('placeholder', '');
            $('#senha').animate({
                height: '0px'
            }, 300);
            next();
        });
        tempQueue.delay(250);
        tempQueue.queue(function (next) {
            $('#userName').attr('placeholder', '');
            $('#userName').animate({
                height: '0px'
            }, 300);
            $('#inputuser').fadeIn('fast');
            $('#senhamaster').fadeIn('fast');
            next();
        });
        tempQueue.delay(300);
        tempQueue.queue(function (next) {
            $('#form').submit();
            next();
        });

    });

    $('#novoUser').hover(function () {
        $('#novoUser').css({
            color: '#fff'
        });
    }, function () {
        $('#novoUser').css({
            color: '#ccc'
        });
    });

    $('#prox').hover(function () {
        if (estado === 1) {
            $('#prox').fadeTo(100, 1);
        }
    }, function () {
        if (estado === 1) {
            $('#prox').fadeTo(100, 0.6);
        }
    });

    $('#voltar').hover(function () {
        if (estado !== 0) {
            $('#voltar').fadeTo(100, 1);
        }
    }, function () {
        if (estado !== 0) {
            $('#voltar').fadeTo(100, 0.6);
        }
    });

    $('#sair').click(function () {
        window.location.replace("php/sair.php");
    });

    $('#sair').hover(function () {
        $(this).css('text-decoration', 'underline');
    }, function () {
        $(this).css('text-decoration', 'none');
    });

    $('#minhasMemorias').click(function () {
        var tempQueue = jQuery({});

        if (!minhasMemoriasAberto && !adicionaMemAberto) {
            tempQueue.queue(function (next) {
                minhasMemoriasAberto = true;
                $('#memorias').show().animate({
                    width: '255px',
                    height: 25.6 * tamMemorias + 32 + 'px'
                }, 500);
                next();
            });
            tempQueue.delay(500);
            tempQueue.queue(function (next) {
                $('.memoriaUserDiv').fadeIn(300);
                $('.memvazio').fadeIn(300);
                next();
            });
        } else {
            tempQueue.queue(function (next) {
                minhasMemoriasAberto = false;
                $('.DelMemMsg').fadeOut(300);
                $('.delSim').fadeOut(300);
                $('.delNao').fadeOut(300);
                $('.memoriaUserDiv').fadeOut(300);
                $('.memvazio').fadeOut(300);
                next();
            });
            tempQueue.delay(300);
            tempQueue.queue(function (next) {
                $('.DelMemDiv').css('height', '0px');
                $('.excluir').css('cursor', 'pointer').css('opacity', '0.3');
                $('.estadoMem').css('cursor', 'pointer');
                $('.memoriaUser').css('cursor', 'pointer');
                $('.memoriaUserAno').css('cursor', 'pointer');
                delAberto = false;
                $('#memorias').animate({
                    width: '0px',
                    height: '0px'
                }, 500);
                next();
            });
            tempQueue.delay(500);
            tempQueue.queue(function (next) {
                $('#memorias').hide();
                next();
            });
        }
    });

    $('#minhasMemorias').hover(function () {
        if (menuUserAberto && !minhasMemoriasAberto && !adicionaMemAberto) {
            $('#minhasMemorias').fadeTo(200, 1);
            $('#MemMsg').fadeIn(200);
            $('#MemMsgDiv').animate({
                right: '75px'
            }, 200);
        }
    }, function () {
        if (!minhasMemoriasAberto) {
            $('#minhasMemorias').fadeTo(200, 0.75);
            $('#MemMsg').fadeOut(200);
            $('#MemMsgDiv').animate({
                right: '65px'
            }, 200);
        }
    });

    $('#memorias').hover(function () {
        permiteZoom = false;
    }, function () {
        permiteZoom = true;;
    });

    /*----------------------------------------------------------------------------------------------------------------------------------
     * Funcoes de cadastro de memoria
     *
     *verifica clique do botão de perfil*/
    $('#novaMemoria').click(function () {
        var tempQueue = jQuery({}),
            j;

        if (!adicionaMemAberto && !bloqueio) {
            tempQueue.queue(function (next) {
                fechaMemoria();
                adicionaMemAberto = true;
                w = window.innerWidth;
                h = window.innerHeight;
                permiteVisualizacao = false;
                $('#novaMemoria').css({
                    cursor: 'auto',
                    animation: 'color 0.5s forwards'
                });
                $('#adicionarMem').fadeOut(100);
                $('#novaMemoria').animate({
                    width: "350px",
                    height: "350px",
                    bottom: (h / 2) - (350 / 2),
                    right: (w / 2) - (350 / 2)
                }, 500);
                minhasMemoriasAberto = false;
                $('.DelMemMsg').fadeOut(300);
                $('.delSim').fadeOut(300);
                $('.delNao').fadeOut(300);
                $('.memoriaUserDiv').fadeOut(300);
                $('.memvazio').fadeOut(300);
                $('#novaMsg').hide();
                $('#novaMsgDiv').css('right', '55px');
                next();
            });
            tempQueue.delay(500);
            tempQueue.queue(function (next) {
                $('#divFormMem').show();
                $('#inputEndereco').show();
                //                $('#inputNumero').show();
                document.getElementById('mensagemEnvia').innerHTML = "digite o endereço correspondente<br>ao ponto de memória!";
                $('#mensagemEnvia').css({
                    top: '95px',
                    fontSize: '14px'
                });
                $('#mensagemEnvia').fadeIn('fast');
                $('#endereco').fadeIn('fast');
                //                $('#numero').fadeIn('fast');
                //                $('#buscarendereco').fadeIn('fast');
                verificaEndereco();
                estadomem = 0;
                permiteMov = false;
                $('#adicionarRemov').fadeIn('fast');
                resizeMemoria = true;
                for (j = 0; j < markers.length; j += 1) {
                    markers[j].setMap(null);
                }
                $('.DelMemDiv').css('height', '0px');
                $('.excluir').css('cursor', 'pointer').css('opacity', '0.3');
                $('.estadoMem').css('cursor', 'pointer');
                $('.memoriaUser').css('cursor', 'pointer');
                $('.memoriaUserAno').css('cursor', 'pointer');
                delAberto = false;
                $('#memorias').animate({
                    width: '0px',
                    height: '0px'
                }, 500);
                $('#minhasMemorias').fadeTo(200, 0.75);
                $('#MemMsg').fadeOut(200);
                $('#MemMsgDiv').animate({
                    right: '65px'
                }, 200);
                next();
            });
            tempQueue.delay(500);
            tempQueue.queue(function (next) {
                $('#memorias').hide();
                next();
            });
        }
    });

    $('#inputEndereco').keyup(function (e) {
        verificaEndereco();
    });

    /*fecha formulario de adicionar memoria*/
    $('#adicionarRemov').click(function () {
        var tempQueue = jQuery({}),
            j;
        tempQueue.queue(function (next) {
            permiteVisualizacao = true;
            $('#formImagem').resetForm();
            $('#formVideo').resetForm();
            $('#formAudio').resetForm();
            $('#newNameImg').val("");
            $('#newNameVid').val("");
            $('#newNameAud').val("");
            $('#imagemName').text("");
            $('#videoName').text("");
            $('#audioName').text("");
            $('#inputNomeMemoria').fadeOut('fast');
            $('#inputAno').fadeOut('fast');
            $('#inputDescricao').fadeOut('fast');
            $('#descricao').fadeOut('fast');
            $('#charLeftDesc').fadeOut('fast');
            $('#descricao').fadeOut('fast');
            $('#imgCam').fadeOut('fast');
            $('#formImagem').fadeOut('fast');
            $('#formVideo').fadeOut('fast');
            $('#formAudio').fadeOut('fast');
            $('#imgAudio').fadeOut('fast');
            $('#imgVideo').fadeOut('fast');
            $('#imgTexto').fadeOut('fast');
            $('#submitImagem').fadeOut('fast');
            $('#okTexto').fadeOut('fast');
            $('#submitVideo').fadeOut('fast');
            $('#submitAudio').fadeOut('fast');
            $('#sim').fadeOut('fast');
            $('#nao').fadeOut('fast');
            $('#mensagemEnvia').fadeOut('fast');
            $('#antmem').fadeOut('fast');
            $('#arraste').fadeOut('fast');
            $('#formatos').fadeOut('fast');
            $('#dropImagem').fadeOut('fast');
            $('#dropVideo').fadeOut('fast');
            $('#dropAudio').fadeOut('fast');
            $('#enviaImagem').fadeOut('fast');
            $('#enviaVideo').fadeOut('fast');
            $('#enviaAudio').fadeOut('fast');
            $('#endereco').fadeOut('fast');
            //            $('#numero').fadeOut('fast');
            $('#buscarendereco').fadeOut('fast');
            $('#concluir').fadeOut('fast');
            $('#texto').fadeOut('fast');
            $('#charLeft').fadeOut('fast');
            $('#enviaTexto').fadeOut('fast');
            $('#enviaMem').fadeOut('fast');
            $('#ajustaMem').fadeOut('fast');
            $('#divFormMem').fadeOut('fast');
            $('#menuTipo').fadeOut('fast');
            $('#pontoBranco').fadeOut('fast');
            $('#adicionarRemov').hide();
            $('#novaMemoria').animate({
                borderRadius: "50%",
                width: "55px",
                height: "55px",
                bottom: "40px",
                right: "30px"
            }, 500);
            $('#novaMemoria').css({
                border: "none",
                animation: 'transp 0.5s cubic-bezier(0.8, 0.6, 0.9, 0.74) forwards'
            });
            bx = window.innerWidth / 2;
            by = window.innerHeight / 2;
            next();
        });
        tempQueue.delay(500);
        tempQueue.queue(function (next) {
            estadomem = -1;
            if ($('#newNameImg').val() !== "") {
                var oReq = new XMLHttpRequest(); // objeto para acesso ao webservice
                oReq.open("get", "php/delete.php?nome=../uploads/imagens/" + $('#newNameImg').val(), true);
                oReq.send(); // envia dados ao webservice
            }
            if ($('#newNameVid').val() !== "") {
                var oReq = new XMLHttpRequest(); // objeto para acesso ao webservice
                oReq.open("get", "php/delete.php?nome=../uploads/video/" + $('#newNameVid').val(), true);
                oReq.send(); // envia dados ao webservice
            }
            if ($('#newNameAud').val() !== "") {
                var oReq = new XMLHttpRequest(); // objeto para acesso ao webservice
                oReq.open("get", "php/delete.php?nome=../uploads/audio/" + $('#newNameAud').val(), true);
                oReq.send(); // envia dados ao webservice
            }
            document.getElementById("formMemoria").reset();
            document.getElementById('mensagemEnvia').innerHTML = "clique no ícone para<br>adicionar uma imagem";
            $('#sim').css('top', '235px');
            $('#nao').css('top', '235px');
            $('#antmem').css({
                left: '170px',
                top: '285px',
                height: '16px'
            });
            $('#proxmem').css({
                right: '115px',
                top: '285px',
                height: '16px'
            });
            $('#mensagemEnvia').css({
                "top": "162px",
                "left": "25px"
            });
            $('#divFormMem').css({
                "border-radius": "50%",
                "height": "350px",
                "width": "350px",
                "top": "0px",
                "left": "0px"
            });
            $('#formMemoria').css({
                "border-radius": "50%",
                "height": "350px",
                "width": "350px",
                "top": "0px",
                "left": "0px"
            });
            $('#adicionarRemov').css({
                "top": "10px",
                "left": "325px"
            });
            $('#adicionarMem').css('opacity', '0.7');
            $('#adicionarMem').fadeIn('fast');
            $('#nomeMemoria').fadeIn('fast');
            $('#ano').fadeIn('fast');
            $('#imgTextoDiv').fadeIn('fast');
            $('#novaMemoria').css('cursor', 'pointer');
            $('#imgCamSmallLoad').css('height', '0%');
            $('#imgVideoSmallLoad').css('height', '0%');
            $('#imgAudioSmallLoad').css('height', '0%');
            $('#imgTextoSmallLoad').css('height', '0%');
            imgUp = false;
            vidUp = false;
            audUp = false;
            txtUp = false;
            recursoSelecionado = 0;
            tituloValido = false;
            anoValido = false;
            descricaoValido = false;
            arquivoEnviado = false;
            proxMem();
            resizeMemoria = false;
            permiteMov = true;
            bloqueio = false;
            adicionaMemAberto = false;
            for (j = 0; j < markers.length; j += 1) {
                markers[j].setMap(map);
            }
            next();
        });
    });

    /*avanca etapa do formulario de memoria*/
    $('#proxmem').click(function () {
        var tempQueue = jQuery({});
        if (estadomem === 0) {
            tempQueue.queue(function (next) {
                estadomem = 1;
                $('#nomeMemoria').fadeOut('fast');
                $('#descricao').fadeOut('fast');
                $('#ano').fadeOut('fast');
                $('#proxmem').fadeOut('fast');
                if (!arquivoEnviado) {
                    $('#antmem').animate({
                        left: '170px'
                    }, 300);
                }
                next();
            });
            tempQueue.delay(300);
            tempQueue.queue(function (next) {
                $('#menuTipo').fadeIn('fast');
                $('#mensagemEnvia').css({
                    top: '235px',
                    fontSize: '13px',
                    color: '#dedede'
                });

                if (!imgUp) {
                    recursoSelecionado = 0;
                    $('#imgCamDiv').css('left', '137.5px');
                    $('#imgCam').fadeIn('fast');
                    $('#formImagem').fadeIn('fast');
                    $('#imgCamSmall').css('cursor', 'auto');
                    $('#imgVideoSmall').css('cursor', 'pointer');
                    $('#imgAudioSmall').css('cursor', 'pointer');
                    $('#imgTextoSmall').css('cursor', 'pointer');
                    $('#pontoBranco').fadeIn('fast').css('left', '106.5px');
                    if (arquivoEnviado) {
                        document.getElementById('mensagemEnvia').innerHTML = "carregue outro recurso ou<br>siga para a próxima etapa!";
                        $('#concluir').fadeIn('fast');
                    } else {
                        document.getElementById('mensagemEnvia').innerHTML = "clique no ícone para<br>adicionar uma imagem";
                    }
                    if ($('#submitImagem').is(':visible')) {
                        $('#mensagemEnvia').fadeOut('fast');
                    } else {
                        $('#mensagemEnvia').fadeIn('fast');
                    }
                } else if (!vidUp) {
                    recursoSelecionado = 1;
                    $('#imgVideoDiv').css('left', '137.5px');
                    $('#imgVideo').fadeIn('fast');
                    $('#formVideo').fadeIn('fast');
                    $('#imgVideoSmall').css('cursor', 'auto');
                    $('#imgCamSmall').css('cursor', 'pointer');
                    $('#imgAudioSmall').css('cursor', 'pointer');
                    $('#imgTextoSmall').css('cursor', 'pointer');
                    $('#pontoBranco').fadeIn('fast').css('left', '151.5px');
                    if (arquivoEnviado) {
                        document.getElementById('mensagemEnvia').innerHTML = "carregue outro recurso ou<br>siga para a próxima etapa!";
                        $('#concluir').fadeIn('fast');
                    } else {
                        document.getElementById('mensagemEnvia').innerHTML = "clique no ícone para<br>adicionar um vídeo";
                    }
                    if ($('#submitVideo').is(':visible')) {
                        $('#mensagemEnvia').fadeOut('fast');
                    } else {
                        $('#mensagemEnvia').fadeIn('fast');
                    }
                } else if (!audUp) {
                    recursoSelecionado = 2;
                    $('#imgAudioDiv').css('left', '137.5px');
                    $('#imgAudio').fadeIn('fast');
                    $('#formAudio').fadeIn('fast');
                    $('#imgAudioSmall').css('cursor', 'auto');
                    $('#imgVideoSmall').css('cursor', 'pointer');
                    $('#imgCamSmall').css('cursor', 'pointer');
                    $('#imgTextoSmall').css('cursor', 'pointer');
                    $('#pontoBranco').fadeIn('fast').css('left', '196.5px');
                    if (arquivoEnviado) {
                        document.getElementById('mensagemEnvia').innerHTML = "carregue outro recurso ou<br>siga para a próxima etapa!";
                        $('#concluir').fadeIn('fast');
                    } else {
                        document.getElementById('mensagemEnvia').innerHTML = "clique no ícone para<br>adicionar um audio";
                    }
                    if ($('#submitAudio').is(':visible')) {
                        $('#mensagemEnvia').fadeOut('fast');
                    } else {
                        $('#mensagemEnvia').fadeIn('fast');
                    }
                } else if (!txtUp) {
                    recursoSelecionado = 3;
                    $('#imgTextoDiv').css('left', '137.5px');
                    $('#imgTexto').fadeIn('fast');
                    $('#imgTextoSmall').css('cursor', 'auto');
                    $('#imgVideoSmall').css('cursor', 'pointer');
                    $('#imgAudioSmall').css('cursor', 'pointer');
                    $('#imgCamSmall').css('cursor', 'pointer');
                    $('#pontoBranco').fadeIn('fast').css('left', '241.5px');
                    if (arquivoEnviado) {
                        document.getElementById('mensagemEnvia').innerHTML = "carregue outro recurso ou<br>siga para a próxima etapa!";
                        $('#concluir').fadeIn('fast');
                    } else {
                        document.getElementById('mensagemEnvia').innerHTML = "clique no ícone para<br>adicionar um texto";
                    }
                } else {
                    recursoSelecionado = 0;
                    $('#imgCamDiv').css('left', '137.5px');
                    $('#imgCam').fadeIn('fast');
                    $('#formImagem').fadeIn('fast');
                    $('#imgCamSmall').css('cursor', 'auto');
                    $('#imgVideoSmall').css('cursor', 'pointer');
                    $('#imgAudioSmall').css('cursor', 'pointer');
                    $('#imgTextoSmall').css('cursor', 'pointer');
                    $('#pontoBranco').fadeIn('fast').css('left', '106.5px');
                    document.getElementById('mensagemEnvia').innerHTML = "clique no ícone para<br>substituir o arquivo enviado";
                    $('#concluir').fadeIn('fast');
                }
                next();
            });
        }
    });

    /*retorna etapa do formulario de memoria*/
    $('#antmem').click(function () {
        var tempQueue = jQuery({});
        if (estadomem === 0) {
            tempQueue.queue(function (next) {
                estadomem = -1;
                $('#antmem').fadeOut('fast');
                $('#inputNomeMemoria').fadeOut('fast');
                $('#inputAno').fadeOut('fast');
                $('#inputDescricao').fadeOut('fast');
                $('#descricao').fadeOut('fast');
                $('#charLeftDesc').fadeOut('fast');
                $('#descricao').fadeOut('fast');
                $('#proxmem').fadeOut('fast');
                next();
            });
            tempQueue.delay(500);
            tempQueue.queue(function (next) {
                $('#inputEndereco').show();
                //                $('#inputNumero').show();
                document.getElementById('mensagemEnvia').innerHTML = "digite o endereço correspondente<br>ao ponto de memória!";
                $('#mensagemEnvia').css({
                    top: '95px',
                    fontSize: '14px'
                });
                $('#mensagemEnvia').fadeIn('fast');
                $('#endereco').fadeIn('fast');
                //                $('#numero').fadeIn('fast');
                //                $('#buscarendereco').fadeIn('fast');
                verificaEndereco();
                next();
            });
        } else if (estadomem === 1) {
            tempQueue.queue(function (next) {
                estadomem = 0;
                $('#concluir').fadeOut('fast');
                $('#imgCam').fadeOut('fast');
                $('#imgVideo').fadeOut('fast');
                $('#imgAudio').fadeOut('fast');
                $('#imgTexto').fadeOut('fast');
                $('#imgTextoDiv').fadeIn('fast');
                $('#texto').fadeOut('fast');
                $('#charLeft').fadeOut('fast');
                $('#okTexto').fadeOut('fast');
                $('#formImagem').fadeOut('fast');
                $('#formVideo').fadeOut('fast');
                $('#formAudio').fadeOut('fast');
                $('#menuTipo').fadeOut('fast');
                $('#mensagemEnvia').fadeOut('fast');
                $('#pontoBranco').fadeOut('fast');
                $('#antmem').animate({
                    left: '115px'
                }, 300);
                next();
            });
            tempQueue.delay(300);
            tempQueue.queue(function (next) {
                $('#nomeMemoria').fadeIn('fast');
                $('#descricao').fadeIn('fast');
                $('#ano').fadeIn('fast');
                $('#proxmem').fadeIn('fast');
                next();
            });
        } else if (estadomem === 2) {
            tempQueue.queue(function (next) {
                estadomem = 1;
                drawMarcador = false;
                document.getElementById('mensagemEnvia').innerHTML = "estamos quase lá!<br>você pode <spam>ajustar</spam> seu ponto de memória<br>movimentando o cursor no mapa ou<br><spam>confirmar</spam> o envio dos recursos";
                $('#mensagemEnvia').fadeOut('fast');
                $('#antmem').fadeOut('fast');
                $('#enviaMem').fadeOut('fast');
                $('#ajustaMem').fadeOut('fast');
                next();
            });
            tempQueue.delay(300);
            tempQueue.queue(function (next) {
                $('#menuTipo').fadeIn('fast');
                $('#mensagemEnvia').css({
                    top: '235px',
                    fontSize: '13px',
                    color: '#dedede'
                });
                $('#antmem').css({
                    left: '115px'
                }).fadeIn('fast');
                if (!imgUp) {
                    recursoSelecionado = 0;
                    $('#imgCamDiv').css('left', '137.5px');
                    $('#imgCam').fadeIn('fast');
                    $('#formImagem').fadeIn('fast');
                    $('#imgCamSmall').css('cursor', 'auto');
                    $('#imgVideoSmall').css('cursor', 'pointer');
                    $('#imgAudioSmall').css('cursor', 'pointer');
                    $('#imgTextoSmall').css('cursor', 'pointer');
                    $('#pontoBranco').fadeIn('fast').css('left', '106.5px');
                    if (arquivoEnviado) {
                        document.getElementById('mensagemEnvia').innerHTML = "carregue outro recurso ou<br>siga para a próxima etapa!";
                        $('#concluir').fadeIn('fast');
                    } else {
                        document.getElementById('mensagemEnvia').innerHTML = "clique no ícone para<br>adicionar uma imagem";
                    }
                    if ($('#submitImagem').is(':visible')) {
                        $('#mensagemEnvia').fadeOut('fast');
                    } else {
                        $('#mensagemEnvia').fadeIn('fast');
                    }
                } else if (!vidUp) {
                    recursoSelecionado = 1;
                    $('#imgVideoDiv').css('left', '137.5px');
                    $('#imgVideo').fadeIn('fast');
                    $('#formVideo').fadeIn('fast');
                    $('#imgVideoSmall').css('cursor', 'auto');
                    $('#imgCamSmall').css('cursor', 'pointer');
                    $('#imgAudioSmall').css('cursor', 'pointer');
                    $('#imgTextoSmall').css('cursor', 'pointer');
                    $('#pontoBranco').fadeIn('fast').css('left', '151.5px');
                    if (arquivoEnviado) {
                        document.getElementById('mensagemEnvia').innerHTML = "carregue outro recurso ou<br>siga para a próxima etapa!";
                        $('#concluir').fadeIn('fast');
                    } else {
                        document.getElementById('mensagemEnvia').innerHTML = "clique no ícone para<br>adicionar um vídeo";
                    }
                    if ($('#submitVideo').is(':visible')) {
                        $('#mensagemEnvia').fadeOut('fast');
                    } else {
                        $('#mensagemEnvia').fadeIn('fast');
                    }
                } else if (!audUp) {
                    recursoSelecionado = 2;
                    $('#imgAudioDiv').css('left', '137.5px');
                    $('#imgAudio').fadeIn('fast');
                    $('#formAudio').fadeIn('fast');
                    $('#imgAudioSmall').css('cursor', 'auto');
                    $('#imgVideoSmall').css('cursor', 'pointer');
                    $('#imgCamSmall').css('cursor', 'pointer');
                    $('#imgTextoSmall').css('cursor', 'pointer');
                    $('#pontoBranco').fadeIn('fast').css('left', '196.5px');
                    if (arquivoEnviado) {
                        document.getElementById('mensagemEnvia').innerHTML = "carregue outro recurso ou<br>siga para a próxima etapa!";
                        $('#concluir').fadeIn('fast');
                    } else {
                        document.getElementById('mensagemEnvia').innerHTML = "clique no ícone para<br>adicionar um audio";
                    }
                    if ($('#submitAudio').is(':visible')) {
                        $('#mensagemEnvia').fadeOut('fast');
                    } else {
                        $('#mensagemEnvia').fadeIn('fast');
                    }
                } else if (!txtUp) {
                    recursoSelecionado = 3;
                    $('#imgTextoDiv').css('left', '137.5px');
                    $('#imgTexto').fadeIn('fast');
                    $('#imgTextoSmall').css('cursor', 'auto');
                    $('#imgVideoSmall').css('cursor', 'pointer');
                    $('#imgAudioSmall').css('cursor', 'pointer');
                    $('#imgCamSmall').css('cursor', 'pointer');
                    $('#pontoBranco').fadeIn('fast').css('left', '241.5px');
                    if (arquivoEnviado) {
                        document.getElementById('mensagemEnvia').innerHTML = "carregue outro recurso ou<br>siga para a próxima etapa!";
                        $('#concluir').fadeIn('fast');
                    } else {
                        document.getElementById('mensagemEnvia').innerHTML = "clique no ícone para<br>adicionar um texto";
                    }
                } else {
                    recursoSelecionado = 0;
                    $('#imgCamDiv').css('left', '137.5px');
                    $('#imgCam').fadeIn('fast');
                    $('#formImagem').fadeIn('fast');
                    $('#imgCamSmall').css('cursor', 'auto');
                    $('#imgVideoSmall').css('cursor', 'pointer');
                    $('#imgAudioSmall').css('cursor', 'pointer');
                    $('#imgTextoSmall').css('cursor', 'pointer');
                    $('#pontoBranco').fadeIn('fast').css('left', '106.5px');
                    document.getElementById('mensagemEnvia').innerHTML = "clique no ícone para<br>substituir o arquivo enviado";
                    $('#concluir').fadeIn('fast');
                }
                next();
            });
        }
    });

    $('#imgTexto').click(function () {
        var tempQueue = jQuery({});

        tempQueue.queue(function (next) {
            $('#imgTexto').fadeOut('fast');
            $('#imgTextoDiv').fadeOut('fast');
            $('#mensagemEnvia').fadeOut('fast');
            next();
        });
        tempQueue.delay(300);
        tempQueue.queue(function (next) {
            checkEmpty();
            $('#texto').fadeIn('fast');
            $('#charLeft').fadeIn('fast');
            next();
        });
    });

    /*conclui envio de recursos*/
    $('#concluir').click(function () {
        var tempQueue = jQuery({});
        tempQueue.queue(function (next) {
            estadomem = 2;
            $('#mensagemEnvia').fadeOut(300);
            $('#concluir').fadeOut(300);
            $('#antmem').fadeOut(300);
            $('#formImagem').fadeOut(300);
            $('#formVideo').fadeOut(300);
            $('#formAudio').fadeOut(300);
            $('#texto').fadeOut(300);
            $('#charLeft').fadeOut(300);
            $('#okTexto').fadeOut(300);
            $('#imgCam').fadeOut(300);
            $('#imgVideo').fadeOut(300);
            $('#imgAudio').fadeOut(300);
            $('#imgTexto').fadeOut(300);
            $('#menuTipo').fadeOut(300);
            $('#pontoBranco').fadeOut(300);
            next();
        });
        tempQueue.delay(300);
        tempQueue.queue(function (next) {
            drawMarcador = true;
            next();
        });
        tempQueue.delay(150);
        tempQueue.queue(function (next) {
            if (marcadorValido) {
                document.getElementById('mensagemEnvia').innerHTML = "estamos quase lá!<br>você pode <spam>ajustar</spam> seu ponto de memória<br>movimentando o cursor no mapa ou<br><spam>confirmar</spam> o envio dos recursos";
                $('#enviaMem').fadeIn('fast');
                $('#ajustaMem').css({
                    left: '82px'
                });
            } else {
                document.getElementById('mensagemEnvia').innerHTML = "estamos quase lá!<br>o seu ponto está muito próximo a<br>uma memória já existente! por favor <spam>ajustar</spam><br>para uma localização válida.";
                $('#ajustaMem').css({
                    left: '130px'
                });
            }
            $('#mensagemEnvia').css({
                top: '75px'
            });
            $('#mensagemEnvia').fadeIn('fast');
            $('#antmem').css({
                left: '170px'
            });
            $('#antmem').fadeIn('fast');
            $('#ajustaMem').fadeIn('fast');
            $('#concluir').hide();
            next();
        });
    });

    /*envia informacoes da memoria para o banco*/
    $('#enviaMem').click(function () {
        var tempQueue = jQuery({}),
            nome = document.getElementById('inputNomeMemoria').value,
            ano = document.getElementById('inputAno').value,
            descricao = document.getElementById('inputDescricao').value,
            rua = document.getElementById('route').value,
            //            numero = document.getElementById('inputNumero').value,
            bairro = document.getElementById('neighborhood').value,
            cidade = document.getElementById('locality').value,
            estado = document.getElementById('administrative_area_level_1').value,
            lat = document.getElementById('inputLatitude').value,
            lng = document.getElementById('inputLongitude').value,
            login = document.getElementById('login').value,
            texto = document.getElementById('inputTexto').value,
            imagem = document.getElementById('newNameImg').value,
            video = document.getElementById('newNameVid').value,
            audio = document.getElementById('newNameAud').value;

        if (estadomem === 2) {
            tempQueue.queue(function (next) {
                enviaMem(nome, ano, descricao, rua, bairro, cidade, estado, lat, lng, login, texto, imagem, video, audio);
                $('#mensagemEnvia').fadeOut('fast');
                $('#antmem').fadeOut('fast');
                $('#enviaMem').fadeOut('fast');
                $('#ajustaMem').fadeOut('fast');
                $('#adicionarRemov').fadeOut('fast');
                next();
            });
            tempQueue.delay(300);
            tempQueue.queue(function (next) {
                drawMarcador = false;
                drawPonto = true;
                w = window.innerWidth;
                h = window.innerHeight;
                $('#novaMemoria').animate({
                    right: (w / 2),
                    bottom: (h / 2),
                    width: '0px',
                    height: '0px'
                }, 300);
                next();
            });
            tempQueue.delay(300);
            tempQueue.queue(function (next) {
                document.getElementById('mensagemEnvia').innerHTML = "memória enviada para moderação!";
                $('#mensagemEnvia').css({
                    top: '60px',
                    left: '-145px'
                });
                $('#mensagemEnvia').fadeIn('fast');
                $('#fim').fadeIn('fast');
                next();
            });
        } else if (estadomem === 3) {
            tempQueue.queue(function (next) {
                enviaMem(nome, ano, descricao, rua, bairro, cidade, estado, lat, lng, login, texto, imagem, video, audio);
                $('#enviaMem').fadeOut('fast');
                next();
            });
            tempQueue.delay(300);
            tempQueue.queue(function (next) {
                drawMarcador = false;
                drawPonto = true;
                document.getElementById('mensagemEnvia').innerHTML = "memória enviada para moderação!";
                $('#mensagemEnvia').css({
                    top: '6px',
                    left: '-100px'
                });
                $('#mensagemEnvia').fadeIn('fast');
                $('#fim').css({
                    top: '34px',
                    left: '27px'
                });
                $('#fim').fadeIn('fast');
                next();
            });
        }
    });

    $('#ajustaMem').click(function () {
        var tempQueue = jQuery({});
        tempQueue.queue(function (next) {
            estadomem = 3;
            ajustando = true;
            $('#mensagemEnvia').fadeOut('fast');
            $('#ajustaMem').fadeOut('fast');
            $('#enviaMem').fadeOut('fast');
            $('#antmem').fadeOut('fast');
            $('#adicionarRemov').fadeOut('fast');
            next();
        });
        tempQueue.delay(300);
        tempQueue.queue(function (next) {
//            zoom = 15;
//            map.setZoom(zoom);
            permiteMov = true;
            w = window.innerWidth;
            h = window.innerHeight;
            $('#novaMemoria').animate({
                right: (w / 2),
                bottom: (h / 2),
                width: '0px',
                height: '0px'
            }, 300);
            next();
        });
        tempQueue.delay(300);
        tempQueue.queue(function (next) {
            $('#novaMemoria').hide();
            next();
        });
    });

    /*Finaliza envio da memoria*/
    $('#fim').click(function () {
        location.reload();
    });

    $('#proxmem').hover(function () {
        if (estadomem === 0 || estadomem === 2 || estadomem === 3 || estadomem === 4) {
            $('#proxmem').fadeTo(100, 1);
        }
    }, function () {
        if (estadomem === 0 || estadomem === 2 || estadomem === 3 || estadomem === 4) {
            $('#proxmem').fadeTo(100, 0.7);
        }
    });

    $('#antmem').hover(function () {
        if (estadomem !== -1 && estadomem !== 9) {
            $('#antmem').fadeTo(100, 1);
        }
    }, function () {
        if (estadomem !== -1 && estadomem !== 9) {
            $('#antmem').fadeTo(100, 0.7);
        }
    });

    $('#concluir').hover(function () {
        if (estadomem !== 2) {
            $('#concluir').fadeTo(100, 1);
        }
    }, function () {
        if (estadomem !== 2) {
            $('#concluir').fadeTo(100, 0.7);
        }
    });

    $('#novaMemoria').hover(function () {
        if (!adicionaMemAberto) {
            $('#adicionarMem').fadeTo(200, 1);
            $('#novaMsg').fadeIn(200);
            $('#novaMsgDiv').animate({
                right: '65px'
            }, 200);
        }
    }, function () {
        if (!adicionaMemAberto) {
            $('#adicionarMem').fadeTo(200, 0.7);
            $('#novaMsg').fadeOut(200);
            $('#novaMsgDiv').animate({
                right: '55px'
            }, 200);
        }
    });

    $('#imgCamSmall').click(function () {
        var tempQueue = jQuery({});

        if (!animaTipo && recursoSelecionado !== 0) {
            tempQueue.queue(function (next) {
                animaTipo = true;
                $('#imgCamSmall').css('cursor', 'auto');
                $('#imgVideoSmall').css('cursor', 'auto');
                $('#imgAudioSmall').css('cursor', 'auto');
                $('#imgTextoSmall').css('cursor', 'auto');
                $('#imgCamDiv').animate({
                    left: '137.5px'
                }, 300);
                $('#pontoBranco').animate({
                    left: '106.5px'
                }, 150);
                next();
            });
            tempQueue.delay(100);
            tempQueue.queue(function (next) {
                recursoSelecionado = 0;
                $('#imgCam').fadeIn(200);
                $('#formImagem').fadeIn(200);
                if (imgUp) {
                    document.getElementById('mensagemEnvia').innerHTML = "clique no ícone para<br>substituir o arquivo enviado";
                } else if (arquivoEnviado) {
                    document.getElementById('mensagemEnvia').innerHTML = "carregue outro recurso ou<br>siga para a próxima etapa!";
                } else {
                    document.getElementById('mensagemEnvia').innerHTML = "clique no ícone para<br>adicionar uma imagem";
                }
                if ($('#submitImagem').is(':visible')) {
                    $('#mensagemEnvia').fadeOut(200);
                } else {
                    $('#mensagemEnvia').fadeIn(200);
                }
                $('#imgVideoDiv').animate({
                    left: '70px'
                }, 300);
                $('#imgAudioDiv').animate({
                    left: '70px'
                }, 300);
                $('#imgTextoDiv').animate({
                    left: '70px'
                }, 300);
                $('#imgVideo').fadeOut(250);
                $('#imgAudio').fadeOut(250);
                $('#imgTexto').fadeOut(250);
                $('#formVideo').fadeOut(200);
                $('#formAudio').fadeOut(200);
                $('#texto').fadeOut(200);
                $('#charLeft').fadeOut(200);
                $('#okTexto').fadeOut(200);
                $('#imgTextoDiv').fadeIn(200);
                next();
            });
            tempQueue.delay(325);
            tempQueue.queue(function (next) {
                animaTipo = false;
                $('#imgVideoSmall').css('cursor', 'pointer');
                $('#imgAudioSmall').css('cursor', 'pointer');
                $('#imgTextoSmall').css('cursor', 'pointer');
                $('#imgVideoDiv').css('left', '205px');
                $('#imgAudioDiv').css('left', '205px');
                $('#imgTextoDiv').css('left', '205px');
                next();
            });
        }
    });

    $('#imgVideoSmall').click(function () {
        var tempQueue = jQuery({});

        if (!animaTipo && recursoSelecionado !== 1) {
            tempQueue.queue(function (next) {
                animaTipo = true;
                $('#imgCamSmall').css('cursor', 'auto');
                $('#imgVideoSmall').css('cursor', 'auto');
                $('#imgAudioSmall').css('cursor', 'auto');
                $('#imgTextoSmall').css('cursor', 'auto');
                $('#imgVideoDiv').animate({
                    left: '137.5px'
                }, 300);
                $('#pontoBranco').animate({
                    left: '151.5px'
                }, 150);
                next();
            });
            tempQueue.delay(100);
            tempQueue.queue(function (next) {
                recursoSelecionado = 1;
                $('#imgVideo').fadeIn(200);
                $('#formVideo').fadeIn(200);
                if (vidUp) {
                    document.getElementById('mensagemEnvia').innerHTML = "clique no ícone para<br>substituir o arquivo enviado";
                } else if (arquivoEnviado) {
                    document.getElementById('mensagemEnvia').innerHTML = "carregue outro recurso ou<br>siga para a próxima etapa!";
                } else {
                    document.getElementById('mensagemEnvia').innerHTML = "clique no ícone para<br>adicionar um vídeo";
                }
                if ($('#submitVideo').is(':visible')) {
                    $('#mensagemEnvia').fadeOut(200);
                } else {
                    $('#mensagemEnvia').fadeIn(200);
                }
                $('#imgCamDiv').animate({
                    left: '70px'
                }, 300);
                $('#imgAudioDiv').animate({
                    left: '70px'
                }, 300);
                $('#imgTextoDiv').animate({
                    left: '70px'
                }, 300);
                $('#imgCam').fadeOut(250);
                $('#formImagem').fadeOut(250);
                $('#formAudio').fadeOut(250);
                $('#imgAudio').fadeOut(250);
                $('#imgTexto').fadeOut(250);
                $('#texto').fadeOut(200);
                $('#charLeft').fadeOut(200);
                $('#okTexto').fadeOut(200);
                $('#imgTextoDiv').fadeIn(200);
                next();
            });
            tempQueue.delay(325);
            tempQueue.queue(function (next) {
                animaTipo = false;
                $('#imgCamSmall').css('cursor', 'pointer');
                $('#imgAudioSmall').css('cursor', 'pointer');
                $('#imgTextoSmall').css('cursor', 'pointer');
                $('#imgCamDiv').css('left', '205px');
                $('#imgAudioDiv').css('left', '205px');
                $('#imgTextoDiv').css('left', '205px');
                next();
            });
        }
    });

    $('#imgAudioSmall').click(function () {
        var tempQueue = jQuery({});

        if (!animaTipo && recursoSelecionado !== 2) {
            tempQueue.queue(function (next) {
                animaTipo = true;
                $('#imgCamSmall').css('cursor', 'auto');
                $('#imgVideoSmall').css('cursor', 'auto');
                $('#imgAudioSmall').css('cursor', 'auto');
                $('#imgTextoSmall').css('cursor', 'auto');
                $('#imgAudioDiv').animate({
                    left: '137.5px'
                }, 300);
                $('#pontoBranco').animate({
                    left: '196.5px'
                }, 150);
                next();
            });
            tempQueue.delay(100);
            tempQueue.queue(function (next) {
                recursoSelecionado = 2;
                $('#imgAudio').fadeIn(200);
                $('#formAudio').fadeIn(250);
                if (audUp) {
                    document.getElementById('mensagemEnvia').innerHTML = "clique no ícone para<br>substituir o arquivo enviado";
                } else if (arquivoEnviado) {
                    document.getElementById('mensagemEnvia').innerHTML = "carregue outro recurso ou<br>siga para a próxima etapa!";
                } else {
                    document.getElementById('mensagemEnvia').innerHTML = "clique no ícone para<br>adicionar um audio";
                }
                if ($('#submitAudio').is(':visible')) {
                    $('#mensagemEnvia').fadeOut(200);
                } else {
                    $('#mensagemEnvia').fadeIn(200);
                }
                $('#imgCamDiv').animate({
                    left: '70px'
                }, 300);
                $('#imgVideoDiv').animate({
                    left: '70px'
                }, 300);
                $('#imgTextoDiv').animate({
                    left: '70px'
                }, 300);
                $('#imgCam').fadeOut(250);
                $('#formImagem').fadeOut(250);
                $('#formVideo').fadeOut(250);
                $('#imgVideo').fadeOut(250);
                $('#imgTexto').fadeOut(250);
                $('#texto').fadeOut(200);
                $('#charLeft').fadeOut(200);
                $('#okTexto').fadeOut(200);
                $('#imgTextoDiv').fadeIn(200);
                next();
            });
            tempQueue.delay(325);
            tempQueue.queue(function (next) {
                animaTipo = false;
                $('#imgCamSmall').css('cursor', 'pointer');
                $('#imgVideoSmall').css('cursor', 'pointer');
                $('#imgTextoSmall').css('cursor', 'pointer');
                $('#imgCamDiv').css('left', '205px');
                $('#imgVideoDiv').css('left', '205px');
                $('#imgTextoDiv').css('left', '205px');
                next();
            });
        }
    });

    $('#imgTextoSmall').click(function () {
        var tempQueue = jQuery({});

        if (!animaTipo && recursoSelecionado !== 3) {
            tempQueue.queue(function (next) {
                animaTipo = true;
                $('#imgCamSmall').css('cursor', 'auto');
                $('#imgVideoSmall').css('cursor', 'auto');
                $('#imgAudioSmall').css('cursor', 'auto');
                $('#imgTextoSmall').css('cursor', 'auto');
                $('#imgTextoDiv').animate({
                    left: '137.5px'
                }, 300);
                $('#pontoBranco').animate({
                    left: '241.5px'
                }, 150);
                next();
            });
            tempQueue.delay(100);
            tempQueue.queue(function (next) {
                recursoSelecionado = 3;
                if (txtUp) {
                    document.getElementById('mensagemEnvia').innerHTML = "clique no ícone para<br>substituir o texto enviado";
                } else if (arquivoEnviado) {
                    document.getElementById('mensagemEnvia').innerHTML = "carregue outro recurso ou<br>siga para a próxima etapa!";
                } else {
                    document.getElementById('mensagemEnvia').innerHTML = "clique no ícone para<br>adicionar um texto";
                }
                $('#imgTexto').fadeIn(200);
                $('#mensagemEnvia').fadeIn(200);
                $('#imgCamDiv').animate({
                    left: '70px'
                }, 300);
                $('#imgAudioDiv').animate({
                    left: '70px'
                }, 300);
                $('#imgVideoDiv').animate({
                    left: '70px'
                }, 300);
                $('#imgCam').fadeOut(250);
                $('#formImagem').fadeOut(250);
                $('#formVideo').fadeOut(250);
                $('#formAudio').fadeOut(250);
                $('#imgAudio').fadeOut(250);
                $('#imgVideo').fadeOut(250);
                next();
            });
            tempQueue.delay(325);
            tempQueue.queue(function (next) {
                animaTipo = false;
                $('#imgCamSmall').css('cursor', 'pointer');
                $('#imgVideoSmall').css('cursor', 'pointer');
                $('#imgAudioSmall').css('cursor', 'pointer');
                $('#imgCamDiv').css('left', '205px');
                $('#imgVideoDiv').css('left', '205px');
                $('#imgAudioDiv').css('left', '205px');
                next();
            });
        }
    });

    $(window).mousedown(function () {
        if (lockedMarcador) {
            marcadorClicado = true;
            $('#novaMemoria').fadeOut('fast');
        }
    });

    $(window).mouseup(function () {
        w = window.innerWidth;
        h = window.innerHeight;
        lockedDescricao = false;
        if (drawMarcador && marcadorClicado) {
            marcadorClicado = false;
            if (marcadorValido) {
                $('#enviaMem').css({
                    top: '0',
                    right: '0'
                }).show();
                $('#marcadorErro').hide();
            } else {
                $('#marcadorErro').show();
                $('#enviaMem').hide();
            }
            $('#divFormMem').css({
                width: '90px',
                height: '28px'
            });
            $('#novaMemoria').css({
                bottom: h - by - 80,
                right: (w - bx) - 45,
                width: '90px',
                height: '28px',
                animation: 'none',
                background: 'transparent'
            }).fadeIn('fast');
        }
    });

    /*----------------------------------------------------------------------------------------------------------------------------------
     * Funcoes de busca de endereco
     *
     *Abre barra de busca de endereco*/
    $('#formBusca').click(function () {
        var tempQueue = jQuery({});
        if ($('#atvbusca').is(":visible") && !bloqueio) {
            buscaAberto = true;
            tempQueue.queue(function (next) {
                $('#atvbusca').fadeOut('fast');
                $('#formBusca').animate({
                    width: "365px"
                }, 325);
                next();
            });
            tempQueue.delay(325);
            tempQueue.queue(function (next) {
                var offset = $('#formBusca').offset();
                $('#atvbusca').fadeOut('fast');
                $('#formBusca').animate({
                    borderRadius: "51px",
                    bottom: '41.5',
                    height: "37px",
                    width: "375px"
                }, 25);
                next();
            });
            tempQueue.delay(25);
            tempQueue.queue(function (next) {
                var offset = $('#formBusca').offset();
                $('#formBusca').animate({
                    borderRadius: "50px",
                    bottom: '40px',
                    height: "40px",
                    width: "365px"
                }, 150);
                next();
            });
            tempQueue.delay(150);
            tempQueue.queue(function (next) {
                $('#buscaEndereco').fadeIn('fast');
                $('#cancelabusca').fadeIn('fast');
                next();
            });
        }
    });

    /*Fecha barra de busca de endereco*/
    $('#cancelabusca').click(function () {
        var tempQueue = jQuery({});
        tempQueue.queue(function (next) {
            buscaAberto = false;
            $('#formBusca').animate({
                width: "30px"
            }, 350);
            $('#buscaEndereco').fadeOut('fast');
            $('#cancelabusca').fadeOut('fast');
            next();
        });
        tempQueue.delay(350);
        tempQueue.queue(function (next) {
            $('#formBusca').animate({
                width: "40px"
            }, 150);
            next();
        });
        tempQueue.delay(150);
        tempQueue.queue(function (next) {
            $('#atvbusca').fadeIn('fast');
            document.getElementById("formBusca").reset();
            next();
        });
    });

    /*Procura endereco digitado*/
    $('#botaoBusca').click(function () {
        var tempQueue = jQuery({});
        tempQueue.queue(function (next) {
            buscaAberto = false;
            $('#formBusca').animate({
                width: "30px"
            }, 400);
            $('#buscaEndereco').fadeOut('fast');
            $('#botaoBusca').fadeOut('fast');
            next();
        });
        tempQueue.delay(400);
        tempQueue.queue(function (next) {
            $('#formBusca').animate({
                width: "40px"
            }, 150);
            next();
        });
        tempQueue.delay(150);
        tempQueue.queue(function (next) {
            $('#atvbusca').fadeIn('fast');
            document.getElementById("formBusca").reset();
            next();
        });
    });

    /*animacao de feedback ao selecionar botao de busca de endereco*/
    $('#formBusca').hover(function () {
        var tempQueue = jQuery({});
        if ($('#atvbusca').is(":visible") && !bloqueio) {
            tempQueue.queue(function (next) {
                $('#atvbusca').animate({
                    right: "13px",
                    top: "12px",
                    width: "15px"
                }, 50);
                next();
            });
            tempQueue.delay(50);
            tempQueue.queue(function (next) {
                $('#atvbusca').animate({
                    right: "10px",
                    top: "9px",
                    width: "21px"
                }, 50);
                next();
            });
        }
    }, function () {});

    $('#buscaEndereco').keyup(function (e) {
        if (e.keyCode === 13) {
            searchAddress();
            var tempQueue = jQuery({});
            tempQueue.queue(function (next) {
                buscaAberto = false;
                $('#formBusca').animate({
                    width: "30px"
                }, 400);
                $('#buscaEndereco').fadeOut('fast');
                $('#botaoBusca').fadeOut('fast');
                next();
            });
            tempQueue.delay(400);
            tempQueue.queue(function (next) {
                $('#formBusca').animate({
                    width: "40px"
                }, 150);
                next();
            });
            tempQueue.delay(150);
            tempQueue.queue(function (next) {
                $('#atvbusca').fadeIn('fast');
                document.getElementById("formBusca").reset();
                next();
            });
        } else {
            var val = document.getElementById('buscaEndereco').value,
                tempQueue = jQuery({});
            if (val === "") {
                tempQueue.queue(function (next) {
                    $('#botaoBusca').fadeOut('fast');
                    next();
                });
                tempQueue.delay(200);
                tempQueue.queue(function (next) {
                    $('#cancelabusca').fadeIn('fast');
                    next();
                });
            } else {
                tempQueue.queue(function (next) {
                    $('#cancelabusca').fadeOut('fast');
                    next();
                });
                tempQueue.delay(200);
                tempQueue.queue(function (next) {
                    $('#botaoBusca').fadeIn('fast');
                    next();
                });
            }
        }
    });

    /*----------------------------------------------------------------------------------------------------------------------------------
     * Funcoes de conteudo de memória
     *
     *fecha visualizacao de conteudo*/
    $('.visualizaImg').click(function () {
        if (!imagemAberta) {
            recursosAbertos += 1;
            $(this).fadeTo(150, 1);
            if (objLenght === 1) {
                $('.imagemResource').css({
                    top: '-95px',
                    left: '35px'
                }).show();
            } else if (objLenght === 2) {
                $('.imagemResource').css({
                    top: '-205px',
                    left: '85px'
                }).show();
            } else {
                $('.imagemResource').css({
                    top: '-205px',
                    left: '-365px'
                }).show();
            }
            aberto01 = true;
            imagemAberta = true;
        } else {
            aberto01 = false;
            $(this).fadeTo(150, 0.5);
            $('.imagemResource').fadeOut(150);
            imagemAberta = false;
            recursosAbertos -= 1;
            if (recursosAbertos <= 0) {
                fechaDescricao();
            }
        }
    });

    $('.visualizaAudio').click(function () {
        if (!audioAberto) {
            recursosAbertos += 1;
            $(this).fadeTo(150, 1);
            if (objLenght === 1) {
                aberto01 = true;
                $('.audioResource').css({
                    top: '-90px',
                    left: '35px'
                }).fadeIn(150);
            } else if (objLenght === 2) {
                if ($('.audioResource').hasClass('1')) {
                    aberto01 = true;
                    $('.audioResource').css({
                        top: '-205px',
                        left: '85px'
                    }).fadeIn(150);
                } else {
                    aberto02 = true;
                    $('.audioResource').css({
                        top: '25px',
                        left: '-265px'
                    }).fadeIn(150);
                }
            } else if (objLenght === 3) {
                if ($('.audioResource').hasClass('2')) {
                    aberto02 = true;
                    $('.audioResource').css({
                        top: '-205px',
                        left: '85px'
                    }).fadeIn(150);
                } else {
                    aberto03 = true;
                    $('.audioResource').css({
                        top: '25px',
                        left: '-265px'
                    }).fadeIn(150);
                }
            } else {
                aberto03 = true;
                $('.audioResource').css({
                    top: '25px',
                    left: '-265px'
                }).fadeIn(150);
            }
            $('#visuAudio').css({
                top: '0px',
                left: '0px'
            }).fadeIn(150);
            $('#audioFile').trigger('play');
            dancer.play();
            $("#audioPause").fadeIn(150);
            audioAberto = true;
        } else {
            $(this).fadeTo(150, 0.5);
            $('.audioResource').fadeOut(150);
            $('#visuAudio').fadeOut(150);
            dancer.pause();
            $('#audioFile').trigger('pause');
            $("#audioFile").prop("currentTime", 0);
            $("#audioPlay").fadeOut(150);
            audioAberto = false;
            if (objLenght === 1) {
                aberto01 = false;
            } else if (objLenght === 2) {
                if ($('.audioResource').hasClass('1')) {
                    aberto01 = false;
                } else {
                    aberto02 = false;
                }
            } else if (objLenght === 3) {
                if ($('.audioResource').hasClass('2')) {
                    aberto02 = false;
                } else {
                    aberto03 = false;
                }
            } else {
                aberto03 = false;
            }
            recursosAbertos -= 1;
            if (recursosAbertos <= 0) {
                fechaDescricao();
            }
        }
    });

    $('.visualizaVideo').click(function () {
        if (!videoAberto) {
            recursosAbertos += 1;
            $(this).fadeTo(150, 1);
            if (objLenght === 1) {
                aberto01 = true;
                $('.videoResource').css({
                    top: '-90px',
                    left: '35px'
                }).fadeIn(150);
            } else if (objLenght === 2) {
                aberto02 = true;
                $('.videoResource').css({
                    top: '25px',
                    left: '-365px'
                }).fadeIn(150);
            } else if (objLenght === 3) {
                aberto03 = true;
                $('.videoResource').css({
                    top: '25px',
                    left: '-365px'
                }).fadeIn(150);
            } else {
                aberto04 = true;
                $('.videoResource').css({
                    top: '25px',
                    left: '85px'
                }).fadeIn(150);
            }
            $('#videoFile').trigger('play');
            videoAberto = true;
            videoPlay = true;
        } else {
            var tempQueue = jQuery({}),
                el = $(this);

            if (objLenght === 1) {
                aberto01 = false;
            } else if (objLenght === 2) {
                aberto02 = false;
            } else if (objLenght === 3) {
                aberto03 = false;
            } else {
                aberto04 = false;
            }
            recursosAbertos -= 1;
            if (recursosAbertos <= 0) {
                fechaDescricao();
            }
            tempQueue.queue(function (next) {
                el.fadeTo(150, 0.5);
                $('.videoResource').fadeOut(150);
                next();
            });
            tempQueue.delay(150);
            tempQueue.queue(function (next) {
                $('#videoFile').trigger('pause');
                $("#videoFile").prop("currentTime", 0);
                videoAberto = false;
                videoPlay = false;
                next();
            });
        }
    });

    $('.visualizaTexto').click(function () {
        if (!textoAberto) {
            recursosAbertos += 1;
            $('.textResource').show();
            var fontSize = 25,
                height = $('.textResource').height();
            while (height > 150) {
                fontSize -= 1;
                $('.textResource').css({
                    fontSize: fontSize + "px"
                });
                height = $('.textResource').height();
            }
            $(this).fadeTo(150, 1);
            if (objLenght === 1) {
                aberto01 = true;
                $('.textResource').css({
                    top: '-90px',
                    left: '35px'
                }).fadeTo(150, 1);
            } else if (objLenght === 2) {
                if ($('.textResource').hasClass('1')) {
                    aberto01 = true;
                    $('.textResource').css({
                        top: '-205px',
                        left: '85px'
                    }).fadeTo(150, 1);
                } else {
                    aberto02 = true;
                    $('.textResource').css({
                        top: '25px',
                        left: '-265px'
                    }).fadeTo(150, 1);
                }
            } else if (objLenght === 3) {
                if ($('.textResource').hasClass('1')) {
                    aberto01 = true;
                    $('.textResource').css({
                        top: '-205px',
                        left: '-265px'
                    }).fadeTo(150, 1);
                } else {
                    aberto02 = true;
                    $('.textResource').css({
                        top: '-205px',
                        left: '85px'
                    }).fadeTo(150, 1);
                }
            } else {
                aberto02 = true;
                $('.textResource').css({
                    top: '-205px',
                    left: '85px'
                }).fadeTo(150, 1);
            }
            textoAberto = true;
        } else {
            var tempQueue = jQuery({}),
                el = $(this);

            if (objLenght === 1) {
                aberto01 = false;
            } else if (objLenght === 2) {
                if ($('.textResource').hasClass('1')) {
                    aberto01 = false;
                } else {
                    aberto02 = false;
                }
            } else if (objLenght === 3) {
                if ($('.textResource').hasClass('1')) {
                    aberto01 = false;
                } else {
                    aberto02 = false;
                }
            } else {
                aberto02 = false;
            }
            recursosAbertos -= 1;
            if (recursosAbertos <= 0) {
                fechaDescricao();
            }
            tempQueue.queue(function (next) {
                el.fadeTo(150, 0.5);
                $('.textResource').fadeTo(150, 0);
                textoAberto = false;
                next();
            });
            tempQueue.delay(150);
            tempQueue.queue(function (next) {
                $('.textResource').hide();
                next();
            });
        }
    });

    $('#audioPlay').hover(function () {
        bloqueiaDescricao = true;
    }, function () {
        bloqueiaDescricao = false;
    });

    $('#audioPause').hover(function () {
        bloqueiaDescricao = true;
    }, function () {
        bloqueiaDescricao = false;
    });

    $('.imagemResource').click(function () {
        abreDescricao();
    });

    $('.textResource').click(function () {
        abreDescricao();
    });

    $('.audioResource').click(function () {
        if (!bloqueiaDescricao) {
            abreDescricao();
        }
    });

    $('.videoResource').click(function () {
        abreDescricao();
    });

    $('#fecharDescricao').click(function () {
        fechaDescricao();
    });

    $('#moveDescricao').mousedown(function () {
        lockedDescricao = true;
        xPosClick = xPos;
        yPosClick = yPos;
        posAtual = $('#conteudoDescricao').position();
    });

    $('#moveDescricao').mouseup(function () {
        lockedDescricao = false;
    });

    $(".btnResource").hover(function () {
        if (mostraBotao) {
            $(this).fadeTo('fast', 0.75);
        }
    }, function () {
        $(this).fadeTo('fast', 0);
    });

    $('#audioPlay').click(function () {
        $('#audioFile').trigger('play');
        $(this).fadeOut(200);
        $('#audioPause').fadeIn(200);
        dancer.play();
    });

    $('#audioPause').click(function () {
        $('#audioFile').trigger('pause');
        $(this).fadeOut(200);
        $('#audioPlay').fadeIn(200);
        dancer.pause();
    });

    $('#videoFile').click(function () {
        if (!videoPlay) {
            $('#videoFile').trigger('play');
            videoPlay = true;
        } else {
            $('#videoFile').trigger('pause');
            videoPlay = false;
        }
    });

    $('#fechaVideo').click(function () {
        $('#videoIntroDiv').fadeOut(300);
        $('#videoIntro').first().attr('src', '');
    });
});
