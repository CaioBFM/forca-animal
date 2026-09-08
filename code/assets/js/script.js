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
    const animaisDisponiveis = animais.filter(
        animal => !animaisUsados.includes(animal)
    );

    if (animaisDisponiveis.length === 0) {
        return null;
    }

    const indiceAleatorio = Math.floor(
        Math.random() * animaisDisponiveis.length
    );

    const animalSorteado = animaisDisponiveis[indiceAleatorio];

    // Impede repetição durante a mesma partida
    animaisUsados.push(animalSorteado);

    return animalSorteado;
}


function mostrarPalavraEscondida() {
    const palavraEscondida = palavraAtual
        .split("")
        .map(letra => {

            const letraNormalizada = normalizarTexto(letra);

            if (letrasTentadas.includes(letraNormalizada)) {
                return letra.toUpperCase();
            }

            return "_";
        })
        .join(" ");

    document.getElementById("palavra-secreta").textContent =
        palavraEscondida;
}


function atualizarErros() {
    document.getElementById("quantidade-erros").textContent = erros;
}


function atualizarLetrasErradas() {
    const palavraNormalizada = normalizarTexto(palavraAtual);

    const letrasErradas = letrasTentadas.filter(
        letra => !palavraNormalizada.includes(letra)
    );

    if (letrasErradas.length === 0) {
        document.getElementById("letras-erradas").textContent =
            "Nenhuma";
    } else {
        document.getElementById("letras-erradas").textContent =
            letrasErradas.join(", ").toUpperCase();
    }
}


function verificarLetra(letra) {
    if (rodadaEncerrada) {
        return;
    }

    letra = normalizarTexto(letra);

    if (letrasTentadas.includes(letra)) {
        return;
    }

    letrasTentadas.push(letra);

    const palavraNormalizada = normalizarTexto(palavraAtual);

    if (!palavraNormalizada.includes(letra)) {
        erros++;
    }

    mostrarPalavraEscondida();
    atualizarErros();
    atualizarLetrasErradas();
    atualizarDesenhoForca();

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

    botoes.forEach(botao => {
        botao.disabled = true;
    });
}


function liberarTeclado() {
    const botoes = document.querySelectorAll(".teclado button");

    botoes.forEach(botao => {
        botao.disabled = false;
    });
}


function verificarFimRodada() {
    const palavraNormalizada = normalizarTexto(palavraAtual);

    const venceu = palavraNormalizada.split("").every(letra => letrasTentadas.includes(letra));

    if (venceu) {
        rodadaEncerrada = true;

        if (jogadorAtual === 1) {
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
        mostrarMorte();

        rodadaEncerrada = true;

        document.getElementById("mensagem-resultado").textContent = "Jogador " + jogadorAtual + " perdeu a rodada!";

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
    document.getElementById("jogador-atual").textContent =
        "Vez do Jogador " + jogadorAtual;
}


function trocarJogador() {
    if (jogadorAtual === 1) {
        jogadorAtual = 2;
    } else {
        jogadorAtual = 1;
    }
}


function iniciarRodada() {
    palavraAtual = sortearAnimal();

    letrasTentadas = [];
    erros = 0;
    atualizarDesenhoForca();
    resetarMorte();
    rodadaEncerrada = false;

    document.getElementById("mensagem-resultado").textContent = "";
    document.getElementById("palavra-revelada").textContent = "";

    atualizarJogadorAtual();
    atualizarPlacar();

    if (palavraAtual === null) {
        rodadaEncerrada = true;

        document.getElementById("mensagem-resultado").textContent =
            "Todos os animais já foram utilizados.";

        bloquearTeclado();

        document.getElementById("botao-proxima-rodada").style.display =
            "none";

        return;
    }

    liberarTeclado();

    document.getElementById("botao-proxima-rodada").style.display = "none";

    mostrarPalavraEscondida();
    atualizarErros();
    atualizarLetrasErradas();
}


function reiniciarJogo() {
    animaisUsados = [];

    pontosJogador1 = 0;
    pontosJogador2 = 0;

    jogadorAtual = 1;

    iniciarRodada();
}


function atualizarDesenhoForca() {
    const partesCorpo = [
        "cabeca",
        "corpo",
        "braco-esquerdo",
        "braco-direito",
        "perna-esquerda",
        "perna-direita"
    ];

    partesCorpo.forEach((parte, indice) => {
        const elemento = document.getElementById(parte);

        if (indice < erros) {
            elemento.style.visibility = "visible";
        } else {
            elemento.style.visibility = "hidden";
        }
    });
}


function mostrarMorte() {
    document.getElementById("olho-x-esquerdo").style.visibility = "visible";
    document.getElementById("olho-x-direito").style.visibility = "visible";

    document.getElementById("boneco").classList.add("boneco-morto");
}


function resetarMorte() {
    document.getElementById("olho-x-esquerdo").style.visibility = "hidden";
    document.getElementById("olho-x-direito").style.visibility = "hidden";

    document.getElementById("boneco").classList.remove("boneco-morto");
}

document.getElementById("botao-proxima-rodada").addEventListener("click", () => {
    trocarJogador();
    iniciarRodada();
});


document.getElementById("botao-reiniciar").addEventListener("click", reiniciarJogo);

const modalComoJogar = document.getElementById("modal-como-jogar");

document.getElementById("como-jogar").addEventListener("click", () => {
    modalComoJogar.style.display = "flex";
});

document.getElementById("fechar-modal").addEventListener("click", () => {
    modalComoJogar.style.display = "none";
});

modalComoJogar.addEventListener("click", (evento) => {
    if (evento.target === modalComoJogar) {
        modalComoJogar.style.display = "none";
    }
});

configurarTeclado();
iniciarRodada();