/*jslint browser: true*/
/*global google, alert, jQuery, $, header, permiteMov, buscaAberto, signInAberto, username, menuUserAberto, abreMemoria, deletaMemoria*/

/*-------------------------------------------------------------------------------------------------------------------------------------
 * Declaração das variáveis globais
 */
var map, // objeto do mapa
    geocoder, // objeto de localização global
    autocomplete, // objeto de autocomplete do formulario de memoria
    autocompleteSearch, // objeto de autocomplete da barra de busca
    zoom = 12, // zoom atual do mapa
    markerMem, // marcador de posicionamento
    latLng, // variavel de coordenada do marcador
    memLat, // variavel de latitude do marcador
    memLng, // variavel de longitude do marcador
    drawMarcador = false, // permite renderizacao do marcador de posicionamento
    markers = [], // Array de marcadores de memoria
    markersFake = [], // Array de marcadores de memoria
    posx = [], // posicao x dos marcadoes
    pox = [],
    posxFake = [], // posicao x dos marcadoes
    poxFake = [],
    vx = [],
    vxFake = [],
    posy = [], // posicao y dos marcadoes
    poy = [],
    posyFake = [], // posicao y dos marcadoes
    poyFake = [],
    vy = [],
    vyFake = [],
    r = [], // raio dos marcadores de memoria
    rFake = [], // raio dos marcadores de memoria
    vr = [],
    vrFake = [],
    conteudoId = [],
    zoomPos = [],
    we,
    he,
    memAberta = 0,
    delAberto = false,
    tamMemorias = 0,
    desenhaNuvem = true,
    red = [], // transparencia dos marcadores de memoria
    redFake = [], // transparencia dos marcadores de memoria
    green = [], // cor dos marcadores de memoria
    greenFake = [], // cor dos marcadores de memoria
    blue = [],
    blueFake = [],
    incrementoRed = [], // nivel de incremento da transparencia dos marcadore
    incrementoGreen = [], // nivel de incremento da cor dos marcadores
    incrementoBlue = [],
    incrementoRedFake = [], // nivel de incremento da transparencia dos marcadore
    incrementoGreenFake = [], // nivel de incremento da cor dos marcadores
    incrementoBlueFake = [],
    overlay, // overlay do mapa
    componentForm = {
        route: 'long_name',
        neighborhood: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name'
    }, // componentes do formulário de endereco
    styleArray = [
        {
            stylers: [{
                visibility: "off"
            }]
        },
        {
            featureType: "landscape.natural",
            elementType: "geometry",
            stylers: [{
                visibility: "on"
            }, {
                color: "#2C3139"
            }]
        },
        {
            featureType: "water",
            elementType: "geometry.fill",
            stylers: [{
                visibility: "on"
            }, {
                color: "#2C3139"
            }, {
                gamma: 1.33
            }]
        },
        {
            featureType: "road",
            elementType: "geometry.fill",
            stylers: [{
                visibility: "on"
            }, {
                color: "#2C3139"
            }, {
                saturation: -8
            }, {
                gamma: 1.13
            }]
        },
        {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{
                visibility: "on"
            }, {
                color: "#2C3139"
            }, {
                lightness: 20
            }]
        }],
    mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"; // recebe evento da barra de rolagem do mouse

/*-------------------------------------------------------------------------------------------------------------------------------------
 * Funções para funcionamento geral do mapa
 *
 *Preenchimento automatico do formulário de endereco*/
function fillInAddress() {
    "use strict";
    var place = autocomplete.getPlace(), // recebe informações de endereco do lugar selecionado (recebido pela api do google)
        i, // contador do loop
        addressType, // parametro de endereco
        val; // valor do parametro de endereco
    /*recebe as informações de endereco do lugar e preenche os formulários correspondentes*/
    for (i = 0; i < place.address_components.length; i += 1) {
        addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
            val = place.address_components[i][componentForm[addressType]];
            document.getElementById(addressType).value = val;
        }
    }
}

