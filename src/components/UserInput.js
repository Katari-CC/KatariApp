import React from "react";
import { View, StyleSheet, Text, TextInput, Button } from "react-native";
import { FormLabel, FormInput } from "react-native-elements";

export const UserInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry
}) => {
  onLoginPress = () => {
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
  };

  onSignUpPress = () => {
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
  };

  renderButtonOrLoading = () => {
    if (this.state.loading) {
      return <Text>Loading</Text>;
    }
    return (
      <View>
        <Button onPress={this.onLoginPress}>Login</Button>
        <Button onPress={this.onSignUpPress}>Sign Up</Button>
      </View>
    );
  };

  return (
    <View style={style.container}>
      <FormLabel>{label}</FormLabel>
      <FormInput
        autoCorrect={false}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        value={value}
      />
      {this.renderButtonOrLoading}
    </View>
  );
};

// render() {
//   return (
//     <View>
//       <FormLabel>Email</FormLabel>
//       <FormInput onChangeText={email => this.state({ email })} />
//       <FormLabel>Password</FormLabel>
//       <FormInput onChangeText={password => this.state({ password })} />
//       {this.renderButtonOrLoading}
//     </View>
//   );
// }

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
