import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseApp=firebase.initializeApp({
    apiKey: "api_key",//copy your api key here and other details
    authDomain: "instagram-clone-101.firebaseapp.com",
    projectId: "instagram-clone-101",
    storageBucket: "instagram-clone-101.appspot.com",
    messagingSenderId: "125846841100",
    appId: "1:125846841100:web:eaa2ed3ef6a1d271b10b29",
    measurementId: "G-VGNCZHCEPN"
});

const db=firebaseApp.firestore();
const auth=firebase.auth();
const storage=firebase.storage();

export { db, auth, storage };
