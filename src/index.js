import { initializeFirebase, registerUser, loginUser, checkAuthState } from './auth.js';

const { app, analytics, auth } = initializeFirebase();

// Check if user is already logged in
checkAuthState((user) => {
  if (user) {
    // User is logged in, redirect to home
    window.location.href = '/home.html';
  }
});

const swapFormButton = document.getElementById('swap-form');
swapFormButton.addEventListener('click', () => {
    const registerForm = document.querySelector('#register-form');
    const loginForm = document.querySelector('#login-form');
    // Swap between login and register form
    if (registerForm.style.display === 'none') {
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
        swapFormButton.textContent = 'Already have an account? Login here!';
    } else {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        swapFormButton.textContent = "Don't have an account? Register here!";
    }
});

// print registered user info to console
const registerForm = document.querySelector('#register-form');
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = registerForm.querySelector('#email');
    const passwordInput = registerForm.querySelector('#password');
    const email = emailInput.value;
    const password = passwordInput.value;

    console.log('Email:', email);
    console.log('Password:', password);

    // Register user with Firebase Authentication
    registerUser(auth, email, password);

    // Clear form
    registerForm.reset();
});
// print logged in user info to console
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = loginForm.querySelector('#email');
    const passwordInput = loginForm.querySelector('#password');
    const email = emailInput.value;
    const password = passwordInput.value;

    console.log('Email:', email);
    console.log('Password:', password);

    // Login user with Firebase Authentication
    loginUser(auth, email, password);

    // Clear form
    loginForm.reset();
});

export { auth, app, analytics };