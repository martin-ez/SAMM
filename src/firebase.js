import * as firebase from "firebase/app";
import 'firebase/firestore';
import FirebaseConfig from './private/firebaseConfig.js';

// Initialize firebase SDK
firebase.initializeApp(FirebaseConfig);

export default firebase;
