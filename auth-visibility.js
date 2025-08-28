document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const userMenuContainer = document.getElementById('userMenuContainer');
    const cartIcon = document.getElementById('cartIcon');
    const logoutBtn = document.getElementById('logoutBtn');

    // Función para actualizar la visibilidad de los elementos
    const updateAuthUI = () => {
        const userIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

        if (userIsLoggedIn) {
            loginLink.style.display = 'none';
            registerLink.style.display = 'none';
            userMenuContainer.style.display = 'block';
            cartIcon.style.display = 'block';
        } else {
            loginLink.style.display = 'block';
            registerLink.style.display = 'block';
            userMenuContainer.style.display = 'none';
            cartIcon.style.display = 'none';
        }
    };

    // Lógica para simular el inicio y cierre de sesión
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            // Esto es solo un ejemplo. En un sitio real, tendrías un sistema de autenticación.
            localStorage.setItem('isLoggedIn', 'true');
            updateAuthUI();
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('isLoggedIn', 'false');
            updateAuthUI();
        });
    }
    
    // Llamar a la función al cargar la página para establecer el estado inicial
    updateAuthUI();
});