import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import {
  FormLabel,
  Text,
  FormInput,
  FormValidationMessage,
  Button
} from "react-native-elements";
import firebase from "../utils/firebaseClient";

export default class Login extends React.Component {
  state = { email: "", password: "", errorMessage: null };

  handleLogin = () => {
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => this.props.navigation.navigate("Main"))
      .catch(error => this.setState({ errorMessage: error.message }));
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.errorMessage && (
          <Text style={{ color: "red" }}>{this.state.errorMessage}</Text>
        )}

        <FormLabel>Email</FormLabel>
        <FormInput
          style={styles.size}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <FormValidationMessage>{"required"}</FormValidationMessage>
        <FormLabel>Password</FormLabel>
        <FormInput
          secureTextEntry
          style={styles.size}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <FormValidationMessage>{"required"}</FormValidationMessage>
        <Text style={styles.space} />
        <Button
          buttonStyle={styles.size}
          title="Login"
          onPress={this.handleLogin}
        />
        <Text
          style={styles.link}
          onPress={() => this.props.navigation.navigate("SignUp")}
        >
          Create a new account from here!
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
