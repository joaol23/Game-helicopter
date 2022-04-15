var jogo = {},
    tecla = {
        W: '87',
        S: '83',
        D: '68'
    };

var velocidade = 5;
var posicaoY = parseInt(Math.random() * 334);
var podeAtirar = true;
var fimdejogo = false;

var pontos = 0;
var salvos = 0;
var perdidos = 0;

var energiaAtual = 3;

var somDisparo = document.getElementById("somDisparo");
var somExplosao = document.getElementById("somExplosao");
var musica = document.getElementById("musica");
var somGameover = document.getElementById("somGameover");
var somPerdido = document.getElementById("somPerdido");
var somResgate = document.getElementById("somResgate");

jogo.pressionou = [];

function start() {
    $(".inicio").hide();

    $(".fundo").append("<div class='jogador anima1'></div>");
    $(".fundo").append("<div class='inimigo1 anima2'></div>");
    $(".fundo").append("<div class='inimigo2'></div>");
    $(".fundo").append("<div class='amigo anima3'></div>");

    $(document).keydown(function (e) {
        jogo.pressionou[e.which] = true;
    });

    $(document).keyup(function (e) {
        jogo.pressionou[e.which] = false;
    });

    jogo.timer = setInterval(loop, 20);
    musica.addEventListener("ended", function () { musica.currentTime = 0; musica.play(); }, false);
    musica.play();
}


function loop() {
    moveFundo();
    movejogador();
    moveinimigo1();
    moveinimigo2();
    moveAmigo();
    placar();
    energia();
}

function moveFundo() {
    let esquerda = parseInt($(".fundo").css("background-position"));
    $(".fundo").css("background-position", esquerda - 1);
}

function movejogador() {
    let topo = parseInt($(".jogador").css("top"));

    if (jogo.pressionou[tecla.W]) {
        $(".jogador").css("top", topo - 10);

        if (topo <= 0) {
            $(".jogador").css("top", topo + 10);
        }
    }

    if (jogo.pressionou[tecla.S]) {
        $(".jogador").css("top", topo + 10);

        if (topo >= parseInt($(".amigo").css("top"))) {
            $(".jogador").css("top", topo - 10);
        }
    }

    if (jogo.pressionou[tecla.D]) {
        disparo();
    }

    if (colision(".jogador", ".amigo")) {
        reposicionaClass("amigo", 'anima3');
        somResgate.play();
        salvos++;
    }
}

function moveinimigo1() {

    let posicaoX = parseInt($(".inimigo1").css("left"));
    $(".inimigo1").css("left", posicaoX - velocidade);
    $(".inimigo1").css("top", posicaoY);

    if (colision(".jogador", ".inimigo1")) {
        explosao(".inimigo1");
        inimigo1Start();
        pontos += 30;
    }

    if (posicaoX <= 0) {
        inimigo1Start();
        energiaAtual--;
    }
}

function moveinimigo2() {
    let velocidade = 2;
    let posicaoX = parseInt($(".inimigo2").css("left"));
    $(".inimigo2").css("left", posicaoX - velocidade);

    if (posicaoX <= 0) {
        inimigo2Start();
    }

    if (colision(".jogador", ".inimigo2")) {
        explosao(".inimigo2");
        amigoStart();
        inimigo2Start();
        pontos += 30;
    }
}

function moveAmigo() {
    let velocidade = 1;
    let posicaoX = parseInt($(".amigo").css("left"));
    $(".amigo").css("left", posicaoX + velocidade);

    if (colision(".amigo", ".inimigo2")) {
        explosao(".amigo", 'explosao2', ' anima4');
        reposicionaClass("amigo", 'anima3');
        inimigo2Start();
        perdidos++;
        energiaAtual--;
        somPerdido.play();
    }

    if (posicaoX > 906) {
        amigoStart();
        somResgate.play();
        salvos++;
    }
}

function amigoStart() {
    $(".amigo").css("left", 0);
}

function inimigo2Start() {
    $(".inimigo2").css("left", 775);
}


