// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";

function initializeFirebase() {
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);

    // Authentication
    const auth = getAuth(app);
    return { app, analytics, auth };
}

function registerUser(auth, email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log('User registered:', user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode === 'auth/weak-password') {
                console.error('The password is too weak.');
                alert('The password is too weak. Please choose a stronger password.');
            } else if (errorCode === 'auth/email-already-in-use') {
                console.error('The email address is already in use by another account.');
                alert('The email address is already in use by another account. Please use a different email address.');
            } else {
                console.error('Error registering user:', error);
            }
        });
}

function loginUser(auth, email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log('User logged in:', user);
        })
        .catch((error) => {
            // IMPLEMENT WARNING BOX INSTEAD OF ALERTS !!!!!!!!!!!!!!!!
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                console.error('Incorrect password.');
                alert('Incorrect password. Please try again.');
            } else if (errorCode === 'auth/user-not-found') {
                console.error('No user found with this email.');
                alert('No user found with this email. Please check your email address or register for a new account.');
            } else {
                console.error('Error logging in:', error);
            }
        });
}

// Listen for auth state changes
function checkAuthState(callback) {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user);
    } else {
      console.log('No user logged in');
      callback(null);
    }
  });
}

function checkProfileOnboarding(callback) {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user && user.emailVerified) {
            if (user.displayName == null) {
                callback(false); // User has not completed onboarding
            } else {
                callback(true); // User has completed onboarding
            }
        } else {
            callback(null); // User is not verified or not logged in
        }
    });
}

function logoutUser(auth) {
    auth.signOut().then(() => {
        console.log('User logged out');
    }).catch((error) => {
        console.error('Error logging out:', error);
    });
}

export { initializeFirebase, registerUser, loginUser, checkAuthState, sendEmailVerification, logoutUser, checkProfileOnboarding, sendPasswordResetEmail };