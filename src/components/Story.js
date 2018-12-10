import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FormLabel, FormInput, Button } from "react-native-elements";

export default class Story extends React.Component {
  render() {
    return (
      <View key={this.props.keyval} style={styles.story}>
        <Text style={styles.storyText}>{this.props.val.date}</Text>
        <Text style={styles.storyText}>{this.props.val.story}</Text>
        <TouchableOpacity
          onPress={this.props.deleteMethod}
          style={styles.storyDelete}
        >
          <Text style={styles.storyDeleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  story: {
    position: "relative",
    padding: 20,
    paddingRight: 100,
    borderBottomWidth: 2,
    borderBottomColor: "#ededed"
  },
  storyText: {
    paddingLeft: 20,
    borderLeftWidth: 10,
    borderLeftColor: "#E91E63"
  },
  storyDelete: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fc4a1a",
    padding: 10,
    top: 10,
    bottom: 10,
    right: 20
  },
  storyDeleteText: {
    color: "#efefef"
  }
});
