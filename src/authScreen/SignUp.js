import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import {
  Input,
  Text,
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button
} from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import firebase from "../utils/firebaseClient";
import firestore from "../utils/firestore";
import "firebase/firestore";

export default class SignUp extends React.Component {
  state = { email: "", password: "", errorMessage: null, username: "" };

  handleSignUp = () => {
    const { email, password, username } = this.state;

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(docRef => console.log("auth success!", docRef))
      .catch(error => this.setState({ errorMessage: error.message }));

    const db = firebase.firestore();

    db.collection("users")
      .add({
        username: username,
        email: email,
        photoURL: "",
        disabled: false
      })
      .then(user => this.props.navigation.navigate("Main"))
      .catch(error => this.setState({ errorMessage: error.message }));
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.errorMessage && (
          <Text style={{ color: "red" }}>{this.state.errorMessage}</Text>
        )}
        <FormLabel>Username</FormLabel>
        <FormInput
          style={styles.size}
          underlineColorAndroid="transparent"
          onChangeText={username => this.setState({ username })}
          value={this.state.username}
        />
        <FormLabel>Email</FormLabel>
        <FormInput
          style={styles.size}
          underlineColorAndroid="transparent"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <FormValidationMessage>{"required"}</FormValidationMessage>
        <FormLabel>Password</FormLabel>
        <FormInput
          secureTextEntry
          style={styles.size}
          underlineColorAndroid="transparent"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <FormValidationMessage>{"required"}</FormValidationMessage>
        <Text style={styles.space} />
        <Button
          buttonStyle={styles.size}
          title="Sign Up"
          onPress={this.handleSignUp}
        />
        <Text
          style={styles.link}
          onPress={() => this.props.navigation.navigate("Login")}
        >
          Has an account? Login from here!
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    justifyContent: "center"
  },
  space: {
    marginTop: 10,
    marginBottom: 10
  },
  link: {
    marginLeft: 25,
    color: "grey",
    fontWeight: "bold",
    fontSize: 18,
    textShadowColor: "pink",
    textDecorationLine: "underline",
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
    height: 50
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
