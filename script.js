document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('jwt_token');
    const perfil = localStorage.getItem('user_profile'); 

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const listContainer = document.querySelector('.ticket-list');
    
    if (listContainer) {
        try {
            // --- LÓGICA INTELIGENTE DE ROTA ---
            let urlEndpoint = '';
            
            // Se for Técnico, vê TUDO. Se for Colaborador, vê só os DELE.
            if (perfil === 'Tecnico') {
                urlEndpoint = 'http://localhost:5043/api/Chamados/todos';
            } else {
                urlEndpoint = 'http://localhost:5043/api/Chamados/meus';
            }
            // ----------------------------------

            const response = await fetch(urlEndpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401 || response.status === 403) {
                alert('Sessão expirada ou sem permissão. Faça login novamente.');
                window.location.href = 'login.html';
                return;
            }

            const chamados = await response.json();
            renderizarChamados(chamados, listContainer);

        } catch (error) {
            console.error('Erro ao buscar chamados:', error);
            listContainer.innerHTML = '<p style="padding:20px; text-align:center; color: red">Erro ao conectar com o servidor.</p>';
        }
    }

    // ==========================================================
    // LÓGICA DA PÁGINA "NOVO CHAMADO" (Criar)
    // ==========================================================
    const formNovoChamado = document.querySelector('form');

    if (formNovoChamado) {
        formNovoChamado.addEventListener('submit', async (e) => {
            e.preventDefault(); // Impede o erro 405 (Tela Preta)

            const titulo = document.getElementById('titulo').value;
            const descricao = document.getElementById('descricao').value;
            const categoriaId = document.getElementById('categoria').value; 
            
            // --- ADIÇÃO IMPORTANTE: Pega o valor da Prioridade ---
            const prioridadeSelecionada = document.getElementById('prioridade').value;

            const botao = document.querySelector('.new-ticket-btn');
            botao.textContent = "Enviando...";
            botao.disabled = true;

            try {
                const response = await fetch('http://localhost:5043/api/Chamados', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        titulo: titulo,
                        descricao: descricao,
                        idCategoria: parseInt(categoriaId),
                        // --- Envia a prioridade escolhida (texto) ---
                        prioridade: prioridadeSelecionada 
                    })
                });

                if (response.ok) {
                    alert('Chamado aberto com sucesso!');
                    window.location.href = 'index.html';
                } else {
                    alert('Erro ao abrir chamado. Verifique os dados.');
                    botao.textContent = "Enviar Chamado";
                    botao.disabled = false;
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro de conexão com o servidor.');
                botao.textContent = "Enviar Chamado";
                botao.disabled = false;
            }
        });
    }
});

// Função auxiliar de renderização
function renderizarChamados(chamados, container) {
    container.innerHTML = ''; 

    if (chamados.length === 0) {
        container.innerHTML = '<p style="padding:20px; text-align:center; color: #666">Nenhum chamado encontrado.</p>';
        return;
    }

    chamados.forEach(chamado => {
        let statusText = 'Pendente';
        let statusClass = 'pendente';

        if (chamado.idStatus === 2) { statusText = 'Em Análise'; statusClass = 'em-analise'; } 
        else if (chamado.idStatus === 3) { statusText = 'Finalizado'; statusClass = 'finalizado'; }

        const li = document.createElement('li');
        li.className = 'ticket';
        li.style.cursor = 'pointer';
        
        // Redireciona para detalhes ao clicar
        li.addEventListener('click', () => {
            window.location.href = `detalhes.html?id=${chamado.idChamado}`;
        });

        li.innerHTML = `
            <div class="ticket-info">
                <strong>${chamado.titulo}</strong>
                <p class="ticket-desc">${chamado.descricao || 'Sem descrição'}</p>
            </div>
            <span class="status ${statusClass}">${statusText}</span>
        `;
        container.appendChild(li);
    });
}