import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Image,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
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

let AVATAR_URL =
  "https://firebasestorage.googleapis.com/v0/b/storymapapp.appspot.com/o/avatar.png?alt=media&token=1f953209-d7c9-41ae-a46f-787fa25d579c";

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
          console.log("Signup Successful");
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
                  .doc(currentUser.uid)
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
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          enabled
        >
          {this.state.errorMessage &&
            //   <Text style={{ color: "red", textAlign: "center" }}>{this.state.errorMessage}</Text>
            Alert.alert("Error filling out form.", this.state.errorMessage, [
              {
                text: "OK",
                onPress: () => this.setState({ errorMessage: null }),
              },
            ])}
          <View style={styles.imageContainer}>
            <Image
              style={styles.avatar}
              resizeMode="center"
              source={require("../../assets/images/icon_white.png")}
            />
          </View>
          {/* <GoogleSigninButton
          style={{ width: 48, height: 48 }}
          size={GoogleSigninButton.Size.Icon}
          color={GoogleSigninButton.Color.Dark}
          onPress={this._gsignIn}
          disabled={this.state.isSigninInProgress}
        /> */}
          <FormLabel>Username</FormLabel>
          <FormInput
            containerStyle={styles.formInput}
            underlineColorAndroid="transparent"
            onChangeText={(username) => this.setState({ username })}
            value={this.state.username}
          />
          <FormValidationMessage style={{ marginBottom: 0, marginTop: 0 }}>
            {"required"}
          </FormValidationMessage>

          <FormLabel>Email</FormLabel>
          <FormInput
            containerStyle={styles.formInput}
            inputStyle={styles.inputContainer}
            underlineColorAndroid="transparent"
            keyboardType="email-address"
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email}
          />
          <FormValidationMessage style={{ marginBottom: 0, marginTop: 0 }}>
            {"required"}
          </FormValidationMessage>
          <FormLabel>Password</FormLabel>
          <FormInput
            secureTextEntry
            containerStyle={styles.formInput}
            inputStyle={styles.inputContainer}
            underlineColorAndroid="transparent"
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
          />
          <FormValidationMessage style={{ marginBottom: 0 }}>
            {"required"}
          </FormValidationMessage>
          {/* <Text style={styles.space} /> */}
          <Button
            buttonStyle={styles.button}
            title="Sign Up"
            onPress={this.handleSignUp}
          />
          <Text
            style={styles.link}
            onPress={() => this.props.navigation.navigate("Login")}
          >
            Already have an account? Log in here!
          </Text>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    // paddingTop: 20,
    justifyContent: "center",
    // backgroundColor: "#df5e27",
    backgroundColor: "white",
    color: "#56b1bf",
  },
  avatar: {
    marginTop: 35,
  },
  space: {
    // marginTop: 10,
    // marginBottom: 10
  },
  link: {
    textAlign: "center",
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
    borderColor: "#242124",
    borderWidth: 5,
    borderRadius: 5,
    // marginTop: 10,
  },
  inputContainer: {
    marginLeft: 15,
    color: "#242124",
  },
  button: {
    // backgroundColor: "#df5e27",
    backgroundColor: "#242124",
    width: "100%",
    height: 50,
    borderWidth: 0,
    borderRadius: 5,
    // marginTop: 10,
    marginBottom: 10,
  },
  imageContainer: {
    marginTop: 10,
    height: "25%",
    justifyContent: "center",
    alignItems: "center",
  },
});
