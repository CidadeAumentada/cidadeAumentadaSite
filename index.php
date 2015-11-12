<?php session_start();if(isset($_SESSION['login'])){$login=$_SESSION['login'];}?>
<!DOCTYPE html>
<html lang="pt">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title id="título_pagina">CidadeAumentada</title>

        <script type="text/javascript" src="javascript/bibliotecas/jquery.js"></script>
        <script type="text/javascript" src="javascript/bibliotecas/jquery.form.js"></script>
        <!--        <script type="text/javascript" src="javascript/bibliotecas/dropzone.js"></script>-->
        <script type="text/javascript" src="javascript/bibliotecas/processing.js"></script>
        <script type="text/javascript" src="javascript/bibliotecas/dancer.js"></script>

        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyCsoULdLsZ5WoTS2ABNtIdg2bkHKAe8cEc&language=pt&region=BR&libraries=places,visualization"></script>

        <!--
        <script src="https://use.typekit.net/moz5brl.js"></script>
        <script>try{Typekit.load({ async: true });}catch(e){}</script>
-->

        <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700,800' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" type="text/css" href="css/style.css" media="all">
        <!--        <link rel="stylesheet" type="text/css" href="css/dropzone.css" media="all">-->
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
    </head>

    <body onload="getusername(<?php echo " '" . $login . "' "?>)">
        <div id="wrapper">

            <div id="head">
                <div id="header">
                    <img src="images/logo.png" alt="InovaCidades" id="logoImg" />
                    <?php if ($_SESSION['falha']) { echo "<p id='falha'>Usuário ou Senha Inválido</p>"; } ?>
                </div>
                <img id="botaoLogin" src="images/user_2.png" alt="login">
                <div id="msgLoginDiv">
                    <p id="msgLogin">entrar</p>
                </div>
                <div id="msgCadastroDiv">
                    <p id="msgCadastro">cadastrar</p>
                </div>
            </div>

            <div id="videoIntroDiv">
                <video id="videoIntro" onended="escondeVideo();" preload="none" controls>
                    <source src="video_conceitual_final_4.mp4" type="video/mp4">
                </video>
                <div id="fechaVideo"></div>
            </div>

            <div id="signin">
                <form id="form" action="php/logini.php" method="POST">
                    <div id="inputuser">
                        <input id="userName" maxlength="15" autocomplete="off" type="text" class="input" onkeyup="validateUsername(); return false;" name="userName" placeholder="" required />
                        <img id="userNameValido" src="images/pontoVerde.png" alt="ok">
                        <img id="userNameInvalido" src="images/pontoVermelho.png" alt="ok">
                    </div>
                    <div id="senhamaster">
                        <input id="senha" autocomplete="off" type="password" class="input" onkeyup="checkPass(); return false;" name="senha" placeholder="" required />
                        <img id="senhaValido" src="images/pontoVerde.png" alt="ok">
                        <img id="senhaInvalido" src="images/pontoVermelho.png" alt="ok">
                        <input id="confirmaSenha" autocomplete="off" type="password" class="input" onkeyup="checkPass(); return false;" name="confirmaSenha" placeholder="" />
                        <img id="confirmaSenhaValido" src="images/pontoVerde.png" alt="ok">
                        <img id="confirmaSenhaInvalido" src="images/pontoVermelho.png" alt="ok">
                    </div>
                    <div id="inputnome">
                        <input id="nome" autocomplete="off" type="text" class="input" onkeyup="validateName(); return false;" name="name" placeholder="nome completo" />
                        <img id="nomeValido" src="images/pontoVerde.png" alt="ok">
                        <img id="nomeInvalido" src="images/pontoVermelho.png" alt="ok">
                    </div>
                    <div id="inputemail">
                        <input id="email" autocomplete="off" type="email" class="input" onkeyup="validateEmail(); return false;" name="email" placeholder="email" />
                        <img id="emailValido" src="images/pontoVerde.png" alt="ok">
                        <img id="emailInvalido" src="images/pontoVermelho.png" alt="ok">
                    </div>
                    <div id="inputcpf">
                        <input id="cpf" autocomplete="off" type="text" class="input" onkeyup="validateCpf(); return false;" name="cpf" placeholder="cpf" />
                        <img id="cpfValido" src="images/pontoVerde.png" alt="ok">
                        <img id="cpfInvalido" src="images/pontoVermelho.png" alt="ok">
                    </div>
                    <img id="prox" src="images/bt_dir.png" alt="prox" />
                    <div id="novoUserDiv">
                        <input id="novoUser" type="button" value="NOVO USUÁRIO?" />
                    </div>
                    <img id="voltar" src="images/bt_esq.png" alt="voltar" />
                    <p id="msgFinal">Um e-mail de confirmação será enviado para finalizar o cadastro</p>
                    <p id="enviaCadastro">ENTRAR</p>
                    <p id="erro"></p>
                    <input class="submit" type="submit">
                </form>
            </div>

            <button id='sair' type='button'>sair</button>

            <div id="menuUser">
                <p id="nomelog"></p>
                <img id="minhasMemorias" src="images/view.png" alt="mem">
                <div id="MemMsgDiv">
                    <p id="MemMsg">minhas memórias</p>
                </div>
                <div id="memorias">
                    <div id="memoriasDiv"></div>
                </div>
            </div>

            <div id="novaMemoria">
                <div id="novaMsgDiv">
                    <p id="novaMsg">nova memória</p>
                </div>

                <img id='adicionarRemov' src='images/fechar08-01.png' alt='fechar'>

                <div id="adicionarMem">
                    <img id="addImg" src="images/mais_03-01.png" alt="+" />
                </div>

                <div id="imgCamDiv">
                    <img src="images/foto.png" id="imgCam" alt="Imagem" />
                </div>

                <div id="imgVideoDiv">
                    <img src="images/video.png" id="imgVideo" alt="Video" />
                </div>

                <div id="imgAudioDiv">
                    <img src="images/audio.png" id="imgAudio" alt="Audio" />
                </div>

                <div id="imgTextoDiv">
                    <img src="images/texto.png" id="imgTexto" alt="Texto" />
                </div>

                <img id="pontoBranco" src="images/pontoBranco.png" alt="selecionado">

                <div id="menuTipo">
                    <img src="images/foto.png" id="imgCamSmall" alt="Imagem" />
                    <div id="imgCamSmallLoad"></div>
                    <img src="images/video.png" id="imgVideoSmall" alt="Video" />
                    <div id="imgVideoSmallLoad"></div>
                    <img src="images/audio.png" id="imgAudioSmall" alt="Audio" />
                    <div id="imgAudioSmallLoad"></div>
                    <img src="images/texto.png" id="imgTextoSmall" alt="Texto" />
                    <div id="imgTextoSmallLoad"></div>
                </div>

                <div id="divFormMem">
                    <form id="formMemoria" action="index.php" method="GET">
                        <div id="nomeMemoria">
                            <input id="inputNomeMemoria" autocomplete="off" maxlength="30" type="text" class="input" onkeyup="validateTitle(); return false;" name="nomeMemoria" placeholder="título" />
                        </div>

                        <div id="ano">
                            <input id="inputAno" autocomplete="off" type="text" class="input" onkeyup="validateAno(); return false;" name="ano" placeholder="ano" />
                        </div>

                        <div id="descricao">
                            <textarea id="inputDescricao" maxlength="1000" autocomplete="off" class="input" onkeyup="validateDescricao(); return false;" name="descricao" placeholder="descrição"></textarea>
                            <p id="charLeftDesc">1000</p>
                        </div>

                        <div id="texto">
                            <textarea id="inputTexto" maxlength="140" autocomplete="off" class="input" name="texto" placeholder="digite seu texto" onkeyup="checkEmpty(); return false;"></textarea>
                            <p id="charLeft">140</p>
                            <p id="okTexto">OK</p>
                        </div>

                        <div id="endereco">
                            <input id="inputEndereco" type="text" class="input" name="endereco" placeholder="endereço" onfocus="geolocate();" />
                        </div>
                        <!--
                        <div id="numero">
                            <input id="inputNumero" autocomplete="off" type="text" class="input" name="numero" placeholder="número" />
                        </div>
