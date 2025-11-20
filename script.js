document.addEventListener('DOMContentLoaded', async () => {
    // 1. Verifica se o usuário está logado
    const token = localStorage.getItem('jwt_token');

    if (!token) {
        // Se não tiver token, manda pro login
        window.location.href = 'login.html';
        return;
    }

    // 2. Busca os chamados na API
    try {
        const response = await fetch('http://localhost:5043/api/Chamados/meus', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401) {
            alert('Sessão expirada. Por favor, faça login novamente.');
            window.location.href = 'login.html';
            return;
        }

        const chamados = await response.json();
        
        renderizarChamados(chamados);

    } catch (error) {
        console.error('Erro ao carregar chamados:', error);
        const listContainer = document.querySelector('.ticket-list');
        listContainer.innerHTML = '<p style="padding:20px; text-align:center; color: red">Erro ao conectar com o servidor.</p>';
    }
});

function renderizarChamados(chamados) {
    const listContainer = document.querySelector('.ticket-list');
    
    listContainer.innerHTML = ''; 

    if (chamados.length === 0) {
        listContainer.innerHTML = '<p style="padding:20px; text-align:center; color: #666">Nenhum chamado encontrado.</p>';
        return;
    }

    chamados.forEach(chamado => {
        let statusText = 'Pendente';
        let statusClass = 'pendente';

        if (chamado.idStatus === 2) {
            statusText = 'Em Análise';
            statusClass = 'em-analise';
        } else if (chamado.idStatus === 3) {
            statusText = 'Finalizado';
            statusClass = 'finalizado';
        }

        // Cria o elemento LI
        const li = document.createElement('li');
        li.className = 'ticket';
        
        // Monta o HTML interno
        li.innerHTML = `
            <div class="ticket-info">
                <strong>${chamado.titulo}</strong>
                <p class="ticket-desc">${chamado.descricao || 'Sem descrição'}</p>
            </div>
            <span class="status ${statusClass}">${statusText}</span>
        `;

        listContainer.appendChild(li);
    });
}