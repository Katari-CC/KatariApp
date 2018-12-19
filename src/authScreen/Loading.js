import React from "react";
import { View, Text, ActivityIndicator, StyleSheet, Image } from "react-native";
// import firebase from "react-native-firebase";

import firebase from "../utils/firebaseClient";

export default class Loading extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.props.navigation.navigate(user ? "Main" : "Start");
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <Text>Loading</Text>
        <ActivityIndicator size="large" /> */}
        <Image
          // style={styles.avatar}
          // resizeMode="cover"
          source={require("../../assets/images/splash.png")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D0D3C5",
    color: "#08708A",
    fontWeight: "bold",
    fontSize: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
