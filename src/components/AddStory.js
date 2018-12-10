import React from "react";
import { StyleSheet, View } from "react-native";
import { FormLabel, FormInput, Button } from "react-native-elements";
import firebase from "../utils/firebaseClient";
import AppNavigator from "../navigation/AppNavigator";
import firestore from "../utils/firestore";
import "firebase/firestore";

export default class AddStory extends React.Component {
  static navigationOptions = {
    title: "AddStory",
    header: null
  };

  state = {
    location: "",
    story: "",
    type: "",
    img_url: "",
    date: ""
  };

  addStory() {
    const { location, story, type, img_url, date } = this.state;
    const db = firebase.firestore();
    db.collection("stories")
      .add({
        location: location,
        story: story,
        img_url: img_url,
        date: date
      })
      .then(() =>
        this.props.navigator.immediatelyResetStack(
          [AppNavigator.getRoute("Home")],
          0
        )
      )
      .catch(error => this.setState({ errorMessage: error.message }));
  }

  render() {
    return (
      <View style={styles.container}>
        <FormLabel>location</FormLabel>
        <FormInput
          onChangeText={location => this.setState({ location })}
          value={this.state.location}
        />
        <FormLabel>story</FormLabel>
        <FormInput
          onChangeText={story => this.setState({ story })}
          value={this.state.story}
        />
        <FormLabel>type</FormLabel>
        <FormInput
          onChangeText={type => this.setState({ type })}
          value={this.state.type}
        />
        <FormLabel>img_url</FormLabel>
        <FormInput
          onChangeText={img_url => this.setState({ img_url })}
          value={this.state.img_url}
        />
        <Button title="Submit" onPress={() => this.addStory()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
