import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "@firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCa9oge7RcR3IAxP365hx1Kd5oHHmQZqo4",
  authDomain: "sal-fire.firebaseapp.com",
  projectId: "sal-fire",
  storageBucket: "sal-fire.appspot.com",
  messagingSenderId: "131150866049",
  appId: "1:131150866049:web:77bab77f6aa7031b494f80",
  measurementId: "G-X66YLD9M5B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const firestore = getFirestore(app)