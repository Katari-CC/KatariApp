import React from "react";
import { StyleSheet, TextInput, View, Image, Alert } from "react-native";
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

export default class Start extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.avatar}
            resizeMode="center"
            source={require("../../assets/images/icon_white.png")}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            buttonStyle={styles.button}
            containerStyle={{ textAlign: "center" }}
            title="Login"
            onPress={() => this.props.navigation.navigate("Login")}
          />
          <Text style={styles.text}>OR</Text>
          <Button
            buttonStyle={styles.button}
            title="Sign Up"
            onPress={() => this.props.navigation.navigate("SignUp")}
          />
        </View>
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
    paddingBottom: 55,
  },
  avatar: {
    marginBottom: 135,
  },
  inputContainer: {
    marginLeft: 15,
    color: "#242124",
  },
  buttonContainer: {
    justifyContent: "center",
    //   alignItems: "center",
  },
  text: {
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    // backgroundColor: "#df5e27",
    backgroundColor: "#242124",
    width: "100%",
    height: 50,
    borderWidth: 0,
    borderRadius: 5,
    // marginTop: 10,
    // marginBottom: 10,
    // justifyContent: "center"
    // textAlign: "center"
  },
  imageContainer: {
    marginTop: 10,
    height: "25%",
    justifyContent: "center",
    alignItems: "center",
  },
});
