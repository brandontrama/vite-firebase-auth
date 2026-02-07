import { initializeFirebase, logoutUser } from './auth.js';
import { onAuthStateChanged } from 'firebase/auth';

const { auth } = initializeFirebase();

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, display welcome message
        const welcomeText = document.getElementById('welcome-text');
        welcomeText.textContent = `Welcome back, ${user.email}!`;
    } else {
        // No user is signed in, redirect to login page
        window.location.href = '/index.html';
    }
});

const logoutButton = document.getElementById('logout-button');
logoutButton.addEventListener('click', () => {
    logoutUser(auth);
});