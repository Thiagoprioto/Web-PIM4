

const openChatBtn = document.getElementById('open-chat');
const closeChatBtn = document.getElementById('close-chat');
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');


function toggleChat() {
    chatBox.classList.toggle('hidden');
    // Rfaz rolar pra ultima mensagem
    if (!chatBox.classList.contains('hidden')) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}


openChatBtn.addEventListener('click', toggleChat);
closeChatBtn.addEventListener('click', toggleChat);

function sendMessage() {
    const messageText = userInput.value.trim();
    if (messageText === '') return; // não pode enviar mensagem sem nada

    // mensagem nossa
    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('message', 'user');
    userMessageDiv.innerHTML = `<p>${messageText}</p>`;
    chatMessages.appendChild(userMessageDiv);

    
    userInput.value = '';

    // conseguir rolar
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // *** resposta ***
    setTimeout(() => {
        const botResponseText = `Não entendi: "${messageText}". No momento, estou apenas simulando uma resposta. Para integração precisaríamos de uma API!`;
        const botMessageDiv = document.createElement('div');
        botMessageDiv.classList.add('message', 'bot');
        botMessageDiv.innerHTML = `<p>${botResponseText}</p>`;
        chatMessages.appendChild(botMessageDiv);
    

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000); // Responde após 1 segundo
}

// Envpra enviar a respostinha"
sendBtn.addEventListener('click', sendMessage);

// clicar no botão
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});