-->
                        <img id="buscarendereco" src="images/bt_dir.png" alt="enviar" onclick="mudaMenu();">

                        <div id="rua">
                            <input id="route" type="text" class="input" name="rua" placeholder="rua" />
                        </div>

                        <div id="bairro">
                            <input id="neighborhood" autocomplete="off" type="text" class="input" name="bairro" placeholder="bairro" />
                        </div>

                        <div id="cidade">
                            <input id="locality" autocomplete="off" type="text" class="input" name="cidade" placeholder="cidade" />
                        </div>

                        <div id="estado">
                            <input id="administrative_area_level_1" autocomplete="off" type="text" class="input" name="estado" placeholder="estado" />
                        </div>

                        <div id="latitude">
                            <input id="inputLatitude" autocomplete="off" type="text" class="input" name="latitude" />
                        </div>

                        <div id="longitude">
                            <input id="inputLongitude" autocomplete="off" type="text" class="input" name="longitude" />
                        </div>

                        <input id="login" autocomplete="off" type="text" class="input" name="login" value="<?php echo $login?>" />

                        <img id="proxmem" src="images/bt_dir.png" alt="prox" />
                        <img id="antmem" src="images/bt_esq.png" alt="voltar" />

                        <div id="enviaMem">CONFIRMAR</div>
                        <div id="ajustaMem">AJUSTAR</div>

                        <p id="marcadorErro">ponto muito próximo a uma memória existente.
                            <br>por favor ajuste o ponto para uma localização válida.</p>
                    </form>

                    <form action="php/uploadImagemi.php" method="POST" id="formImagem" enctype="multipart/form-data" target="_blank">
                        <div id="btnFileImage"></div>
                        <input type="file" id="fileInput01" name="userfile" accept="image/*">
                        <input type="hidden" id="newNameImg" name="newName">
                        <p id="imagemName"></p>
                        <div id="submitImagem">CARREGAR</div>
                    </form>

                    <form action="php/uploadVideoi.php" method="POST" id="formVideo" enctype="multipart/form-data" target="_blank">
                        <div id="btnFileVideo"></div>
                        <input type="file" id="fileInput02" name="userfile" accept="video/*">
                        <input type="hidden" id="newNameVid" name="newName">
                        <p id="videoName"></p>
                        <div id="submitVideo">CARREGAR</div>
                    </form>

                    <form action="php/uploadAudioi.php" method="POST" id="formAudio" enctype="multipart/form-data" target="_blank">
                        <div id="btnFileAudio"></div>
                        <input type="file" id="fileInput03" name="userfile" accept="audio/*">
                        <input type="hidden" id="newNameAud" name="newName">
                        <p id="audioName"></p>
                        <div id="submitAudio">CARREGAR</div>
                    </form>

                    <p id="mensagemEnvia"></p>
                    <img id="sim" src="images/bt_sim.png" alt="sim">
                    <img id="nao" src="images/bt_nao.png" alt="nao">
                    <img id="concluir" src="images/bt_dir.png">
                    <button id="enviaImagem">&lt;ENVIAR&gt;</button>
                    <button id="enviaVideo">&lt;ENVIAR&gt;</button>
                    <button id="enviaAudio">&lt;ENVIAR&gt;</button>
                    <button id="enviaTexto">&lt;ENVIAR&gt;</button>
                    <div id="fim">OK</div>
                </div>

                <form action="/file-upload" class="dropzone" id="dropImagem">
                    <input id="idImagem" type="hidden" value="-1" name="idImagem" />
                </form>

                <form action="/file-upload" class="dropzone" id="dropAudio">
                    <input id="idAudio" type="hidden" value="-1" name="idAudio" />
                </form>

                <form action="/file-upload" class="dropzone" id="dropVideo">
                    <input id="idVideo" type="hidden" value="-1" name="idVideo" />
                </form>
            </div>

            <div id="conteudoMemoria">
                <div id="divConteudo">
                    <div id="conteudoDescricao" class="noselect">
                        <p id="tituloMemoria" class="noselect"></p>
                        <p id="descricaoMemoria" class="noselect"></p>
                        <img src="images/pin_03-01.png" id="cordImg" alt="coordenadas" class="noselect">
                        <div id="coordenadas" class="noselect">
                            <p id="coordenadalatMemoria" class="noselect"></p>
                            <p id="coordenadalngMemoria" class="noselect"></p>
                        </div>
                        <img src="images/user_2.png" id="userImg" alt="contribuicao" class="noselect">
                        <p id="criadorMemoria" class="noselect"></p>
                        <img src="images/fechar08-01.png" id="fecharDescricao" alt="X" class="noselect">
                        <div id="moveDescricao" class="noselect"></div>
                    </div>
                    <div id="conteudoResource">
                        <div class="imagemResource"></div>
                        <div class="textResource">
                            <p id="textMem"></p>
                        </div>
                        <div class="audioResource">
                            <div id="visuAudio">
                                <audio id="audioFile" preload="none">
                                    <source src="">
                                </audio>
                                <div id="fr01"></div>
                                <div id="fr02"></div>
                                <div id="fr03"></div>
                                <div id="fr04"></div>
                                <div id="fr05"></div>
                                <div id="fr06"></div>
                                <div id="fr07"></div>
                                <div id="fr08"></div>
                                <div id="fr09"></div>
                                <div id="fr10"></div>
                                <div id="fr11"></div>
                                <div id="fr12"></div>
                                <div id="fr13"></div>
                                <div id="fr14"></div>
                                <div id="fr15"></div>
                                <div id="fr16"></div>
                                <div id="fr17"></div>
                                <div id="fr18"></div>
                                <div id="fr19"></div>
                                <div id="fr20"></div>
                                <div id="fr01d"></div>
                                <div id="fr02d"></div>
                                <div id="fr03d"></div>
                                <div id="fr04d"></div>
                                <div id="fr05d"></div>
                                <div id="fr06d"></div>
                                <div id="fr07d"></div>
                                <div id="fr08d"></div>
                                <div id="fr09d"></div>
                                <div id="fr10d"></div>
                                <div id="fr11d"></div>
                                <div id="fr12d"></div>
                                <div id="fr13d"></div>
                                <div id="fr14d"></div>
                                <div id="fr15d"></div>
                                <div id="fr16d"></div>
                                <div id="fr17d"></div>
                                <div id="fr18d"></div>
                                <div id="fr19d"></div>
                                <div id="fr20d"></div>
                            </div>
                            <img id="audioPlay" src="images/play-01.png" alt="play">
                            <img id="audioPause" src="images/pause-01.png" alt="pause">
                        </div>
                        <div class="videoResource">
                            <video id="videoFile" preload="none">
                                <source src="">
                            </video>
                        </div>
                    </div>
                </div>
                <img class="visualizaImg" src="images/ic_foto-01.png" alt="X">
                <img class="visualizaVideo" src="images/ic_video-01.png" alt="X">
                <img class="visualizaAudio" src="images/ic_audio-01.png" alt="X">
                <img class="visualizaTexto" src="images/ic_texto-01.png" alt="X">
            </div>

            <form id="formBusca" action="#" method="GET">
                <input id="buscaEndereco" type="text" name="busca" placeholder="busca..." onkeyup="verificaBusca(); " onfocus="geolocate();" />
                <img id="botaoBusca" src="images/busca_.png" alt="b" onclick="searchAddress();" />
                <img id="atvbusca" src="images/busca_.png" alt="b" />
                <img id="cancelabusca" src="images/fechar08-01.png" alt="X" />
                <input id="bloqueio" type="text" required="true" />
            </form>

            <img src="images/mais.png" alt="mais" id="zoomMais">
            <img src="images/menos.png" alt="menos" id="zoomMenos">
            <img src="images/baixo_branco-01.png" alt="menu" id="menuOpen">

            <div id="map-canvas"></div>
            <canvas id="processCanvas"></canvas>
            <div style="display:none"></div>
        </div>

        <script type="text/javascript" src="javascript/map.js"></script>
        <script type="text/javascript" src="javascript/main.js"></script>
        <script type="text/javascript" src="javascript/upload.js"></script>
        <script>
            /*jslint browser: true*/
            /*global $, Processing*/
            /*Atualiza o tamanho do canvas do processing.js*/
            document.getElementById("processCanvas").width = window.innerWidth;
            document.getElementById("processCanvas").height = window.innerHeight;
            /*-------------------------------------------------------------------------------------------------------------------------
             * Declaração das variáveis globais
             */

            var we = document.getElementById("processCanvas").width, // Recebe a largura atual da pagina
                he = document.getElementById("processCanvas").height; // Recebe a altura atual da pagina

            /*-------------------------------------------------------------------------------------------------------------------------
             * Função do processing.js
             */
            function sketchProc(processing) {
                "use strict";
                /*Variavies globais*/

                var px, py,
                    overMarcador = false,
                    marcadorxOffset = 0,
                    marcadoryOffset = 0,
                    xOffset = 0,
                    yOffset = 0,
                    zoomMais = {
                        x: "",
                        y: "",
                        larg: 25
                    },
                    zoomMenos = {
                        x: "",
                        y: "",
                        larg: 25
                    },
                    botaoSatelite = {
                        x: "",
                        y: "",
                        larg: 60,
                        alt: 30
                    },
                    botaoMapaRuas = {
                        x: "",
                        y: "",
                        larg: 60,
                        alt: 30
                    },
                    mapAtual = "roadmap",
                    point = new google.maps.Point("", ""),
                    position = new google.maps.LatLng("", ""),
                    imgMarcador;

                /*Funcao Setup*/
                processing.setup = function () {
                    processing.size(we, he);
                    processing.background(0, 0, 0, 0);
                    processing.noStroke();
                    processing.smooth();
                    //                        imgMarcador = processing.loadImage("images/_pin3-01.png");
                    bx = processing.width / 2.0;
                    by = processing.height / 2.0;
                };

                /*Funcao Draw*/
                processing.draw = function () {
                    var i, j, x, transp, fake;
                    zoomPos[0] = processing.mouseX;
                    zoomPos[1] = processing.mouseY;
                    /*Atualiza tamanho e cor do canvas*/
                    we = document.getElementById("processCanvas").width;
                    he = document.getElementById("processCanvas").height;
                    processing.size(we, he);
                    processing.background(0, 0, 0, 0);

                    if (drawLinha1) {
                        processing.stroke(100);
                        processing.line(posx[memAberta], posy[memAberta], we / 2 - 25, he / 2);
                        //                            if (aberto01) {
                        //                                processing.line(we/2 + 10, posy[memAberta], we/2 + 35, he/2);
                        //                            }
                    }

                    if (drawLinha2) {
                        processing.stroke(100);
                        processing.line(posx[memAberta], posy[memAberta], we / 2 + 31, he / 2 - 31);
                        processing.line(posx[memAberta], posy[memAberta], we / 2 - 31, he / 2 + 31);
                        //                            if (aberto01) {
                        //                                processing.line(we/2 + 60, he/2 - 42.5, we/2 + 85, he/2 - 42.5);
                        //                            }
                        //                            if (aberto02) {
                        //                                processing.line(we/2 - 60, he/2 + 42.5, we/2 - 85, he/2 + 42.5);
                        //                            }
                    }

                    if (drawLinha3) {
                        processing.stroke(100);
                        processing.line(posx[memAberta], posy[memAberta], we / 2 + 31, he / 2 - 31);
                        processing.line(posx[memAberta], posy[memAberta], we / 2 - 31, he / 2 - 31);
                        processing.line(posx[memAberta], posy[memAberta], we / 2 - 31, he / 2 + 31);
                        //                            if (aberto01) {
                        //                                processing.line(we/2 - 60, he/2 - 42.5, we/2 - 85, he/2 - 42.5);
                        //                            }
                        //                            if (aberto02) {
                        //                                processing.line(we/2 + 60, he/2 - 42.5, we/2 + 85, he/2 - 42.5);
                        //                            }
                        //                            if (aberto03) {
                        //                                processing.line(we/2 - 60, he/2 + 42.5, we/2 - 85, he/2 + 42.5);
                        //                            }
                    }

                    if (drawLinha4) {
                        processing.stroke(100);
                        processing.line(posx[memAberta], posy[memAberta], we / 2 + 31, he / 2 - 31);
                        processing.line(posx[memAberta], posy[memAberta], we / 2 - 31, he / 2 - 31);
                        processing.line(posx[memAberta], posy[memAberta], we / 2 - 31, he / 2 + 31);
                        processing.line(posx[memAberta], posy[memAberta], we / 2 + 31, he / 2 + 31);
                        //                            if (aberto01) {
                        //                                processing.line(we/2 - 60, he/2 - 42.5, we/2 - 85, he/2 - 42.5);
                        //                            }
                        //                            if (aberto02) {
                        //                                processing.line(we/2 + 60, he/2 - 42.5, we/2 + 85, he/2 - 42.5);
                        //                            }
                        //                            if (aberto03) {
                        //                                processing.line(we/2 - 60, he/2 + 42.5, we/2 - 85, he/2 + 42.5);
                        //                            }
                        //                            if (aberto04) {
                        //                                processing.line(we/2 + 60, he/2 + 42.5, we/2 + 85, he/2 + 42.5);
                        //                            }
                    }

                    /*Desenha nuvem de memorias*/
                    if (desenhaNuvem) {
                        for (i = 0; i < markersFake.length; i += 1) {
                            var limite;

                            if (zoom >= 12) {
                                limite = 5;
                            } else if (zoom > 8) {
                                limite = 2;
                            } else {
                                limite = 0;
                            }
                            for (x = rFake[i], transp = 1, j = 0; j < limite; x -= 8, j++, transp += 0.75) {
                                processing.noStroke();
                                processing.fill(redFake[i], greenFake[i], blueFake[i], transp);
                                if (zoom >= 12) {
                                    processing.ellipse(poxFake[i], poyFake[i], x, x);
                                } else if (zoom > 8) {
                                    processing.ellipse(poxFake[i], poyFake[i], x / 2, x / 2);
                                }
                            }
                            poxFake[i] = poxFake[i] + vxFake[i];
                            if (poxFake[i] > (posxFake[i] + 4)) {
                                poxFake[i] = posxFake[i] + 4;
                                vxFake[i] = -vxFake[i];
                            } else if (poxFake[i] < (posxFake[i] - 4)) {
                                poxFake[i] = posxFake[i] - 4;
                                vxFake[i] = -vxFake[i];
                            }
                            if (Math.floor((Math.random() * 500) + 1) == 100) {
                                vxFake[i] = Math.random() / 40;
                            }
                            poyFake[i] = poyFake[i] + vyFake[i];
                            if (poyFake[i] > (posyFake[i] + 4)) {
                                poyFake[i] = posyFake[i] + 4;
                                vyFake[i] = -vyFake[i];
                            } else if (poyFake[i] < (posyFake[i] - 4)) {
                                poyFake[i] = posyFake[i] - 4;
                                vyFake[i] = -vyFake[i];
                            }
                            if (Math.floor((Math.random() * 100) + 1) == 100) {
                                vyFake[i] = Math.random() / 40;
                            }
                            if (redFake[i] > 255) {
                                redFake[i] = 255;
                                incrementoRedFake[i] = -incrementoRedFake[i];
                            } else if (redFake[i] < 64) {
                                redFake[i] = 64;
                                incrementoRedFake[i] = -incrementoRedFake[i];
                            }
                            redFake[i] += incrementoRedFake[i];
                            /*vaira cor das memorias*/
                            if (greenFake[i] > 255) {
                                greenFake[i] = 255;
                                incrementoGreenFake[i] = -incrementoGreenFake[i];
                            } else if (greenFake[i] < 116) {
                                greenFake[i] = 116;
                                incrementoGreenFake[i] = -incrementoGreenFake[i];
                            }
                            greenFake[i] += incrementoGreenFake[i];
                            if (blueFake[i] > 255) {
                                blueFake[i] = 255;
                                incrementoBlueFake[i] = -incrementoBlueFake[i];
                            } else if (blueFake[i] < 151) {
                                blueFake[i] = 151;
                                incrementoBlueFake[i] = -incrementoBlueFake[i];
                            }
                            blueFake[i] += incrementoBlueFake[i];
                            rFake[i] = rFake[i] + vrFake[i];
                            if (rFake[i] >= 50 || rFake[i] <= 40) {
                                vrFake[i] = -vrFake[i];
                            }
                        }
                        var quant = 0;
                        for (i = 0; i < markers.length; i++) {
                            var limite;

                            if (zoom >= 12) {
                                limite = 10;
                            } else if (zoom > 8) {
                                limite = 7;
                            } else {
                                limite = 3;
                            }
                            /*varia transparencia das memorias*/
                            for (x = r[i], transp = 1, j = 0; j < limite; x -= 5, j++, transp += 2) {
                                processing.noStroke();
                                processing.fill(red[i], green[i], blue[i], transp);
                                if (zoom >= 12) {
                                    processing.ellipse(pox[i], poy[i], x, x);
                                } else if (zoom > 8) {
                                    processing.ellipse(pox[i], poy[i], x / 2, x / 2);
                                } else {
                                    processing.ellipse(pox[i], poy[i], x / 3, x / 3);
                                }
                            }
                            processing.fill(255, 255, 255);
                            processing.ellipse(posx[i], posy[i], 2, 2);
                            processing.noStroke();
                            pox[i] = pox[i] + vx[i];
                            if (pox[i] > (posx[i] + 4)) {
                                pox[i] = posx[i] + 4;
                                vx[i] = -vx[i];
                            } else if (pox[i] < (posx[i] - 4)) {
                                pox[i] = posx[i] - 4;
                                vx[i] = -vx[i];
                            }
                            if (Math.floor((Math.random() * 500) + 1) == 100) {
                                vx[i] = Math.random() / 40;
                            }
                            poy[i] = poy[i] + vy[i];
                            if (poy[i] > (posy[i] + 4)) {
                                poy[i] = posy[i] + 4;
                                vy[i] = -vy[i];
                            } else if (poy[i] < (posy[i] - 4)) {
                                poy[i] = posy[i] - 4;
                                vy[i] = -vy[i];
                            }
                            if (Math.floor((Math.random() * 100) + 1) == 100) {
                                vy[i] = Math.random() / 40;
                            }
                            if (red[i] > 255) {
                                red[i] = 255;
                                incrementoRed[i] = -incrementoRed[i];
                            } else if (red[i] < 64) {
                                red[i] = 64;
                                incrementoRed[i] = -incrementoRed[i];
                            }
                            red[i] += incrementoRed[i];
                            /*vaira cor das memorias*/
                            if (green[i] > 255) {
                                green[i] = 255;
                                incrementoGreen[i] = -incrementoGreen[i];
                            } else if (green[i] < 116) {
                                green[i] = 116;
                                incrementoGreen[i] = -incrementoGreen[i];
                            }
                            green[i] += incrementoGreen[i];
                            if (blue[i] > 255) {
                                blue[i] = 255;
                                incrementoBlue[i] = -incrementoBlue[i];
                            } else if (blue[i] < 151) {
                                blue[i] = 151;
                                incrementoBlue[i] = -incrementoBlue[i];
                            }
                            blue[i] += incrementoBlue[i];
                            r[i] = r[i] + vr[i];
                            if (r[i] >= 50 || r[i] <= 40) {
                                vr[i] = -vr[i];
                            }
                            if (processing.mouseX > posx[i] - 10 && processing.mouseX < posx[i] + 10 &&
                                processing.mouseY > posy[i] - 10 && processing.mouseY < posy[i] + 10 && permiteVisualizacao) {
                                quant += 1;
                            }
                        }
                        if (quant > 0) {
                            overMemoria = true;
                            //                            alert('1');
                            //                            processing.cursor(HAND);
                        } else {
                            overMemoria = false;
                            //                            alert('2');
                            //                            processing.cursor(CROSS);
                        }
                    }

                    /*desenha marcador de posicionamento da memoria*/
                    if (drawMarcador) {
                        /*identifica se mouse está sobre marcador*/
                        if (processing.mouseX > bx - 10 && processing.mouseX < bx + 10 &&
                            processing.mouseY > by - 10 && processing.mouseY < by + 10) {
                            overMarcador = true;
                        } else {
                            overMarcador = false;
                        }
                        processing.noStroke();
                        if (marcadorValido) {
                            processing.fill(255, 255, 255);
                        } else {
                            processing.fill(127, 127, 127);
                        }
                        processing.ellipse(bx, by + 40, 0.4, 0.4);
                        processing.ellipse(bx, by + 36, 0.8, 0.8);
                        processing.ellipse(bx, by + 32, 1.2, 1.2);
                        processing.ellipse(bx, by + 28.5, 1.6, 1.6);
                        processing.ellipse(bx, by + 24, 2, 2);
                        processing.ellipse(bx, by + 19, 2.4, 2.4);
                        processing.ellipse(bx, by + 14, 2.8, 2.8);
                        if (marcadorValido) {
                            processing.stroke(255, 255, 255);
                        } else {
                            processing.stroke(127, 127, 127);
                        }
                        processing.strokeWeight(2);
                        processing.noFill();
                        processing.ellipse(bx, by, 20, 20);
                        //processing.image(imgMarcador, bx - 9.5, by - 60, 28, 60);
                        /*desenha marcador*/
                        //                        for (x = 60, transp = 1, j = 0; j < 25; x -= 2, transp += 1, j++) {
                        //                            processing.noStroke();
                        //                            processing.fill(200, 200, 200, transp);
                        //                            processing.ellipse(bx, by, x, x);
                        //                        }
                        /*atualiza marcador do google maps*/
                        point.x = bx;
                        point.y = by + 40;

                        var alterou, m;
                        for (alterou = false, m = 0; m < markers.length; m++) {
                            if (point.x < posx[m] + 7.5 && point.x > posx[m] - 7.5 &&
                                point.y < posy[m] + 7.5 && point.y > posy[m] - 7.5) {
                                marcadorValido = false;
                                alterou = true;
                            } else if (m == markers.length - 1 && !alterou) {
                                marcadorValido = true;
                            }
                        }

                        position = overlay.getProjection().fromContainerPixelToLatLng(point);
                        markerMem.setPosition(position);
                        mudaLatLng(markerMem);
                    }
                    if (drawPonto) {
                        for (x = 45, transp = 1, j = 0; j < 10; x -= 5, j++, transp += 2) {
                            processing.noStroke();
                            processing.fill(255, 255, 255, transp);
                            processing.ellipse(bx, by + 40, x, x);
                        }
                        processing.fill(255, 255, 255);
                        processing.ellipse(bx, by + 40, 2, 2);
                    }
                };

                /*Funcao de clique do mouse*/
                processing.mousePressed = function () {
                    /*Armazena posicao do mouse*/
                    var i;
                    px = processing.mouseX;
                    py = processing.mouseY;
                    marcadorxOffset = processing.mouseX - bx;
                    marcadoryOffset = processing.mouseY - by;
                    mousePressed = true;
                    /*clique no marcador*/
                    if (overMarcador) {
                        lockedMarcador = true;
                    } else {
                        lockedMarcador = false;
                    }
                    var quantidade = 0,
                        ultima;
                    for (i = 0; i < markers.length; i++) {
                        if (processing.mouseX > posx[i] - 10 && processing.mouseX < posx[i] + 10 &&
                            processing.mouseY > posy[i] - 10 && processing.mouseY < posy[i] + 10 && permiteVisualizacao) {
                            if (memAberta == i) {
                                memAberta = 0;
                                fechaMemoria();
                            } else {
                                quantidade += 1;
                                ultima = i;
                            }
                        }
                    }
                    if (quantidade > 1) {
                        zoom += 2;
                        if (zoom > 18) {
                            zoom = 18;
                        }
                        map.setZoom(zoom);
                        map.setCenter(markers[ultima].getPosition());
                    } else if (quantidade == 1) {
                        memAberta = ultima;
                        abreMemoria(ultima);
                    }
                };

                /*Funcao de arraste do mouse*/
                processing.mouseDragged = function () {
                    /*Move o mapa*/
                    if (lockedMarcador) {
                        bx = processing.mouseX - marcadorxOffset;
                        by = processing.mouseY - marcadoryOffset;
                    } else if (permiteMov && !ajustando) {
                        xOffset = -(processing.mouseX - processing.pmouseX);
                        yOffset = -(processing.mouseY - processing.pmouseY);
                        map.panBy(xOffset, yOffset);
                    }

                    if (conteudoAberto) {
                        fechaMemoria();
                    }

                    /*move o marcador*/

                };

                /*Funcao de liberacao do mouse*/
                processing.mouseReleased = function () {
                    /*libera marcador*/
                    lockedMarcador = false;
                    mousePressed = false;
                };
            }
            /*Seleciona canvas do processing e cria visualizacao*/
            var canvas = document.getElementById("processCanvas");
            var p = new Processing(canvas, sketchProc);
        </script>
    </body>

</html>
