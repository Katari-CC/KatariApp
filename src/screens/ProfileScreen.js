import React from "react";

import { ScrollView, View, Image, StyleSheet, ImagePicker } from "react-native";

import firebase from "../utils/firebaseClient";
import AppNavigator from "../navigation/AppNavigator";
import { FormLabel, FormInput, Text, Button } from "react-native-elements";
import "firebase/firestore";

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: "Profile",
    header: null
  };
  constructor(props) {
    super(props);
  }

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

  _uploadImage = (uri, mime = "image/jpeg", name) => {};

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text>user name</Text>
          <Image
            style={styles.avatar}
            resizeMode="cover"
            source={{
              uri:
                "https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg"
            }}
          />
          <Text>
            A bunch of random text to see if scrolling actually works. A bunch
            of random text to see if scrolling actually works. A bunch of random
            text to see if scrolling actually works.
          </Text>
          <Button
            buttonStyle={styles.size}
            title="Change the profile picture"
            onPress={this._uploadImage}
          />
          <Button
            buttonStyle={styles.size}
            title="Logout"
            onPress={this.logout}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  size: {
    backgroundColor: "rgba(92, 99,216, 1)",
    width: "100%",
    height: 50,
    borderWidth: 0,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10
  },
  avatar: {
    paddingVertical: 30,
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 75
  }
});
