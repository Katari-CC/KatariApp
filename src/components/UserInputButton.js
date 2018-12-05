import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export const UserInputButton = ({ onPress, children }) => {
  return (
    <TouchableOpacity style={style.button} onPress={onPress}>
      <Text style={style.text}>{children}</Text>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  button: {
    marginTop: 10,
    padding: 20,
    width: "100%",
    backgroundColor: "#00aeef",
    borderRadius: 4,
    alignItems: "center"
  },
  text: {
    color: "white",
    fontWeight: "700",
    fontSize: 18
  }
});
