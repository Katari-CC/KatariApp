import firebase from "../utils/firebaseClient";
import "firebase/firestore";

let firestore = firebase.firestore();
let settings = { timestampsInSnapshots: true };
firestore.settings(settings);

export default firestore;
