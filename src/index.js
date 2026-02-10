import { initializeFirebase, registerUser, loginUser, checkAuthState, sendEmailVerification, checkProfileOnboarding } from './auth.js';

const { app, analytics, auth } = initializeFirebase();

const registerForm = document.querySelector('#register-form');
const loginForm = document.querySelector('#login-form');
const emailVerification = document.querySelector('#email-verification');
const emailVerificationBtn = document.querySelector('#email-verification-btn');
//const swapFormButton = document.getElementById('swap-form');
const swapToLoginBtn = document.getElementById('swap-form');
const swapToRegisterBtn = document.getElementById('swap-form-login');

// Check if user is already logged in and verification email has been accepted
checkAuthState((user) => {
  if (user && !user.emailVerified) {
    // User is logged in but email is not verified
    console.log('User (' + user.email + ') is logged in but email is not verified');
    registerForm.style.display = 'none';
    swapFormButton.style.display = 'none';
    emailVerification.style.display = 'block';
  } else if (user && user.emailVerified) {
    // User is logged in and email is verified
    console.log('User is logged in and email is verified');
    // Redirect to home
    checkProfileOnboarding((isComplete) => {
      if (isComplete === true) {
        window.location.href = '/home';
      } else if (isComplete === false) {
        window.location.href = '/onboarding';
      }
    });
  }
});

// swapFormButton.addEventListener('click', () => {
//     const registerForm = document.querySelector('#register-form');
//     const loginForm = document.querySelector('#login-form');
//     // Swap between login and register form
//     if (registerForm.style.display === 'none') {
//         registerForm.style.display = 'block';
//         loginForm.style.display = 'none';
//         swapFormButton.textContent = 'Already have an account? Login here!';
//     } else {
//         registerForm.style.display = 'none';
//         loginForm.style.display = 'block';
//         swapFormButton.textContent = "Don't have an account? Register here!";
//     }
// });

// Switch to login form
swapToLoginBtn.addEventListener('click', () => {
    registerForm.style.display = 'none';
    swapToLoginBtn.style.display = 'none';
    
    loginForm.style.display = 'block';
    swapToRegisterBtn.style.display = 'block';
});

// Switch to register form
swapToRegisterBtn.addEventListener('click', () => {
    loginForm.style.display = 'none';
    swapToRegisterBtn.style.display = 'none';
    
    registerForm.style.display = 'block';
    swapToLoginBtn.style.display = 'block';
});


registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = registerForm.querySelector('#email');
    const passwordInput = registerForm.querySelector('#password');
    const email = emailInput.value;
    const password = passwordInput.value;

    console.log('Email:', email);
    console.log('Password:', password);

    // Register user with Firebase Authentication

    if (registerUser(auth, email, password)) {
        // If registration is successful, show email verification section
        registerForm.style.display = 'none';
        swapFormButton.style.display = 'none';
        emailVerification.style.display = 'block';
    }

    // Clear form
    registerForm.reset();
});

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

emailVerificationBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const actionCodeSettings = {
        url: window.location.origin + '/home',
        handleCodeInApp: true
    }

    try {
        await sendEmailVerification(auth.currentUser, actionCodeSettings);
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
    emailVerificationBtn.textContent = "Sent!";
    emailVerificationBtn.className = "btn btn-success";
    emailVerificationBtn.disabled = true;
});

export { auth, app, analytics };