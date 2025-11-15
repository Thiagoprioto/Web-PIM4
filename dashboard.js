document.addEventListener('DOMContentLoaded', () => {
    // Gráfico 1: Chamados por Status (Rosca/Doughnut)
    const statusCtx = document.getElementById('statusChart').getContext('2d');
    new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: ['Finalizado', 'Em Análise', 'Pendente'],
            datasets: [{
                label: 'Chamados',
                data: [12, 5, 3], // Dados de exemplo
                backgroundColor: [
                    '#2ecc71', // Verde (Finalizado)
                    '#e67e22', // Laranja (Em Análise)
                    '#95a5a6'  // Cinza (Pendente)
                ],
                borderColor: '#fff',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });

    // Gráfico 2: Chamados por Categoria (Barras)
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    new Chart(categoryCtx, {
        type: 'bar',
        data: {
            labels: ['Software', 'Hardware', 'Rede', 'Impressora', 'VPN'],
            datasets: [{
                label: 'Nº de Chamados',
                data: [15, 8, 10, 4, 6], // Dados de exemplo
                backgroundColor: 'rgba(118, 77, 252, 0.7)', // Roxo do seu tema
                borderColor: 'rgba(118, 77, 252, 1)',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});