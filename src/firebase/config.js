import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

const firebaseConfig = {
    apiKey: "AIzaSyAOhB8wcK_uKI5ss1NcgSLOJrRK-fN4NVk",
    authDomain: "bookverse-5dc0c.firebaseapp.com",
    projectId: "bookverse-5dc0c",
    storageBucket: "bookverse-5dc0c.appspot.com",
    messagingSenderId: "894384771469",
    appId: "1:894384771469:web:ee6af03568bdd71d65adc4"
};

firebase.initializeApp(firebaseConfig)

const firestoreService = firebase.firestore()
const authService = firebase.auth()

export { authService, firestoreService }