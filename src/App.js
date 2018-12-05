/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { Platform, StatusBar, StyleSheet, View, Text } from "react-native";
import { AppLoading, Asset, Font, Icon } from "expo";
import AppNavigator from "./navigation/AppNavigator";
import * as firebase from "firebase";
import UserInput from "./components/UserInput";
import UserInputButton from "./components/UserInputButton";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

type Props = {};
export default class App extends Component<Props> {
  state = {
    isLoadingComplete: false,
    email: "",
    password: "",
    isLoggedIn: true
  };

  componentWillMount() {
    const firebaseConfig = {
      apiKey: "AIzaSyANM6fnXqlT2WBqzmEMKAocaP0tgX45sr4",
      authDomain: "storymapapp.firebaseapp.com"
    };

    firebase.initializeApp(firebaseConfig);
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      if (this.state.isLoggedIn) {
        return (
          <View style={styles.container}>
            <AppNavigator />
          </View>
        );
      } else {
        return (
          <View style={styles.container}>
            {/* <UserInput
              placeholder="Enter your email"
              label="Email"
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
            />
            <UserInput
              placeholder="Enter your password"
              label="Password"
              secureTextEntry
              onChangeText={password => this.setState({ password })}
              value={this.state.password}
            />
            <UserInputButton
              onPress={() => {
                this.isLoggedIn = !this.isLoggedIn;
              }}
            >
              Log In
            </UserInputButton> */}
          </View>
        );
      }
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([require("../assets/images/icon.png")]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf")
      })
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
