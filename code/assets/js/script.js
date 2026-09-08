// Lista de 50 animais
const animais = [
    "gato",
    "cachorro",
    "girafa",
    "elefante",
    "tigre",
    "leão",
    "zebra",
    "cavalo",
    "coelho",
    "tartaruga",
    "gorila",
    "panda",
    "raposa",
    "camelo",
    "urso",
    "macaco",
    "hipopótamo",
    "rinoceronte",
    "lobo",
    "esquilo",
    "porco",
    "vaca",
    "ovelha",
    "cabra",
    "galinha",
    "pato",
    "ganso",
    "pavão",
    "papagaio",
    "arara",
    "coruja",
    "águia",
    "pinguim",
    "flamingo",
    "jacaré",
    "cobra",
    "sapo",
    "baleia",
    "golfinho",
    "tubarão",
    "polvo",
    "foca",
    "camaleão",
    "canguru",
    "capivara",
    "preguiça",
    "formiga",
    "aranha",
    "abelha",
    "borboleta"
];

let animaisUsados = [];
let palavraAtual = "";

let letrasTentadas = [];
let erros = 0;

let rodadaEncerrada = false;

let jogadorAtual = 1;
let pontosJogador1 = 0;
let pontosJogador2 = 0;

// Remove acentos para fazer as comparações
function normalizarTexto(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function sortearAnimal() {

    const animaisDisponiveis = animais.filter(animal => !animaisUsados.includes(animal));

    if (animaisDisponiveis.length === 0) {
        return null;
    }

    const indiceAleatorio = Math.floor(Math.random() * animaisDisponiveis.length);

    const animalSorteado = animaisDisponiveis[indiceAleatorio];

    // impedir que animal apareça duas vezes na mesma sessão
    animaisUsados.push(animalSorteado);

    return animalSorteado;
}

function mostrarPalavraEscondida() {

    const palavraEscondida = palavraAtual
        .split("")
        .map(letra => {
            if (letrasTentadas.includes(letra)) {
                return letra.toUpperCase();
            }

            return "_";
        })
        .join(" ");

    document.getElementById("palavra-secreta").textContent = palavraEscondida;
}

function atualizarErros() {
    document.getElementById("quantidade-erros").textContent = erros;
}

function atualizarLetrasErradas() {
    const letrasErradas = letrasTentadas.filter(letra => !palavraAtual.includes(letra));

    if (letrasErradas.length === 0) {
        document.getElementById("letras-erradas").textContent = "Nenhuma";
    } else {
        document.getElementById("letras-erradas").textContent = letrasErradas.join(", ").toUpperCase();
    }
}

function verificarLetra(letra) {
    if(rodadaEncerrada) {
        return;
    }

    // minúsculas
    letra = normalizarTexto(letra);

    if (letrasTentadas.includes(letra)) {
        return;
    }

    letrasTentadas.push(letra);

    if (!palavraAtual.includes(letra)) {
        erros++;
    }

    mostrarPalavraEscondida();
    atualizarErros();
    atualizarLetrasErradas();
    verificarFimRodada();
}

function configurarTeclado() {
    const botoes = document.querySelectorAll(".teclado button");

    botoes.forEach(botao => {
        botao.addEventListener("click", () => {
            verificarLetra(botao.textContent);

            botao.disabled = true;
        });
    });
}

function bloquearTeclado() {
    const botoes = document.querySelectorAll(".teclado button");

    botoes.forEach(botao => { botao.disabled = true; });
}

function liberarTeclado() {
    const botoes = document.querySelectorAll(".teclado button");

    botoes.forEach(botao => { botao.disabled = false; });
}

function iniciarRodada() {

    palavraAtual = sortearAnimal();

    letrasTentadas = [];
    erros = 0;
    rodadaEncerrada = false;

    document.getElementById("mensagem-resultado").textContent = "";
    document.getElementById("palavra-revelada").textContent = "";

    atualizarJogadorAtual();
    atualizarPlacar();

    // todos animais já foram utilizados, então encerra o jogo
    if (palavraAtual === null) {
        rodadaEncerrada = true;

        document.getElementById("mensagem-resultado").textContent =
            "Todos os animais já foram utilizados.";

        bloquearTeclado();

        document.getElementById("botao-proxima-rodada").disabled = true;

        return;
    }

    liberarTeclado();

    document.getElementById("botao-proxima-rodada").style.display = "none";

    mostrarPalavraEscondida();
    atualizarErros();
    atualizarLetrasErradas();

    console.log("Animal sorteado:", palavraAtual);
}

function verificarFimRodada() {
    // verifica se todas as letras da palavra foram adivinhadas (.every() retorna true se todas as letras de palavraAtual estiverem em letrasTentadas)
    const venceu = palavraAtual.split("").every(letra => letrasTentadas.includes(letra));

    if (venceu) {
        rodadaEncerrada = true;

        if(jogadorAtual === 1) {
            pontosJogador1++;
        } else {
            pontosJogador2++;
        }

        atualizarPlacar();

        document.getElementById("mensagem-resultado").textContent = "Jogador " + jogadorAtual + " venceu a rodada!";

        document.getElementById("palavra-revelada").textContent = "Palavra: " + palavraAtual.toUpperCase();

        bloquearTeclado();

        document.getElementById("botao-proxima-rodada").style.display = "block";

        return;
    }

    if (erros >= 6) {
        rodadaEncerrada = true;

        document.getElementById("mensagem-resultado").textContent = "Jogador " + jogadorAtual + " perdeu!";

        document.getElementById("palavra-revelada").textContent = "Palavra: " + palavraAtual.toUpperCase();

        bloquearTeclado();
        document.getElementById("botao-proxima-rodada").style.display = "block";
    }
}

function atualizarPlacar() {
    document.getElementById("pontos-jogador-1").textContent = pontosJogador1;
    document.getElementById("pontos-jogador-2").textContent = pontosJogador2;
}

function atualizarJogadorAtual() {
    document.getElementById("jogador-atual").textContent = "Vez do jogador " + jogadorAtual;
}

function trocarJogador() {
    if(jogadorAtual === 1) {
        jogadorAtual = 2;
    } else {
        jogadorAtual = 1;
    }
}

function reiniciarJogo() {
    animaisUsados = [];

    pontosJogador1 = 0;
    pontosJogador2 = 0;

    jogadorAtual = 1;

    iniciarRodada();
}

document.getElementById("botao-proxima-rodada").addEventListener("click", () => {
    trocarJogador();
    iniciarRodada();
});

document.getElementById("botao-reiniciar").addEventListener("click", reiniciarJogo);

configurarTeclado();

iniciarRodada();