function disparo() {

    if (podeAtirar == true) {
        podeAtirar = false;
        somDisparo.play();

        topo = parseInt($(".jogador").css("top"))
        posicaoX = parseInt($(".jogador").css("left"))
        tiroX = posicaoX + 190;
        topoTiro = topo + 37;
        $(".fundo").append("<div class='disparo'></div");
        $(".disparo").css("top", topoTiro);
        $(".disparo").css("left", tiroX);

        var tempoDisparo = window.setInterval(executaDisparo, 30);

    }

    function executaDisparo() {

        posicaoX = parseInt($(".disparo").css("left"));
        $(".disparo").css("left", posicaoX + 15);

        if (colision(".disparo", ".inimigo1")) {
            explosao(".inimigo1");
            disparoStart(tempoDisparo);
            reposicionaClass("inimigo1", 'anima2');
            pontos += 100;
            velocidade = velocidade + 0.3;
        }

        if (colision(".disparo", ".inimigo2")) {
            explosao(".inimigo2");
            disparoStart(tempoDisparo);
            reposicionaClass("inimigo2");
            pontos += 50;
        }

        if (posicaoX > 900) {
            disparoStart(tempoDisparo);
        }
    }
}

function disparoStart(tempoDisparo) {
    window.clearInterval(tempoDisparo);
    tempoDisparo = null;
    $(".disparo").remove();
    podeAtirar = true;
}

function inimigo1Start() {
    posicaoY = parseInt(Math.random() * 334);
    $(".inimigo1").css("left", 694);
    $(".inimigo1").css("top", posicaoY);
}


function colision(element1, element2) {
    let colision = ($(element1).collision($(element2)));

    if (colision.length > 0) {
        return true;
    }

    return false;
}

function explosao(elemento, explosao = 'explosao1', extraClass = '') {
    let posicaoY = parseInt($(elemento).css("top"));
    let posicaoX = parseInt($(elemento).css("left"));

    $(".fundo").append("<div class='" + explosao + extraClass + "'></div");
    $(".explosao1").css("background-image", "url(imgs/explosao.png)");
    var div = $("." + explosao);
    div.css("top", posicaoY);
    div.css("left", posicaoX);
    div.animate({ width: 200, opacity: 0 }, "slow");

    var tempoExplosao = window.setInterval(removeExplosao, 1000);

    somExplosao.play();

    function removeExplosao() {
        div.remove();
        window.clearInterval(tempoExplosao);
        tempoExplosao = null;
    }
}

function reposicionaClass(elemento, extraClass = '') {
    $('.' + elemento).remove();
    var tempoColisao4 = window.setInterval(reposiciona4, 3000);

    function reposiciona4() {
        window.clearInterval(tempoColisao4);
        tempoColisao4 = null;

        if (fimdejogo == false) {

            $(".fundo").append("<div class='" + elemento + ' ' + (extraClass != '' ? extraClass : '') + "'></div");
            window[elemento + "Start"]();
        }
    }
}

function placar() {
    $(".placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
}

function energia() {
    if (energiaAtual == 3) {
        $(".energia").css("background-image", "url(imgs/energia3.png)");
    }

    if (energiaAtual == 2) {
        $(".energia").css("background-image", "url(imgs/energia2.png)");
    }

    if (energiaAtual == 1) {
        $(".energia").css("background-image", "url(imgs/energia1.png)");
    }

    if (energiaAtual == 0) {
        $(".energia").css("background-image", "url(imgs/energia0.png)");
        gameOver();
    }
}

function gameOver() {
    fimdejogo = true;
    musica.pause();
    somGameover.play();

    window.clearInterval(jogo.timer);
    jogo.timer = null;

    $(".jogador").remove();
    $(".inimigo1").remove();
    $(".inimigo2").remove();
    $(".amigo").remove();

    $(".fundo").append("<div class='fim'></div>");

    $(".fim").html("<h1> Game Over </h1><p>Sua pontuação foi: <b>" + pontos + "</b></p>" + "<div class='reinicia'>Jogar Novamente</div>");
}

function reiniciaJogo() {
    somGameover.pause();
    $(".fim").remove();
    start();
    fimdejogo = false;
    energiaAtual = 3;
}

$(".start-game").on("click", function () {
    start();
})

$(document).on('click', '.reinicia', function () {
    reiniciaJogo();
})
