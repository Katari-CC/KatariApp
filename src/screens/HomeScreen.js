import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { MonoText } from "../components/StyledText";
import firebase from "firebase";
// import "firebase-admin";
import "firebase/firestore";

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Home",
    header: null
  };

  componentWillMount() {
    var config = {
      apiKey: "AIzaSyANM6fnXqlT2WBqzmEMKAocaP0tgX45sr4",
      authDomain: "storymapapp.firebaseapp.com",
      databaseURL: "https://storymapapp.firebaseio.com",
      projectId: "storymapapp",
      storageBucket: "storymapapp.appspot.com",
      messagingSenderId: "1090465648839"
    };
    firebase.initializeApp(config);
    // let db = firebase.firestore().settings({ timestampsInSnapshots: true });
    // let locations = db.collection("locations").doc("Acos");
    let firestore = firebase.firestore();
    let settings = { timestampsInSnapshots: true };
    firestore.settings(settings);
    firestore
      .collection("locations")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          console.log(doc.id, "=>", doc.data());
        });
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
    // console.log(firestore.collection("locations"));

    // console.log(locations);
    // const admin = require("firebase-admin");
    // var serviceAccount = require("../../storymapapp-firebase-adminsdk-jfatz-22b726c073.json");
    // admin.initializeApp({
    //   credential: admin.credential.cert(serviceAccount)
    // });
    // var db = admin.firestore();
  }

  render() {
    // console.log("HomeScreen Rendering!");
    // console.log(firebase.firestore().collection("locations"));
    return (
      <ScrollView style={styles.container}>
        <Text>We're gonna put wswlists of storieoihkkors/locations here.</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)"
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center"
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  }
});
