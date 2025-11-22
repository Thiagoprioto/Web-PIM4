document.addEventListener('DOMContentLoaded', async () => {
    // 1. Pega o ID da URL
    const params = new URLSearchParams(window.location.search);
    const idChamado = params.get('id');
    const token = localStorage.getItem('jwt_token');

    if (!idChamado || !token) {
        alert('Chamado inválido ou usuário não logado.');
        window.location.href = 'index.html';
        return;
    }

    // 2. Busca Detalhes do Chamado
    try {
        const response = await fetch(`http://localhost:5043/api/Chamados/${idChamado}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const chamado = await response.json();
            preencherDetalhes(chamado);
        } else {
            document.getElementById('detalhe-titulo').innerText = "Erro ao carregar chamado (404)";
            console.error("Erro ao buscar chamado:", response.status);
        }
    } catch (error) {
        console.error("Erro de conexão ao buscar detalhes:", error);
        document.getElementById('detalhe-titulo').innerText = "Erro de Conexão";
    }

    // 3. Busca Histórico (Interações)
    carregarHistorico(idChamado, token);

    // 4. Configura o formulário de resposta
    const formResposta = document.getElementById('form-resposta');
    if (formResposta) {
        formResposta.addEventListener('submit', async (e) => {
            e.preventDefault();
            const mensagem = document.getElementById('texto-resposta').value;
            if (!mensagem) return;

            try {
                const resp = await fetch('http://localhost:5043/api/Interacao', {
                    method: 'POST',
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        idChamado: parseInt(idChamado), 
                        mensagem: mensagem 
                    })
                });

                if (resp.ok) {
                    document.getElementById('texto-resposta').value = '';
                    carregarHistorico(idChamado, token);
                } else {
                    const erro = await resp.text();
                    alert('Erro ao enviar resposta: ' + erro);
                }
            } catch (err) {
                console.error("Erro ao enviar resposta:", err);
                alert('Erro de conexão ao enviar resposta.');
            }
        });
    }
});

function preencherDetalhes(chamado) {
    document.getElementById('detalhe-titulo').innerText = chamado.titulo || 'Sem título';
    document.getElementById('detalhe-descricao').innerText = chamado.descricao || 'Sem descrição disponível.';
    const dataFormatada = chamado.dataAbertura ? new Date(chamado.dataAbertura).toLocaleDateString() : '-';
    document.getElementById('detalhe-data').innerText = dataFormatada;
    
    document.getElementById('detalhe-prioridade').innerText = chamado.prioridade || 'Normal';
    document.getElementById('detalhe-solicitante').innerText = "ID " + (chamado.idUsuarioSolicitante || '?'); 

    const statusMap = { 1: 'Pendente', 2: 'Em Análise', 3: 'Finalizado' };
    const statusClassMap = { 1: 'pendente', 2: 'em-analise', 3: 'finalizado' };
    
    const statusEl = document.getElementById('detalhe-status');
    const statusTexto = statusMap[chamado.idStatus] || 'Desconhecido';
    const statusClasse = statusClassMap[chamado.idStatus] || '';
    
    statusEl.innerText = statusTexto;
    statusEl.className = 'status'; 
    if (statusClasse) statusEl.classList.add(statusClasse);

    const catMap = { 1: 'Hardware', 2: 'Software', 3: 'Rede', 4: 'VPN', 5: 'Impressora', 6: 'Outro' };
    document.getElementById('detalhe-categoria').innerText = catMap[chamado.idCategoria] || 'Geral';
}

async function carregarHistorico(id, token) {
    const listaDiv = document.getElementById('historico-lista');
    
    try {
        const response = await fetch(`http://localhost:5043/api/Interacao/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const interacoes = await response.json();
            listaDiv.innerHTML = ''; // Limpa o "Carregando..."

            if (interacoes.length === 0) {
                listaDiv.innerHTML = '<p style="color:#888; font-style:italic">Nenhuma interação ainda.</p>';
                return;
            }

            interacoes.forEach(msg => {
                const div = document.createElement('div');
                div.className = 'history-item';
                
                // Formata data/hora
                const dataMsg = new Date(msg.dataInteracao).toLocaleString();
                
                div.innerHTML = `
                    <p class="history-meta"><strong>Usuário (ID ${msg.idAutor})</strong> comentou em ${dataMsg}</p>
                    <p class="history-comment">"${msg.mensagem}"</p>
                `;
                listaDiv.appendChild(div);
            });
        } else {
            console.warn("Status ao buscar histórico:", response.status);
            // Se der 404, pode ser que não tenha interações ou rota errada.
            // Vamos assumir que é "sem interações" para não assustar o usuário,
            // mas logamos o erro no console para debug.
            listaDiv.innerHTML = '<p style="color:#888">Histórico indisponível ou vazio.</p>';
        }
    } catch (err) {
        console.error("Erro ao carregar histórico", err);
        listaDiv.innerHTML = '<p style="color:red">Erro de conexão ao carregar histórico.</p>';
    }
}