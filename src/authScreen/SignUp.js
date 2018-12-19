import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import {
  Input,
  Text,
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button,
} from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import firebase from "../utils/firebaseClient";
import firestore from "../utils/firestore";
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes
// } from "react-native-google-signin";

let AVATAR_URL =
  "https://firebasestorage.googleapis.com/v0/b/storymapapp.appspot.com/o/avatar.png?alt=media&token=1f953209-d7c9-41ae-a46f-787fa25d579c";
export default class SignUp extends React.Component {
  state = {
    email: "",
    password: "",
    errorMessage: null,
    username: "",
    userInfo: null,
    isSigninInProgress: null,
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
    console.log("username:", username);
    try {
      // Create a new user with email & password
      const docRef = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((user) => {
          // Once Signup is successful
          console.log("Signup Successfull");
          // Get the current user object
          const currentUser = firebase.auth().currentUser;
          // then update the displayName
          currentUser
            .updateProfile({
              displayName: username,
            })
            .then(
              (user) => {
                // Once the user "displayName" is updated
                console.log("displayName:", username);
                // Create a new entry in the "users" table of the database
                firestore
                  .collection("users")
                  .doc()
                  .set({
                    displayName: username,
                    email: email,
                    uid: currentUser.uid,
                    photoURL: AVATAR_URL,
                    disabled: false,
                  });

                // Go to the homescreen of the app
                this.props.navigation.navigate("Main");
              },
              function(error) {
                // An error happened.
                console.log(error);
              }
            );
        });
      console.log("authenticated", docRef);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.errorMessage && (
          <Text style={{ color: "red" }}>{this.state.errorMessage}</Text>
        )}
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
          onChangeText={(username) => this.setState({ username })}
          value={this.state.username}
        />
        <FormLabel>Email</FormLabel>
        <FormInput
          style={styles.formInput}
          underlineColorAndroid="transparent"
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
        />
        <FormValidationMessage>{"required"}</FormValidationMessage>
        <FormLabel>Password</FormLabel>
        <FormInput
          secureTextEntry
          style={styles.formInput}
          underlineColorAndroid="transparent"
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
        />
        <FormValidationMessage>{"required"}</FormValidationMessage>
        <Text style={styles.space} />
        <Button
          buttonStyle={styles.button}
          title="Sign Up"
          onPress={this.handleSignUp}
        />
        <Text
          style={styles.link}
          onPress={() => this.props.navigation.navigate("Login")}
        >
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
    color: "#08708a",
  },
  gmailbutton: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  space: {
    marginTop: 10,
    marginBottom: 10,
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
    height: 50,
  },
  formInput: {
    backgroundColor: "white",
    width: "100%",
    height: 50,
    borderWidth: 0,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#56b1bf",
    width: "100%",
    height: 50,
    borderWidth: 0,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
});
