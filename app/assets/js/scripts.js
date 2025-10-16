// --- Constantes e Variáveis de Estado ---
const API_URL = 'http://127.0.0.1:8084';

// Elementos do DOM
const quizContainerEl = document.getElementById('quiz-container');
const progressHeaderEl = document.getElementById('progress-header');
const perguntaTextoEl = document.getElementById('pergunta-texto');
const opcoesFormEl = document.getElementById('opcoes-form');
const nextBtnEl = document.getElementById('next-btn');

// Estado do Quiz
let perguntas = [];
let indicePerguntaAtual = 0;
let respostasUsuario = [];

// --- Funções ---

// Embaralha os itens de um array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// 1. Busca as perguntas na API e inicia o quiz (COM DIAGNÓSTICO DE ERRO)
async function carregarPerguntas() {
    try {
        const response = await fetch(`${API_URL}/questions`);

        // Verifica se o servidor respondeu com um código de erro (como 404 Not Found)
        if (!response.ok) {
            throw new Error(`O servidor respondeu com um erro: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        perguntas = shuffleArray(data);
        mostrarPergunta();

    } catch (error) {
        console.error("--- DETALHES DO ERRO ---");
        console.error(error); // Isso irá imprimir o erro completo no console do navegador

        let userMessage = "Falha ao carregar o quiz. Verifique se a API está no ar na porta 8084.";

        // Fornece uma causa provável baseada no tipo de erro
        if (error.message.includes("Failed to fetch")) {
            userMessage += "<br><br><b>Causa Provável:</b> Problema de CORS ou o servidor parou. Verifique o console do navegador (pressione F12) para mensagens de erro em vermelho.";
        } else if (error.message.includes("404")) {
            userMessage += "<br><br><b>Causa Provável:</b> A API está funcionando, mas a rota <b>/questions</b> não foi encontrada no seu arquivo <b>main.py</b>.";
        } else {
            userMessage += `<br><br><b>Detalhe do Erro:</b> ${error.message}`;
        }

        perguntaTextoEl.innerHTML = userMessage;
    }
}


// 2. Exibe a pergunta atual e suas opções
function mostrarPergunta() {
    quizContainerEl.classList.remove('fade-out');
    const pergunta = perguntas[indicePerguntaAtual];
    const opcoes = pergunta.opcoes;

    progressHeaderEl.innerText = `Pergunta ${indicePerguntaAtual + 1} de ${perguntas.length}`;
    perguntaTextoEl.innerText = pergunta.texto;
    opcoesFormEl.innerHTML = '';
    nextBtnEl.disabled = true;
    nextBtnEl.innerText = (indicePerguntaAtual === perguntas.length - 1) ? 'Finalizar' : 'Próximo';

    opcoes.forEach((opcao, index) => {
        const opcaoId = `opcao${index}`;
        const opcaoItem = document.createElement('div');
        opcaoItem.className = 'opcao-item';
        opcaoItem.innerHTML = `
            <input type="radio" id="${opcaoId}" name="resposta" value="${opcao}">
            <label for="${opcaoId}">${opcao}</label>
        `;
        opcoesFormEl.appendChild(opcaoItem);
    });
}

// 3. Função para lidar com o clique no botão "Próximo/Finalizar"
function proximaPergunta() {
    const respostaSelecionada = document.querySelector('input[name="resposta"]:checked');
    if (!respostaSelecionada) {
        alert('Por favor, selecione uma opção.');
        return;
    }

    respostasUsuario.push({
        question_text: perguntas[indicePerguntaAtual].texto,
        answer: respostaSelecionada.value
    });

    indicePerguntaAtual++;
    quizContainerEl.classList.add('fade-out');

    setTimeout(() => {
        if (indicePerguntaAtual < perguntas.length) {
            mostrarPergunta();
        } else {
            finalizarQuiz();
        }
    }, 300);
}

// 4. Envia as respostas para a API e REDIRECIONA
async function finalizarQuiz() {
    try {
        const response = await fetch(`${API_URL}/result`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(respostasUsuario)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Falha ao enviar resultado para a API.');
        }

        window.location.href = '../index.html';

    } catch (error) {
        console.error("Erro ao finalizar o quiz:", error);
        document.body.innerHTML = `<h1>Erro ao comunicar com o servidor.</h1><p>${error.message}</p>`;
    }
}

// --- Event Listeners ---
opcoesFormEl.addEventListener('change', () => {
    nextBtnEl.disabled = false;
});

nextBtnEl.addEventListener('click', proximaPergunta);

// --- Iniciar o Quiz ---
carregarPerguntas();