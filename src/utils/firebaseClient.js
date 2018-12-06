import * as firebase from "firebase";
import { FIREBASE_KEY } from "react-native-dotenv";

const firebaseConfig = {
  apiKey: FIREBASE_KEY,
  authDomain: "storymapapp.firebaseapp.com",
  databaseURL: "https://storymapapp.firebaseio.com",
  projectId: "storymapapp",
  storageBucket: "storymapapp.appspot.com",
  messagingSenderId: "1090465648839"
};

const fbApp = firebase.initializeApp(firebaseConfig);

export default fbApp;
