import React from "react";
import { View, StyleSheet, Text, TextInput, Button } from "react-native";
import MainTabNavigator from "../navigation/MainTabNavigator";
import { StackNavigator } from "react-navigation";
import * as firebase from "firebase";
import {
  FormLabel,
  FormInput,
  FormValidationMessage
} from "react-native-elements";

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "", error: "", loading: false };
  }

  onLoginPress() {
    this.state({ error: "", loading: true });

    const { email, password } = this.state;
    firebase
      .auth()
      .signInAndRetrieveDataWithEmailAndPassword(email, password)
      .then(() => {
        this.state({ error: "", loading: false });
        this.props.navigation.navigate("Main");
      })
      .catch(() => {
        this.state({ error: "Auth failed!", loading: false });
      });
  }

  onSignUpPress() {
    this.state({ error: "", loading: true });

    const { email, password } = this.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.state({ error: "", loading: false });
        this.props.navigation.navigate("Main");
      })
      .catch(() => {
        this.state({ error: "Auth failed!", loading: false });
      });
  }

  renderButtonOrLoading() {
    if (this.state.loading) {
      return <Text>Loading</Text>;
    }
    return;
    <View>
      <Button onPress={this.onLoginPress.bind(this)}>Login</Button>
      <Button onPress={this.onSignUpPress.bind(this)}>Sign Up</Button>
    </View>;
  }

  render() {
    return (
      <View>
        <FormLabel>Email</FormLabel>
        <FormInput onChangeText={email => this.state({ email })} />
        <FormLabel>Password</FormLabel>
        <FormInput onChangeText={password => this.state({ password })} />
        {this.renderButtonOrLoading}
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    marginTop: 10,
    width: "100%",
    borderColor: "#eee",
    borderBottomWidth: 2
  },
  label: {
    padding: 5,
    paddingBottom: 0,
    color: "#333",
    fontSize: 17,
    fontWeight: "700",
    width: "100%"
  },
  input: {
    paddingRight: 5,
    paddingLeft: 5,
    paddingBottom: 2,
    color: "#333",
    fontSize: 18,
    fontWeight: "700",
    width: "100%"
  }
});
