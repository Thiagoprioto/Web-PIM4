const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

// --- Lógica da Animação (Slider) ---
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// --- Lógica de Login (API) ---
// Seleciona o formulário de LOGIN (sign-in)
const loginForm = document.querySelector('.sign-in form');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede que a página recarregue sozinha

    // Pega os campos (assumindo que são o 1º e 2º input do form)
    const emailInput = loginForm.querySelector('input[type="email"]');
    const senhaInput = loginForm.querySelector('input[type="password"]');
    const btnEntrar = document.getElementById('btn-entrar');

    if (!emailInput || !senhaInput) return;

    const email = emailInput.value;
    const senha = senhaInput.value;

    // Feedback visual
    const textoOriginal = btnEntrar.innerText;
    btnEntrar.innerText = "Entrando...";
    btnEntrar.disabled = true;

    try {
        const response = await fetch('http://localhost:5043/api/Auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        if (response.ok) {
            const data = await response.json();

            // 1. Salva o Token
            localStorage.setItem('jwt_token', data.token);
            
            // 2. Salva o Perfil (Isso é crucial para o Dashboard funcionar!)
            // O backend deve retornar "Tecnico" ou "Colaborador" no campo perfil
            localStorage.setItem('user_profile', data.perfil);

            // 3. Redireciona
            window.location.href = 'index.html';
        } else {
            alert('Login falhou! Verifique e-mail e senha.');
            btnEntrar.innerText = textoOriginal;
            btnEntrar.disabled = false;
        }
    } catch (error) {
        console.error(error);
        alert('Erro ao conectar com o servidor.');
        btnEntrar.innerText = textoOriginal;
        btnEntrar.disabled = false;
    }
});