/*jslint browser: true*/
/*global jQuery, $, animaTipo, recursoSelecionado, arquivoEnviado, estadomem, drawMarcador */

var imgUp = false,
    vidUp = false,
    audUp = false,
    txtUp = false;

$(document).ready(function () {
    "use strict";

    var barImg = $('#imgCamSmallLoad'),
        barVideo = $('#imgVideoSmallLoad'),
        barAudio = $('#imgAudioSmallLoad'),
        barTexto = $('#imgTextoSmallLoad');

    function mudaImg() {
        var tempQueue = jQuery({});

        tempQueue.queue(function (next) {
            document.getElementById('mensagemEnvia').innerHTML = "carregue outro recurso ou<br>siga para a próxima etapa!";
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
            $('#antmem').animate({
                left: '115px'
            }, 300);
            $('#imgVideo').fadeOut(250);
            $('#imgAudio').fadeOut(250);
            $('#imgTexto').fadeOut(250);
            $('#formVideo').fadeOut(200);
            $('#formAudio').fadeOut(200);
            $('#concluir').fadeIn(200);
            $('#texto').fadeOut(200);
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

    function mudaVid() {
        var tempQueue = jQuery({});

        tempQueue.queue(function (next) {
            document.getElementById('mensagemEnvia').innerHTML = "carregue outro recurso ou<br>siga para a próxima etapa!";
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
            $('#antmem').animate({
                left: '115px'
            }, 300);
            $('#imgCam').fadeOut(250);
            $('#formImagem').fadeOut(250);
            $('#formAudio').fadeOut(250);
            $('#imgAudio').fadeOut(250);
            $('#imgTexto').fadeOut(250);
            $('#concluir').fadeIn(200);
            $('#texto').fadeOut(200);
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

    function mudaAud() {
        var tempQueue = jQuery({});

        tempQueue.queue(function (next) {
            document.getElementById('mensagemEnvia').innerHTML = "carregue outro recurso ou<br>siga para a próxima etapa!";
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
            $('#antmem').animate({
                left: '115px'
            }, 300);
            $('#imgCam').fadeOut(250);
            $('#formImagem').fadeOut(250);
            $('#formVideo').fadeOut(250);
            $('#imgVideo').fadeOut(250);
            $('#imgTexto').fadeOut(250);
            $('#concluir').fadeIn(200);
            $('#texto').fadeOut(200);
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

    function mudaTxt() {
        var tempQueue = jQuery({});

        tempQueue.queue(function (next) {
            document.getElementById('mensagemEnvia').innerHTML = "carregue outro recurso ou<br>siga para a próxima etapa!";
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
            $('#antmem').animate({
                left: '115px'
            }, 300);
            $('#imgCam').fadeOut(250);
            $('#formImagem').fadeOut(250);
            $('#formVideo').fadeOut(250);
            $('#formAudio').fadeOut(250);
            $('#imgAudio').fadeOut(250);
            $('#imgVideo').fadeOut(250);
            $('#concluir').fadeIn(200);
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

    function mudaPos() {
        var tempQueue = jQuery({});
        tempQueue.queue(function (next) {
            estadomem = 2;
            $('#mensagemEnvia').fadeOut('fast');
            $('#concluir').fadeOut('fast');
            $('#antmem').fadeOut('fast');
            $('#formImagem').fadeOut('fast');
            $('#formVideo').fadeOut('fast');
            $('#formAudio').fadeOut('fast');
            $('#texto').fadeOut('fast');
            $('#okTexto').fadeOut('fast');
            $('#imgCam').fadeOut('fast');
            $('#imgVideo').fadeOut('fast');
            $('#imgAudio').fadeOut('fast');
            $('#imgTexto').fadeOut('fast');
            $('#menuTipo').fadeOut('fast');
            $('#pontoBranco').fadeOut('fast');
            next();
        });
        tempQueue.delay(300);
        tempQueue.queue(function (next) {
            drawMarcador = true;
            document.getElementById('mensagemEnvia').innerHTML = "estamos quase la!<br>você pode <spam>ajustar</spam> seu ponto de memória<br>movimentando o cursor no mapa ou<br><spam>confirmar</spam> o envio dos recursos";
            $('#mensagemEnvia').css({
                top: '75px'
            });
            $('#mensagemEnvia').fadeIn('fast');
            $('#antmem').css({
                left: '170px'
            });
            $('#antmem').fadeIn('fast');
            $('#enviaMem').fadeIn('fast');
            $('#ajustaMem').fadeIn('fast');
            $('#concluir').hide();
            next();
        });
    }

    $("#btnFileImage").click(function () {
        $("#fileInput01").trigger("click");
    });

    $('#formImagem').ajaxForm({
        beforeSend: function () {
            var percentVal = '0%';
            barImg.height(percentVal);
        },
        uploadProgress: function (event, position, total, percentComplete) {
            var percent = percentComplete,
                percentVal;

            if (percent > 90) {
                percent = 90;
            }

            percentVal = percent + "%";
            barImg.height(percentVal);
        },
        complete: function (xhr) {
            arquivoEnviado = true;
            imgUp = true;
            barImg.height('100%');
            if (!vidUp) {
                mudaVid();
            } else if (!audUp) {
                mudaAud();
            } else if (!txtUp) {
                mudaTxt();
            } else {
                mudaPos();
            }
            $('#submitImagem').fadeOut('200');
        }
    });

    $('#fileInput01').change(function () {
        var text = this.value,
            tempQueue = jQuery({}),
            el = this;

        if (el.files[0].size <= 1000000) {
            tempQueue.queue(function (next) {
                alert(el.files[0].size);
                $('#mensagemEnvia').fadeOut(100);
                $('#imagemName').text(text.slice(12));
                next();
            });
            tempQueue.delay(200);
            tempQueue.queue(function (next) {
                //            $('#submitImagem').fadeIn(100);
                var filename = $('#fileInput01').val(),
                    file_ext = filename.split('.').pop().toLowerCase(),
                    d = new Date(),
                    newname = d.getTime(),
                    rand = Math.floor(Math.random() * 1000),
                    name,
                    oldName = $('#newNameImg').val();

                if (oldName !== "") {
                    var oReq = new XMLHttpRequest(); // objeto para acesso ao webservice
                    oReq.open("get", "php/delete.php?nome=../uploads/imagens/" + oldName, true);
                    oReq.send(); // envia dados ao webservice
                }

                if (rand < 10) {
                    rand *= 100;
                }
                if (rand < 100) {
                    rand *= 10;
                }
                name = newname + rand + "." + file_ext;
                $('#newNameImg').val(name);

                $('#formImagem').submit();
                next();
            });
        } else {
            alert("Imagem não deve exceder 1MB");
        }
    });

    $("#btnFileVideo").click(function () {
        $("#fileInput02").trigger("click");
    });

    $('#formVideo').ajaxForm({
        beforeSend: function () {
            var percentVal = '0%';
            barVideo.height(percentVal);
        },
        uploadProgress: function (event, position, total, percentComplete) {
            var percent = percentComplete,
                percentVal;

            if (percent > 90) {
                percent = 90;
            }

            percentVal = percent + "%";
            barVideo.height(percentVal);
        },
        complete: function (xhr) {
            arquivoEnviado = true;
            vidUp = true;
            barVideo.height('100%');
            if (!audUp) {
                mudaAud();
            } else if (!txtUp) {
                mudaTxt();
            } else if (!imgUp) {
                mudaImg();
            } else {
                mudaPos();
            }
            $('#submitVideo').fadeOut('200');
        }
    });

    $('#fileInput02').change(function () {
        var text = this.value,
            tempQueue = jQuery({}),
            el = this;

        if (el.files[0].size <= 4000000) {
            tempQueue.queue(function (next) {
                $('#mensagemEnvia').fadeOut(100);
                $('#videoName').text(text.slice(12));
                next();
            });
            tempQueue.delay(200);
            tempQueue.queue(function (next) {
                //            $('#submitVideo').fadeIn(100);
                var filename = $('#fileInput02').val(),
                    file_ext = filename.split('.').pop().toLowerCase(),
                    d = new Date(),
                    newname = d.getTime(),
                    rand = Math.floor(Math.random() * 1000),
                    name,
                    oldName = $('#newNameVid').val();

                if (oldName !== "") {
                    var oReq = new XMLHttpRequest(); // objeto para acesso ao webservice
                    oReq.open("get", "php/delete.php?nome=../uploads/video/" + oldName, true);
                    oReq.send(); // envia dados ao webservice
                }

                if (rand < 10) {
                    rand *= 100;
                }
                if (rand < 100) {
                    rand *= 10;
                }
                name = newname + rand + "." + file_ext;
                $('#newNameVid').val(name);

                $('#formVideo').submit();
                next();
            });
        } else {
            alert("Vídeo não deve exceder 4MB");
        }
    });

    $("#btnFileAudio").click(function () {
        $("#fileInput03").trigger("click");
    });

    $('#formAudio').ajaxForm({
        beforeSend: function () {
            var percentVal = '0%';
            barAudio.height(percentVal);
        },
        uploadProgress: function (event, position, total, percentComplete) {
            var percent = percentComplete,
                percentVal;

            if (percent > 90) {
                percent = 90;
            }

            percentVal = percent + "%";
            barAudio.height(percentVal);
        },
        complete: function (xhr) {
            arquivoEnviado = true;
            audUp = true;
            barAudio.height('100%');
            if (!txtUp) {
                mudaTxt();
            } else if (!imgUp) {
                mudaImg();
            } else if (!vidUp) {
                mudaVid();
            } else {
                mudaPos();
            }
            $('#submitAudio').fadeOut('200');
        }
    });

    $('#fileInput03').change(function () {
        var text = this.value,
            tempQueue = jQuery({}),
            el = this;

        if (el.files[0].size <= 4000000) {
            tempQueue.queue(function (next) {
                $('#mensagemEnvia').fadeOut(100);
                $('#audioName').text(text.slice(12));
                next();
            });
            tempQueue.delay(200);
            tempQueue.queue(function (next) {
                //            $('#submitAudio').fadeIn(100);
                var filename = $('#fileInput03').val(),
                    file_ext = filename.split('.').pop().toLowerCase(),
                    d = new Date(),
                    newname = d.getTime(),
                    rand = Math.floor(Math.random() * 1000),
                    name,
                    oldName = $('#newNameAud').val();

                if (oldName !== "") {
                    var oReq = new XMLHttpRequest(); // objeto para acesso ao webservice
                    oReq.open("get", "php/delete.php?nome=../uploads/audio/" + oldName, true);
                    oReq.send(); // envia dados ao webservice
                }


                if (rand < 10) {
                    rand *= 100;
                }
                if (rand < 100) {
                    rand *= 10;
                }
                name = newname + rand + "." + file_ext;
                $('#newNameAud').val(name);

                $('#formAudio').submit();
                next();
            });
        } else {
            alert("Áudio não deve exceder 4MB");
        }
    });

    $('#okTexto').click(function () {
        var i = 1,
            timer = setInterval(function () {
                load();
            }, 5);

        function stop() {
            clearInterval(timer);
        }

        function load() {
            if (i <= 100) {
                var percentVal = i + "%";
                barTexto.height(percentVal);
                i += 1;
            } else {
                stop();
                if (!imgUp) {
                    mudaImg();
                } else if (!vidUp) {
                    mudaVid();
                } else if (!audUp) {
                    mudaAud();
                } else {
                    mudaPos();
                }
                txtUp = true;
                arquivoEnviado = true;
            }
        }
    });
});
