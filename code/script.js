// 1. DADOS DO JOGO (Banco de Dados Interno)

// Lista de problemas do Rei e os 2 ingredientes necessários (pelo ID) para resolver.
const bancoProblemas = [
    {
        id: 1,
        texto: "O Rei está com uma calvície severa e exige seus cabelos de volta!",
        solucao: ["ing-1", "ing-2"]
    },
    {
        id: 2,
        texto: "O Rei comeu ensopado de dragão e está com fortes dores de estômago.",
        solucao: ["ing-3", "ing-4"]
    },
    {
        id: 3,
        texto: "O Rei quer uma poção para ficar invisível e fugir de suas obrigações.",
        solucao: ["ing-5", "ing-6"]
    },
    {
        id: 4,
        texto: "O Rei precisa de coragem para enfrentar o reino vizinho em um debate.",
        solucao: ["ing-7", "ing-8"]
    },
    {
        id: 5,
        texto: "O Rei não consegue dormir há dias e precisa de um sono profundo.",
        solucao: ["ing-9", "ing-10"]
    },
    {
        id: 6,
        texto: "O Rei acidentalmente se transformou em uma lhama! Faça-o voltar ao normal.",
        solucao: ["ing-1", "ing-10"]
    }
];

// 2. VARIÁVEIS DE CONTROLE DE ESTADO

let pontosSucesso = 0;
let pontosFalha = 0;
let problemaAtual = null;
let ingredientesNoCaldeirao = [];

// Elementos do DOM
const textoProblema = document.getElementById("texto-problema");
const placarSucesso = document.getElementById("pontos-sucesso");
const placarFalha = document.getElementById("pontos-falha");
const zonaCaldeirao = document.getElementById("caldeirao");
const btnMisturar = document.getElementById("btn-misturar");
const elementosIngredientes = document.querySelectorAll(".ingrediente");

// Controle do Modal
const modalJogo = document.getElementById("modal-jogo");
const modalTitulo = document.getElementById("modal-titulo");
const modalTexto = document.getElementById("modal-texto");
const btnFecharModal = document.getElementById("btn-fechar-modal");
let acaoAposModal = null;

// Função para exibir o modal customizado
function mostrarModal(titulo, mensagem, callback = null) {
    modalTitulo.textContent = titulo;
    modalTexto.innerHTML = mensagem;
    acaoAposModal = callback;
    modalJogo.classList.remove("modal-oculto");
}

document.getElementById("btn-como-jogar").addEventListener("click", () => {
    mostrarModal(
        "📜 REGRAS DO JOGO", 
        "<ul style='text-align: left; line-height: 1.6;'>" +
        "<li><b>Analise:</b> Leia o problema do cliente.</li>" +
        "<li><b>Prepare:</b> Arraste 2 ingredientes para o caldeirão.</li>" +
        "<li><b>Ação:</b> Clique em 'Misturar Poção!'.</li>" +
        "</ul>" +
        "Alcance <b>3 Problemas Resolvidos</b> para vencer!"
    );
});

// O que acontece ao clicar no botão "Continuar" do modal
btnFecharModal.addEventListener("click", () => {
    modalJogo.classList.add("modal-oculto");
    if (acaoAposModal) {
        acaoAposModal();
    }
});

// 3. LÓGICA PRINCIPAL (Início e Sorteio)

function iniciarJogo() {
    pontosSucesso = 0;
    pontosFalha = 0;
    atualizarPlacar();
    sortearProblema();
    limparCaldeirao();
}

function sortearProblema() {
    const indiceAleatorio = Math.floor(Math.random() * bancoProblemas.length);
    problemaAtual = bancoProblemas[indiceAleatorio];

    textoProblema.textContent = `"${problemaAtual.texto}"`;
}

function atualizarPlacar() {
    placarSucesso.textContent = pontosSucesso;
    placarFalha.textContent = pontosFalha;
}

// 4. EVENTOS DE ARRASTAR E SOLTAR (DRAG & DROP)

elementosIngredientes.forEach(ingrediente => {
    ingrediente.addEventListener("dragstart", (evento) => {
        evento.dataTransfer.setData("text", evento.target.id);
    });
});

// Permite que a zona do caldeirão receba itens arrastados
zonaCaldeirao.addEventListener("dragover", (evento) => {
    evento.preventDefault();
});

// O que acontece quando o jogador solta o ingrediente no caldeirão
zonaCaldeirao.addEventListener("drop", (evento) => {
    evento.preventDefault();
    const idIngrediente = evento.dataTransfer.getData("text");

    adicionarAoCaldeirao(idIngrediente);
});

