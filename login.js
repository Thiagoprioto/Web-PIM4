const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const signInForm = document.querySelector('.form-container.sign-in form');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

signInForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o envio do formulário HTML

    const email = signInForm.querySelector('input[type="email"]').value;
    const senha = signInForm.querySelector('input[type="password"]').value;

    try {
        const response = await fetch('http://localhost:5043/api/Auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, senha: senha })
        });

        if (!response.ok) {
            alert('Email ou senha inválidos!');
            return;
        }

        const data = await response.json();
        
        localStorage.setItem('jwt_token', data.token);
        
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao conectar ao servidor.');
    }
});
