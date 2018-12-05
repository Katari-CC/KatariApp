import React from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";

export const UserInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry
}) => {
  return (
    <View style={style.container}>
      <Text style={style.label}>{label}</Text>
      <TextInput
        autoCorrect={false}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={styles.input}
        secureTextEntry={secureTextEntry}
        value={value}
      />
    </View>
  );
};

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