import { initializeFirebase } from './auth.js';
import { updateProfile } from "firebase/auth"

const { auth } = initializeFirebase();

const displayNameForm = document.querySelector('#display-name-form');
displayNameForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const displayNameInput = document.querySelector('#display-name');
    console.log(displayNameInput.value);
    updateProfile(auth.currentUser, { displayName: displayNameInput.value })

    const displayNameBtn = document.querySelector('#save-display-name-btn');
    displayNameBtn.textContent = "Saved!";
    displayNameBtn.className = "btn btn-success";
    displayNameBtn.disabled = true;

    //redirect to home
    window.location.href = '/home';
});
