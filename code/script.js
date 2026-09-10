// 1. DADOS DO JOGO (Banco de Dados Interno)

const bancoProblemas = [
    {
        id: 1,
        texto: "O Rei está com uma calvície severa e exige seus cabelos de volta!",
        solucao: ["ing-1", "ing-2"],
        imagemPocao: "pocao1.png"
    },
    {
        id: 2,
        texto: "O Rei comeu ensopado de dragão e está com fortes dores de estômago.",
        solucao: ["ing-3", "ing-4"],
        imagemPocao: "pocao2.png"
    },
    {
        id: 3,
        texto: "O Rei quer uma poção para ficar invisível e fugir de suas obrigações.",
        solucao: ["ing-5", "ing-6"],
        imagemPocao: "pocao3.png"
    },
    {
        id: 4,
        texto: "O Rei precisa de coragem para enfrentar o reino vizinho em um debate.",
        solucao: ["ing-7", "ing-8"],
        imagemPocao: "pocao4.png"
    },
    {
        id: 5,
        texto: "O Rei não consegue dormir há dias e precisa de um sono profundo.",
        solucao: ["ing-9", "ing-10"],
        imagemPocao: "pocao5.png"
    },
    {
        id: 6,
        texto: "O Rei acidentalmente se transformou em uma lhama! Faça-o voltar ao normal.",
        solucao: ["ing-1", "ing-10"],
        imagemPocao: "pocao6.png"
    }
];

// 2. VARIÁVEIS DE CONTROLE DE ESTADO

let pontosSucesso = 0;
let pontosFalha = 0;
let problemaAtual = null;
let ingredientesNoCaldeirao = [];
let problemasNaoUsados = [];

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
const modalConteudo = document.querySelector(".modal-conteudo");
const btnFecharModal = document.getElementById("btn-fechar-modal");
let acaoAposModal = null;

// Função para exibir o modal customizado
function mostrarModal(titulo, mensagem, callback = null, tipo = "normal") {
    modalTitulo.textContent = titulo;
    modalTexto.innerHTML = mensagem;
    acaoAposModal = callback;
    
    // Limpa os efeitos especiais passados (para não bugar)
    modalConteudo.classList.remove("modal-vitoria", "modal-derrota");
    
    if (tipo === "vitoria") {
        modalConteudo.classList.add("modal-vitoria");
    } else if (tipo === "derrota") {
        modalConteudo.classList.add("modal-derrota");
    }

    modalJogo.classList.remove("modal-oculto");
}

// O que acontece ao clicar no botão Continuar do modal
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

    // Cria uma cópia do banco de problemas usando o Spread Operator
    problemasNaoUsados = [...bancoProblemas]; 
    
    atualizarPlacar();
    sortearProblema();
    limparCaldeirao();
}

function sortearProblema() {
    if (problemasNaoUsados.length === 0) {
        problemasNaoUsados = [...bancoProblemas];
    }

    const indiceAleatorio = Math.floor(Math.random() * problemasNaoUsados.length);
    problemaAtual = problemasNaoUsados.splice(indiceAleatorio, 1)[0];
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
        const caminhoDaImagem = evento.target.querySelector("img").src;
        const imagemFantasma = new Image();
        imagemFantasma.src = caminhoDaImagem;
        
        evento.dataTransfer.setDragImage(imagemFantasma, 25, 25);
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
    
    // Cria um HTML injetável para o slot
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

// Valida a poção quando clica no botão Misturar Poção
btnMisturar.addEventListener("click", () => {
    if (ingredientesNoCaldeirao.length !== 2) {
        mostrarModal("ATENÇÃO!", "Para fazer uma poção, o caldeirão precisa de exatamente 2 ingredientes!");
        return;
    }

    // Verifica se os ingredientes escolhidos correspondem aos do problema atual
    const pocaoCorreta = problemaAtual.solucao.every(ingrediente => 
        ingredientesNoCaldeirao.includes(ingrediente)
    );

    if (pocaoCorreta) {
        pontosSucesso++;
        atualizarPlacar();
        const mensagemSucesso = `
            Parabéns! Você resolveu o problema do Rei!<br><br>
            <img src="${problemaAtual.imagemPocao}" alt="Poção Criada" style="width: 120px; height: 120px; object-fit: contain; filter: drop-shadow(0 0 10px rgba(46, 139, 87, 0.8));"><br><br>
            <strong>Poção Concluída!</strong>
        `;
        mostrarModal("Sucesso!", mensagemSucesso, verificarFimDeJogo);
    } else {
        pontosFalha++;
        atualizarPlacar();
        mostrarModal("BOOM!", "Poção Errada! O Rei ficou muito zangado!", verificarFimDeJogo);
    }
});

// 6. CONDIÇÕES DE VITÓRIA E DERROTA

function verificarFimDeJogo() {
    if (pontosSucesso >= 3) {
        mostrarModal(
            "🏆 VITÓRIA! 🏆", 
            "<h3>Você é o(a) Maior Alquimista!</h3><br>O Rei está curado e te recompensou com um 'Obrigado'. Seu emprego está mais do que garantido!", 
            iniciarJogo, 
            "vitoria"
        );
    } else if (pontosFalha >= 3) {
        mostrarModal(
            "💥 DERROTA! 💥", 
            "O Rei revogou sua licença e te baniu do reino. Você foi demitido(a)!", 
            iniciarJogo, 
            "derrota"
        );
    } else {
        limparCaldeirao();
        sortearProblema();
    }
}

// Botão Ir Para Casa
function reiniciarJogo() {
    mostrarModal(
        "Fim de Expediente!", 
        "Você foi para casa tirar uma soneca e deixou o Rei esperando...", 
        iniciarJogo,
        "derrota"
    );
}

document.getElementById("btn-como-jogar").addEventListener("click", () => {
    mostrarModal(
        "📜 REGRAS DO JOGO", 
        "<ul style='text-align: left; line-height: 1.6;'>" +
        "<li><b>Analise:</b> Leia o problema do Rei.</li>" +
        "<li><b>Prepare:</b> Arraste 2 ingredientes para o caldeirão.</li>" +
        "<li><b>Ação:</b> Clique em 'Misturar Poção!'.</li>" +
        "</ul>" +
        "Alcance <b>3 Problemas Resolvidos</b> para vencer!"
    );
});

window.onload = iniciarJogo;