// (Opcional) Permitir clicar no ingrediente para ir ao caldeirão sem arrastar
elementosIngredientes.forEach(ingrediente => {
    ingrediente.addEventListener("click", (evento) => {
        adicionarAoCaldeirao(evento.currentTarget.id);
    });
});

// 5. LÓGICA DO CALDEIRÃO E MISTURA
function adicionarAoCaldeirao(id) {
    if (ingredientesNoCaldeirao.length >= 2) {
        mostrarModal("Caldeirão Cheio", "O caldeirão já está cheio! Só cabem 2 ingredientes.");
        return;
    }

    if (ingredientesNoCaldeirao.includes(id)) {
        mostrarModal("Atenção", "Você já adicionou esse ingrediente no caldeirão!");
        return;
    }

    ingredientesNoCaldeirao.push(id);
    
    // Pega a imagem e o texto originais do ingrediente clicado/arrastado
    const ingredienteOriginal = document.getElementById(id);
    const imagemSrc = ingredienteOriginal.querySelector("img").src;
    const nomeTexto = ingredienteOriginal.querySelector("span").textContent;
    
    // Cria um HTML injetável para o slot, mantendo o visual de RPG
    const conteudoSlot = `
        <img src="${imagemSrc}" alt="${nomeTexto}" style="width: 50px; height: 50px; object-fit: contain;">
        <span style="font-size: 12px; font-weight: bold; color: #46332d; text-align: center;">${nomeTexto}</span>
    `;
    
    // Joga o visual direto no slot livre
    if (ingredientesNoCaldeirao.length === 1) {
        document.getElementById("slot-1").innerHTML = conteudoSlot;
    } else if (ingredientesNoCaldeirao.length === 2) {
        document.getElementById("slot-2").innerHTML = conteudoSlot;
    }
}

function limparCaldeirao() {
    ingredientesNoCaldeirao = [];
    
    // Apaga as imagens que estão dentro dos slots
    document.getElementById("slot-1").innerHTML = "";
    document.getElementById("slot-2").innerHTML = "";
}

// Valida a poção quando clica no botão "Misturar Poção"
btnMisturar.addEventListener("click", () => {
    if (ingredientesNoCaldeirao.length !== 2) {
        alert("Para fazer uma poção, o caldeirão precisa de exatamente 2 ingredientes!");
        return;
    }

    // Verifica se os ingredientes escolhidos correspondem aos do problema atual
    // Verifica se todos os ingredientes da solucao estão presentes no array do caldeirao
    const pocaoCorreta = problemaAtual.solucao.every(ingrediente =>
        ingredientesNoCaldeirao.includes(ingrediente)
    );

    if (pocaoCorreta) {
        pontosSucesso++;
        mostrarModal("Sucesso!", "Parabéns! Você resolveu o problema do Rei!", verificarFimDeJogo);
    } else {
        pontosFalha++;
        mostrarModal("BOOM!", "Poção Errada! O Rei ficou muito zangado!", verificarFimDeJogo);
    }
    atualizarPlacar();

    atualizarPlacar();
    verificarFimDeJogo();
});

// 6. CONDIÇÕES DE VITÓRIA E DERROTA

function verificarFimDeJogo() {
    if (pontosSucesso >= 3) {
        mostrarModal("VITÓRIA!", "Você é o maior Mestre das Poções! Emprego garantido!", iniciarJogo);
        iniciarJogo(); // Reinicia
    } else if (pontosFalha >= 3) {
        mostrarModal("DERROTA!", "O Rei revogou sua licença de Alquimista. Você foi demitido!", iniciarJogo);
        iniciarJogo(); // Reinicia
    } else {
        // Se ainda não acabou o jogo, limpa o caldeirão e sorteia o próximo problema
        limparCaldeirao();
        sortearProblema();
    }
}

// Botão Ir Para Casa
function reiniciarJogo() {
    mostrarModal("Você foi para casa tirar uma soneca e deixou o Rei esperando...");
    iniciarJogo();
}

// Botão Como Jogar
document.getElementById("btn-como-jogar").addEventListener("click", () => {
    mostrarModal("REGRAS:\n 1. Leia o problema.\n2. Arraste 2 ingredientes até o caldeirão.\n3. Clique em 'Misturar Poção!'.\n\nAlcance 3 Problemas Resolvidos para vencer!");
});

window.onload = iniciarJogo;