/*Da preferenci a lugares proximos ao usuário para busca de endereco*/
function geolocate() {
    "use strict";
    /*recebe a geolocalização do usuário*/
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var geolocation = new google.maps.LatLng(
                    position.coords.latitude,
                    position.coords.longitude
                ),
                circle = new google.maps.Circle({ // raio de precisão
                    center: geolocation,
                    radius: position.coords.accuracy
                });
            autocomplete.setBounds(circle.getBounds());
            autocompleteSearch.setBounds(circle.getBounds());
        });
    }
}

/*Barra de busca de enderecos*/
function searchAddress() {
    "use strict";
    /*recebe o endereco digitado pelo usuário*/
    var address = document.getElementById("buscaEndereco").value;
    /*Centraliza o mapa no endereco*/
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            latLng = results[0].geometry.location; // recebe as coordenadas da localização
            map.panTo(latLng); // move o mapa para a coordenada recebida
            map.setZoom(16); // define o nivel de zoom
            zoom = 16;
        } else {
            /*mensagem de erro caso endereco não seja encontrado*/
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

/*-------------------------------------------------------------------------------------------------------------------------------------
 * Funcoes da barra de rolagem do mouse
 *
 *Altera zoom do mapa quando*/
function scrollwheel(e) {
    "use strict";
    if (permiteZoom && permiteMov) {
        var evt = window.event || e,
            delta = evt.detail ? evt.detail * (-120) : evt.wheelDelta,
            point,
            position = new google.maps.LatLng("", ""),
            tempQueue = jQuery({}),
            i,
            dist = [];
        if (delta <= -120) {
            zoom -= 1;
            if (zoom < 4) {
                zoom = 4;
            }
        } else {
            zoom += 1;
            if (zoom > 18) {
                zoom = 18;
            }
        }
        map.setZoom(zoom);
    }
}

/*identifica evento da barra de rolagem*/
if (document.attachEvent) {
    document.attachEvent("on" + mousewheelevt, scrollwheel);
} else if (document.addEventListener) {
    document.addEventListener(mousewheelevt, scrollwheel, false);
}

/*-------------------------------------------------------------------------------------------------------------------------------------
 * Funções do marcador de posicinameno de memoria
 *
 *altera os campos de lat e lng no formulário quando o marcador é arrastado*/
function mudaLatLng(marker) {
    "use strict";
    memLat = marker.getPosition().lat();
    memLng = marker.getPosition().lng();
    document.getElementById('inputLatitude').value = memLat;
    document.getElementById('inputLongitude').value = memLng;
}

/*centraliza o mapa no endereco pesquisado e adiciona um marcador no local*/
function codeAddress() {
    "use strict";
    /*recebe o endereco + numero digitado pelo usuário*/
    var address = document.getElementById("inputEndereco").value,
        clearButton = document.querySelector('#adicionarRemov'),
        clearButton02 = document.querySelector('#antmem'),
        fixButton = document.querySelector('#enviaMem'),
        image = {
            url: "images/pontoMemoria.png",
            anchor: new google.maps.Point(7.5, 7.5)
        };
    /*geolocaliza o mapa no endereco*/
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            latLng = results[0].geometry.location; // recebe as coordenadas da localização
            map.panTo(latLng); // move o mapa para a coordenada recebida
            map.setZoom(16); // define o nivel de zoom
            zoom = 16;
            /*cria marcador na coordenada recebida*/
            markerMem = new google.maps.Marker({
                map: map,
                draggable: true,
                animation: google.maps.Animation.DROP,
                position: latLng,
                title: "Marcador",
                icon: image
            });
            /*muda lat e lng do formulario quando marcador é movido*/
            mudaLatLng(markerMem);
            google.maps.event.addListener(markerMem, 'dragend', function () {
                mudaLatLng(markerMem);
            });
            clearButton.addEventListener("click", function () {
                markerMem.setMap(null);
                drawMarcador = false;
            });
            clearButton02.addEventListener("click", function () {
                markerMem.setMap(null);
                drawMarcador = false;
            });
            fixButton.addEventListener("click", function () {
                markerMem.setDraggable(false);
            });
        } else {
            /*mensagem de erro caso endereco não seja encontrado*/
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

/*-------------------------------------------------------------------------------------------------------------------------------------
 * Funções da visualização da nuvem
 *
 *Atualiza posicao da nuvem ao movimentar o mapa*/
function moveMemoria() {
    "use strict";
    var scale = Math.pow(2, zoom),
        nw = new google.maps.LatLng(
            map.getBounds().getNorthEast().lat(),
            map.getBounds().getSouthWest().lng()
        ),
        worldCoordinateNW = map.getProjection().fromLatLngToPoint(nw),
        worldCoordinate = [],
        i, j;
    for (i = 0; markers[i] !== undefined; i += 1) {
        worldCoordinate.push(map.getProjection().fromLatLngToPoint(markers[i].getPosition()));
        posx[i] = (Math.floor((worldCoordinate[i].x - worldCoordinateNW.x) * scale));
        vx[i] = Math.random() / 40;
        pox[i] = posx[i];
        posy[i] = (Math.floor((worldCoordinate[i].y - worldCoordinateNW.y) * scale));
        poy[i] = posy[i];
        vy[i] = Math.random() / 40;
    }
    for (j = 0; markersFake[j] !== undefined; j += 1) {
        worldCoordinate.push(map.getProjection().fromLatLngToPoint(markersFake[j].getPosition()));
        posxFake[j] = (Math.floor((worldCoordinate[i].x - worldCoordinateNW.x) * scale));
        vxFake[j] = Math.random() / 40;
        poxFake[j] = posxFake[j];
        posyFake[j] = (Math.floor((worldCoordinate[i].y - worldCoordinateNW.y) * scale));
        poyFake[j] = posyFake[j];
        vyFake[j] = Math.random() / 40;
        i += 1;
    }
}

/*Busca memorias no banco de dados e cria pontos da nuvem*/
function buscaMemoria() {
    "use strict";
    var oReq = new XMLHttpRequest(); // objeto para acesso ao webservice
    //      oReq02 = new XMLHttpRequest();
    oReq.onload = function () {
        var json = oReq.responseText, // recebe resposta do webservice
            obj = JSON.parse(json), // transforma json em objeto de JavaScript
            i = 0,
            j = 0,
            latlng,
            marker,
            image = {
                url: "images/pontoMemoria.png",
                anchor: new google.maps.Point(7.5, 7.5)
            };
        for (i = 0; i < obj.length; i += 1) {
            if (obj[i][3] === username || obj[i][6] === 'S') {
                latlng = new google.maps.LatLng(obj[i][1], obj[i][2]);
                marker = new google.maps.Marker({
                    map: map,
                    position: latlng,
                    icon: image,
                    title: obj[i][0]
                });
                markers.push(marker);
                conteudoId.push(obj[i][0]);
                r.push((Math.random() * 10) + 40);
                vr.push((Math.random() / 15) + 0.1);
                red.push((Math.random() * 191) + 64);
                green.push(((139 / 191) * (red[j] - 64)) + 116);
                blue.push(((104 / 191) * (red[j] - 64)) + 151);
                incrementoRed.push(1);
                incrementoGreen.push(139 / 191);
                incrementoBlue.push(104 / 191);

                if (obj[i][3] === username) {
                    tamMemorias += 1;
                    $('#memoriasDiv').append("<div id='mem" + tamMemorias + "' class='memoriaUserDiv'></div");
                    $('#mem' + tamMemorias).append("<img class='excluir' src='images/lixo.png' alt='ativo'>");
                    if (obj[i][6] === 'S') {
                        $('#mem' + tamMemorias).append("<img id='" + j + "' class='estadoMem' src='images/view.png' alt='ativo'>");
                    } else {
                        $('#mem' + tamMemorias).append("<img id='" + j + "' class='estadoMem' src='images/view.png' alt='ativo' style='opacity:0.5'>");
                    }
                    $('#mem' + tamMemorias).append("<p class='memoriaUserAno'> - " + obj[i][5] + "</p><p class='memoriaUser'>" + obj[i][4] + "</p>");
                    $('#mem' + tamMemorias).append("<div class='DelMemDiv'><p class='DelMemMsg'>tem certeza que deseja apagar essa memória?<br>ela não poderá ser recuperada</p><button class='delNao'>NÃO</button><button class='delSim'>SIM</button></div>");
                }
                j += 1;
            }
        }
        if (markers.length < 100) {
            var tam = 100 - markers.length,
                tamFake = 0;
            for (i = 0; i < markers.length; i += 1) {
                var lat = markers[i].getPosition().lat(),
                    lng = markers[i].getPosition().lng(),
                    times = Math.ceil(Math.random() * 20);
                for (j = 0; j < times; j += 1) {
                    var varLat = (Math.random() / 50) - 0.0075,
                        varLng = (Math.random() / 50) - 0.0075;
                    latlng = new google.maps.LatLng(lat + varLat, lng + varLng);
                    marker = new google.maps.Marker({
                        map: map,
                        position: latlng,
                        icon: image
                    });
                    markersFake.push(marker);
                    rFake.push((Math.random() * 10) + 40);
                    vrFake.push((Math.random() / 15) + 0.1);
                    redFake.push((Math.random() * 191) + 64);
                    greenFake.push(((139 / 191) * (redFake[tamFake] - 64)) + 116);
                    blueFake.push(((104 / 191) * (redFake[tamFake] - 64)) + 151);
                    incrementoRedFake.push(1);
                    incrementoGreenFake.push(139 / 191);
                    incrementoBlueFake.push(104 / 191);
                    tamFake += 1;
                }
            }
        }
        if (tamMemorias > 15) {
            tamMemorias = 15;
        } else if (tamMemorias === 0) {
            tamMemorias = 1;
            $('#memoriasDiv').append("<div class='memvazio'><p class='memoriaUserVaz'>você ainda não compartilhou<br>nenhuma memória!</p></div>");
        }
        $('.excluir').click(function () {
            var tempQueue = jQuery({}),
                el = $(this),
                height = $('#memorias').height();

            if (!delAberto) {
                tempQueue.queue(function (next) {
                    delAberto = true;
                    $('.excluir').css('cursor', 'auto');
                    $('.estadoMem').css('cursor', 'auto');
                    $('.memoriaUser').css('cursor', 'auto');
                    $('.memoriaUserAno').css('cursor', 'auto');
                    $('#memorias').animate({
                        height: height + 104
                    }, 300);
                    el.parent().children('.DelMemDiv').animate({
                        height: '85px'
                    }, 300);
                    next();
                });
                tempQueue.delay(300);
                tempQueue.queue(function (next) {
                    el.parent().children('.DelMemDiv').children('.DelMemMsg').fadeIn(300);
                    el.parent().children('.DelMemDiv').children('.delSim').fadeIn(300);
                    el.parent().children('.DelMemDiv').children('.delNao').fadeIn(300);
                    next();
                });
            }
        });
        $('.delNao').click(function () {
            var tempQueue = jQuery({}),
                el = $(this),
                height = $('#memorias').height();

            tempQueue.queue(function (next) {
                delAberto = false;
                el.parent().children('.DelMemMsg').fadeOut(300);
                el.parent().children('.delSim').fadeOut(300);
                el.parent().children('.delNao').fadeOut(300);
                $('.excluir').fadeTo(100, 0.3);
                next();
            });
            tempQueue.delay(300);
            tempQueue.queue(function (next) {
                $('.excluir').css('cursor', 'pointer');
                $('.estadoMem').css('cursor', 'pointer');
                $('.memoriaUser').css('cursor', 'pointer');
                $('.memoriaUserAno').css('cursor', 'pointer');
                $('#memorias').animate({
                    height: height - 64
                }, 300);
                el.parent().animate({
                    height: '0px'
                }, 300);
                next();
            });
        });
        $('.delSim').click(function () {
            var id = $(this).parent().parent().children('.estadoMem').attr('id'),
                tempQueue = jQuery({}),
                el = $(this),
                height = $('#memorias').height();

            tempQueue.queue(function (next) {
                tamMemorias -= 1;
                delAberto = false;
                el.parent().parent().children('.memoriaUser').fadeOut(300);
                el.parent().parent().children('.memoriaUserAno').fadeOut(300);
                el.parent().parent().children('.estadoMem').fadeOut(300);
                el.parent().parent().children('.excluir').fadeOut(300);
                el.parent().children('.DelMemMsg').fadeOut(300);
                el.parent().children('.delSim').fadeOut(300);
                el.parent().children('.delNao').fadeOut(300);
                next();
            });
            tempQueue.delay(300);
            tempQueue.queue(function (next) {
                $('.excluir').css('cursor', 'pointer');
                $('.estadoMem').css('cursor', 'pointer');
                $('.memoriaUser').css('cursor', 'pointer');
                $('.memoriaUserAno').css('cursor', 'pointer');
                if (tamMemorias === 0) {
                    $('#memorias').animate({
                        height: height - 51
                    }, 300);
                } else {
                    $('#memorias').animate({
                        height: height - 81
                    }, 300);
                }
                el.parent().animate({
                    height: '0px'
                }, 300);
                el.parent().parent().slideUp(300).removeClass('memoriaUserDiv');
                deletaMemoria(id);
                markers.splice(id, 1);
                conteudoId.splice(id, 1);
                r.splice(id, 1);
                vr.splice(id, 1);
                red.splice(id, 1);
                green.splice(id, 1);
                blue.splice(id, 1);
                incrementoRed.splice(id, 1);
                incrementoGreen.splice(id, 1);
                incrementoBlue.splice(id, 1);
                next();
            });
            if (tamMemorias === 0) {
                tempQueue.delay(300);
                tempQueue.queue(function (next) {
                    tamMemorias = 1;
                    $('#memoriasDiv').append("<div class='memvazio'><p class='memoriaUserVaz'>você ainda não compartilhou<br>nenhuma memória!</p></div>");
                    $('.memvazio').fadeIn(300);
                    next();
                });
            }
            tempQueue.delay(500);
            tempQueue.queue(function (next) {
                location.reload();
                next();
            });

        });
        $('.estadoMem').click(function () {
            if (!$(this).parent().children('.memoriaUser').hasClass('selecionado') && !delAberto) {
                drawLinha1 = false;
                drawLinha2 = false;
                drawLinha3 = false;
                drawLinha4 = false;
                var id = $(this).attr('id');
                $('.selecionado').parent().children('.estadoMem').css('cursor', 'pointer');
                $('.selecionado').parent().children('.memoriaUserAno').fadeTo(100, 0.5).css('cursor', 'pointer');
                $('.selecionado').fadeTo(100, 0.5).removeClass('selecionado').css('cursor', 'pointer');
                $(this).parent().children('.memoriaUser').addClass('selecionado').css('cursor', 'auto');
                $(this).parent().children('.memoriaUserAno').css('cursor', 'auto');
                $(this).css('cursor', 'auto');
                $('#fechaMemoria').hide();
                $('.visualizaImg').hide();
                $('.visualizaVideo').hide();
                $('.visualizaAudio').hide();
                $('.visualizaTexto').hide();
                $('#tituloMemoria').hide();
                $('#descricaoMemoria').hide();
                $('#coordenadalatMemoria').hide();
                $('#coordenadalngMemoria').hide();
                $('#criadorMemoria').hide();
                memAberta = id;
                abreMemoria(id);
            }
        });
        $('.memoriaUser').click(function () {
            if (!$(this).hasClass('selecionado') && !delAberto) {
                drawLinha1 = false;
                drawLinha2 = false;
                drawLinha3 = false;
                drawLinha4 = false;
                var id = $(this).parent().children('.estadoMem').attr('id');
                $('.selecionado').parent().children('.estadoMem').css('cursor', 'pointer');
                $('.selecionado').parent().children('.memoriaUserAno').fadeTo(100, 0.5).css('cursor', 'pointer');
                $('.selecionado').fadeTo(100, 0.5).removeClass('selecionado').css('cursor', 'pointer');
                $(this).addClass('selecionado').css('cursor', 'auto');
                $(this).parent().children('.estadoMem').css('cursor', 'auto');
                $('#fechaMemoria').hide();
                $('.visualizaImg').hide();
                $('.visualizaVideo').hide();
                $('.visualizaAudio').hide();
                $('.visualizaTexto').hide();
                $('#tituloMemoria').hide();
                $('#descricaoMemoria').hide();
                $('#coordenadalatMemoria').hide();
                $('#coordenadalngMemoria').hide();
                $('#criadorMemoria').hide();
                memAberta = id;
                abreMemoria(id);
            }
        });
        $('.memoriaUserAno').click(function () {
            var el = $(this).parent().children('.memoriaUser');
            if (!el.hasClass('selecionado') && !delAberto) {
                drawLinha1 = false;
                drawLinha2 = false;
                drawLinha3 = false;
                drawLinha4 = false;
                var id = el.parent().children('.estadoMem').attr('id');
                $('.selecionado').parent().children('.estadoMem').css('cursor', 'pointer');
                $('.selecionado').parent().children('.memoriaUserAno').fadeTo(100, 0.5).css('cursor', 'pointer');
                $('.selecionado').fadeTo(100, 0.5).removeClass('selecionado').css('cursor', 'pointer');
                el.addClass('selecionado').css('cursor', 'auto');
                el.parent().children('.estadoMem').css('cursor', 'auto');
                $('#fechaMemoria').hide();
                $('.visualizaImg').hide();
                $('.visualizaVideo').hide();
                $('.visualizaAudio').hide();
                $('.visualizaTexto').hide();
                $('#tituloMemoria').hide();
                $('#descricaoMemoria').hide();
                $('#coordenadalatMemoria').hide();
                $('#coordenadalngMemoria').hide();
                $('#criadorMemoria').hide();
                memAberta = id;
                abreMemoria(id);
            }
        });
        $('.estadoMem').hover(
            function () {
                if (!delAberto) {
                    $(this).parent().children('p').fadeTo(100, 1);
                }
            },
            function () {
                var el = $(this).parent().children('p');
                if (!el.hasClass('selecionado')) {
                    $(this).parent().children('p').fadeTo(100, 0.5);
                }
            }
        );
        $('.memoriaUser').hover(
            function () {
                if (!delAberto) {
                    $(this).fadeTo(100, 1);
                    $(this).parent().children('.memoriaUserAno').fadeTo(100, 1);
                }
            },
            function () {
                var el = $(this);
                if (!el.hasClass('selecionado')) {
                    $(this).fadeTo(100, 0.5);
                    $(this).parent().children('.memoriaUserAno').fadeTo(100, 0.5);
                }
            }
        );
        $('.memoriaUserAno').hover(
            function () {
                if (!delAberto) {
                    $(this).fadeTo(100, 1);
                    $(this).parent().children('.memoriaUser').fadeTo(100, 1);
                }
            },
            function () {
                var el = $(this).parent().children('.memoriaUser');
                if (!el.hasClass('selecionado')) {
                    $(this).fadeTo(100, 0.5);
                    $(this).parent().children('.memoriaUser').fadeTo(100, 0.5);
                }
            }
        );
        $('.excluir').hover(
            function () {
                if (!delAberto) {
                    $(this).fadeTo(100, 0.7);
                }
            },
            function () {
                if (!delAberto) {
                    $(this).fadeTo(100, 0.3);
                }
            }
        );
        moveMemoria();
    };
    oReq.open("get", "php/visualisai.php", true); // define funcao do webservice
    oReq.send(); // envia dados ao webservice
}

/*-------------------------------------------------------------------------------------------------------------------------------------
 * Funções de carregamento do mapa
 *
 *cria mapa e define opções*/
function initialize() {
    "use strict";
    var mapOptions; // recebe opções relacionadas ao mapa
    geocoder = new google.maps.Geocoder(); // objeto para obtencao de coordenadas
    mapOptions = {
        center: {
            lat: -22.920753,
            lng: -43.226744
        }, // centraliza o mapa em são paulo
        zoom: 12, // zoom inicial do mapa
        minZoom: 4, // zoom minimo do mapa
        maxZoom: 18, // zoom máximo do mapa
        mapTypeId: google.maps.MapTypeId.ROADMAP, // mapa padrão a ser apresentado
        mapTypeControlOptions: { // opções de visualização do mapa
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE], // permite a escolha de visiualizacao em mapa ou em satélite
            position: google.maps.ControlPosition.BOTTOM_CENTER // posicão do controle de visualizacao
        },
        panControl: false, // desabilita o controle de movimeto pelo mapa
        streetViewControl: false, // desabilita street view
        keyboardShortcuts: false, // desabilita atalhos do teclado
        zoomControl: false, // desabilita controle de zoom
        mapTypeControl: false, // desabilita controle de tipo do mapa
        backgroundColor: '#2C3139',
        styles: styleArray // utlizia o estilo determinado pela variavel styleArray
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions); // cria mapa na divisao 'map-canvas' com as opcoes definidas em 'mapOptions'
    overlay = new google.maps.OverlayView();
    overlay.draw = function () {};
    overlay.setMap(map);
    /*cria campo de busca de endereco no input 'inputEndereco'*/
    autocomplete = new google.maps.places.Autocomplete(document.getElementById('inputEndereco'));

    autocompleteSearch = new google.maps.places.Autocomplete(document.getElementById('buscaEndereco'));

    google.maps.event.addListenerOnce(map, 'idle', function () {
        buscaMemoria();
    });
    /*completa o formulário quando um novo endereco é selecionado*/
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        fillInAddress();
    });
    google.maps.event.addListener(map, 'center_changed', function () {
        moveMemoria();
        $(document).ready(function () {
            var tempQueue = jQuery({});
            if (header && !signInAberto && !menuUserAberto) {
                tempQueue.queue(function (next) {
                    header = false;
                    $('#header').animate({
                        height: '0px'
                    }, 200);
                    $('#formBusca').animate({
                        top: '20px'
                    }, 200);
                    signInAberto = false;
                    $('#signin').fadeOut(100);
                    $('#falha').fadeOut(100);
                    $('#sair').fadeOut(100);
                    $('#botaoLogin').fadeOut(100);
                    $('#menuUser').fadeOut(100);
                    $('#logoImg').fadeOut(100);
                    $('#atvbusca').fadeIn('fast');
                    next();
                });
                tempQueue.delay(200);
                tempQueue.queue(function (next) {
                    var w = window.innerWidth;
                    $('#menuOpen').css({
                        "left": (w / 2) - (35 / 2)
                    });
                    $('#menuOpen').fadeIn(400);
                    next();
                });
            }
        });
    });
    google.maps.event.addListener(map, 'zoom_changed', function () {
        var tempQueue = jQuery({});
        tempQueue.delay(100);
        tempQueue.queue(function (next) {
            moveMemoria();
            next();
        });
    });
}

/*inicializa o mapa quando a página é carregada*/
google.maps.event.addDomListener(window, 'load', initialize);
