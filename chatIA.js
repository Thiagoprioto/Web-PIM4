const openChatBtn = document.getElementById('open-chat');
const closeChatBtn = document.getElementById('close-chat');
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');


function toggleChat() {
    chatBox.classList.toggle('hidden');
    // Faz rolar pra ultima mensagem se abrir
    if (!chatBox.classList.contains('hidden')) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

openChatBtn.addEventListener('click', toggleChat);
closeChatBtn.addEventListener('click', toggleChat);

// Transformei a função em ASYNC para poder esperar a resposta do servidor
async function sendMessage() {
    const messageText = userInput.value.trim();
    if (messageText === '') return; // não pode enviar mensagem sem nada

    // 1. Exibe a mensagem do USUÁRIO na tela
    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('message', 'user');
    userMessageDiv.innerHTML = `<p>${messageText}</p>`;
    chatMessages.appendChild(userMessageDiv);
    
    // Limpa o input e rola a tela
    userInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // 2. Chama o BACKEND (Integração Real)
    try {
        // Cria um ID de sessão aleatório simples (ou pegue do login se preferir)
        const sessionId = 'session_' + Math.floor(Math.random() * 100000);

        const response = await fetch('http://localhost:5043/api/Ia/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // O corpo deve combinar com a classe ChatRequest do C#
            body: JSON.stringify({ 
                Pergunta: messageText, 
                SessionId: sessionId 
            })
        });

        if (!response.ok) {
            throw new Error('Falha ao conectar com a IA');
        }

        const data = await response.json();
        // O backend retorna { "resposta": "..." }
        const botResponseText = data.resposta; 

        // 3. Exibe a resposta do BOT (IA) na tela
        const botMessageDiv = document.createElement('div');
        botMessageDiv.classList.add('message', 'bot');
        botMessageDiv.innerHTML = `<p>${botResponseText}</p>`;
        chatMessages.appendChild(botMessageDiv);

    } catch (error) {
        console.error('Erro no chat:', error);
        
        // Mensagem de erro visual para o usuário
        const errorMessageDiv = document.createElement('div');
        errorMessageDiv.classList.add('message', 'bot');
        errorMessageDiv.innerHTML = `<p>⚠️ Desculpe, não consegui conectar ao servidor no momento.</p>`;
        chatMessages.appendChild(errorMessageDiv);
    }

    // Rola para o final novamente para mostrar a nova mensagem
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Evento de clique no botão Enviar
sendBtn.addEventListener('click', sendMessage);

// Evento de apertar Enter
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});