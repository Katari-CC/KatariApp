import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import firebase from "../utils/firebaseClient";
import AppNavigator from "../navigation/AppNavigator";
import { Text, Button } from "react-native-elements";
export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: "Profile",
    header: null
  };

  logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() =>
        this.props.navigator.immediatelyResetStack(
          [AppNavigator.getRoute("Login")],
          0
        )
      )
      .catch(err => console.log("logout error", err));
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>
          A bunch of random text to see if scrolling actually works. A bunch of
          random text to see if scrolling actually works.
        </Text>
        <Button
          buttonStyle={styles.size}
          title="Logout"
          onPress={this.logout}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    justifyContent: "center"
  },
  size: {
    backgroundColor: "rgba(92, 99,216, 1)",
    width: "100%",
    height: 50,
    borderWidth: 0,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10
  }
});
