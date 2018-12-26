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
  FormLabel,
  Text,
  FormInput,
  FormValidationMessage,
  Button,
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
      .catch((error) => this.setState({ errorMessage: error.message }));
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
              // style={styles.avatar}
              resizeMode="center"
              source={require("../../assets/images/icon_white.png")}
            />
          </View>
          <FormLabel>Email</FormLabel>
          <FormInput
            containerStyle={styles.formInput}
            inputStyle={styles.inputContainer}
            underlineColorAndroid="transparent"
            keyboardType="email-address"
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email}
          />
          <FormValidationMessage>{"required"}</FormValidationMessage>
          <FormLabel>Password</FormLabel>
          <FormInput
            secureTextEntry
            containerStyle={styles.formInput}
            inputStyle={styles.inputContainer}
            underlineColorAndroid="transparent"
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
          />
          <FormValidationMessage>{"required"}</FormValidationMessage>
          <Text style={styles.space} />
          <Button
            buttonStyle={styles.button}
            title="Login"
            onPress={this.handleLogin}
          />
          <Text
            style={styles.link}
            onPress={() => this.props.navigation.navigate("SignUp")}
          >
            Don't have an account? Sign up here!
          </Text>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    // backgroundColor: "#df5e27",
    backgroundColor: "white",
    color: "#56b1bf",
  },
  space: {
    marginTop: 10,
    marginBottom: 10,
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
    marginTop: 10,
  },
  inputContainer: {
    marginLeft: 15,
    color: "#242124",
  },
  button: {
    backgroundColor: "#242124",
    width: "100%",
    height: 50,
    borderWidth: 0,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  imageContainer: {
    marginTop: 10,
    height: "25%",
    justifyContent: "center",
    alignItems: "center",
  },
});
