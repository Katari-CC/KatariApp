import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Input, Text, FormLabel, FormInput, FormValidationMessage, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import firebase from "../utils/firebaseClient";
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes
// } from "react-native-google-signin";

export default class SignUp extends React.Component {
  state = {
    email: "",
    password: "",
    errorMessage: null,
    username: "",
    userInfo: null,
    isSigninInProgress: null
  };

  _gsignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({ userInfo });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  handleSignUp = async () => {
    const { email, password, username } = this.state;
    try {
      const docRef = await firebase.auth().createUserWithEmailAndPassword(email, password);
      console.log("authenticated", docRef);

      const db = firebase.firestore();

      const user = await db.collection("users").add({
        displayName: username,
        email: email,
        photoURL: "",
        disabled: false
      });
      this.props.navigation.navigate("Main");
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.errorMessage && <Text style={{ color: "red" }}>{this.state.errorMessage}</Text>}
        {/* <GoogleSigninButton
          style={{ width: 48, height: 48 }}
          size={GoogleSigninButton.Size.Icon}
          color={GoogleSigninButton.Color.Dark}
          onPress={this._gsignIn}
          disabled={this.state.isSigninInProgress}
        /> */}
        <FormLabel>Username</FormLabel>
        <FormInput
          style={styles.formInput}
          underlineColorAndroid="transparent"
          onChangeText={username => this.setState({ username })}
          value={this.state.username}
        />
        <FormLabel>Email</FormLabel>
        <FormInput
          style={styles.formInput}
          underlineColorAndroid="transparent"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <FormValidationMessage>{"required"}</FormValidationMessage>
        <FormLabel>Password</FormLabel>
        <FormInput
          secureTextEntry
          style={styles.formInput}
          underlineColorAndroid="transparent"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <FormValidationMessage>{"required"}</FormValidationMessage>
        <Text style={styles.space} />
        <Button buttonStyle={styles.button} title="Sign Up" onPress={this.handleSignUp} />
        <Text style={styles.link} onPress={() => this.props.navigation.navigate("Login")}>
          Already have an account? Login here!
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    justifyContent: "center",
    backgroundColor: "#d0d3c5",
    color: "#08708a"
  },
  gmailbutton: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  space: {
    marginTop: 10,
    marginBottom: 10
  },
  link: {
    marginLeft: 25,
    color: "#d73a31",
    fontWeight: "bold",
    fontSize: 18,
    textShadowColor: "pink",
    textDecorationLine: "underline",
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
    height: 50
  },
  formInput: {
    backgroundColor: "white",
    width: "100%",
    height: 50,
    borderWidth: 0,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10
  },
  button: {
    backgroundColor: "#56b1bf",
    width: "100%",
    height: 50,
    borderWidth: 0,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10
  }
});
