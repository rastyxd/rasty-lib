// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeUI } from "@firebase-oss/ui-core";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3qowrOUZ36J4We2LdCYl5Cik_OPVpx2Y",
  authDomain: "rasty-web.firebaseapp.com",
  projectId: "rasty-web",
  storageBucket: "rasty-web.firebasestorage.app",
  messagingSenderId: "319562515004",
  appId: "1:319562515004:web:37374d42ca19e1d1bbb939",
  measurementId: "G-DWDRNSPGEL",
};

const app = initializeApp({ ...firebaseConfig });
const auth = getAuth(app);
const ui = initializeUI({
  app,
});
export { ui, app };
