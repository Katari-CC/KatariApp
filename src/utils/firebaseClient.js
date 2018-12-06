import * as firebase from "firebase";
import { FIREBASE_KEY } from "react-native-dotenv";

const firebaseConfig = {
  apiKey: FIREBASE_KEY,
  authDomain: "storymapapp.firebaseapp.com"
};

const fbApp = firebase.initializeApp(firebaseConfig);

export default fbApp;
