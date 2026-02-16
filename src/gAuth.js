import { browserLocalPersistence, getAuth, getRedirectResult, GoogleAuthProvider, signInWithPopup, signInWithRedirect, setPersistence } from "firebase/auth";
import { initializeFirebase, checkAuthState } from "./auth.js"

const { app, analytics, auth } = initializeFirebase();

auth.languageCode = 'it';

const provider = new GoogleAuthProvider();
//provider.setCustomParameters({
//  'login_hint': 'user@siena.edu'
//});

handleRedirect();

checkAuthState(auth, (user) => {
  console.log("AUTH STATE:", user);
});

const googleBtn = document.querySelector("#google-btn");
googleBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  //await setPersistence(auth, browserLocalPersistence);
  await signInWithPopup(auth, provider);
});

async function handleRedirect() {
  try {
    const result = await getRedirectResult(auth);

    if (result) {
      const user = result.user;
      const credential = provider.credentialFromResult(result);


      const token = credential.accessToken;

      console.log("User:", user);
      console.log("Token:", token);
    }
  } catch (err) {
    console.error(err);
  }
}