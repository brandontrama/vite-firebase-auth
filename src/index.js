import { initializeFirebase, registerUser, loginUser, checkAuthState, sendEmailVerification, checkProfileOnboarding, sendPasswordResetEmail } from './auth.js';

const { app, analytics, auth } = initializeFirebase();

const registerForm = document.querySelector('#register-form');
const loginForm = document.querySelector('#login-form');
const emailVerification = document.querySelector('#email-verification');
const emailVerificationBtn = document.querySelector('#email-verification-btn');
const swapToLoginBtn = document.getElementById('swap-form');
const swapToRegisterBtn = document.getElementById('swap-form-login');
const resetPWBtn = document.getElementById('reset-password-btn');
// TEMPORARY UNTIL PROPER IMPLEMENTATION
resetPWBtn.disabled = true;

// Check if user is already logged in and verification email has been accepted
checkAuthState((user) => {
  if (user && !user.emailVerified) {
    // User is logged in but email is not verified
    console.log('User (' + user.email + ') is logged in but email is not verified');
    registerForm.style.display = 'none';
    swapToLoginBtn.style.display = 'none';        // Changed
    swapToRegisterBtn.style.display = 'none';
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

// Switch to login form
swapToLoginBtn.addEventListener('click', () => {
    registerForm.style.display = 'none';
    swapToLoginBtn.style.display = 'none';
    
    loginForm.style.display = 'block';
    swapToRegisterBtn.style.display = 'block';
    resetPWBtn.style.display = 'block';
});

// Switch to register form
swapToRegisterBtn.addEventListener('click', () => {
    loginForm.style.display = 'none';
    swapToRegisterBtn.style.display = 'none';
    resetPWBtn.style.display = 'none';
    
    registerForm.style.display = 'block';
    swapToLoginBtn.style.display = 'block';
});

resetPWBtn.addEventListener('click', async (e) => {
    e.preventDefault()

    const emailInput = document.querySelector('#email');
    const email = emailInput.value;

    try {
        await sendPasswordResetEmail(auth, email);
        alert('Password reset email sent!');
    } catch (error) {
        console.error('Error sending password reset email:', error);
        alert('Error sending password reset email. Please try again.');
    }
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
        swapToLoginBtn.style.display = 'none';        // Changed
        swapToRegisterBtn.style.display = 'none';
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

particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#ffffff' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 3,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true
        }
    },
    retina_detect: true
});

export { auth, app, analytics };