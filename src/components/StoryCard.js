import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import React from "react";
import { Card, Avatar, Divider } from "react-native-elements";

import { createStackNavigator, NavigationActions } from "react-navigation";

import Story from "../screens/Story";

import firestore from "../utils/firestore";
import firebase from "../utils/firebaseClient";

class StoryCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      story: props.story,
      user: null,
    };
  }

  componentWillMount() {
    console.log("STORY", this.state.story);
    firestore
      .collection("users")
      .where("uid", "==", this.state.story.userID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            user: doc.data(),
          });
        });
      })
      .catch((err) => {
        console.log("Error getting documents", err);
      });
  }

  onStoryPress = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "Story",
      params: {
        title: this.state.story.title,
        story: this.state.story.story,
        username: this.state.user.displayName,
        avatar: this.state.user.photoURL,
        image: this.state.story.photoURL,
      },
    });
    this.props.navigation.dispatch(navigateAction);
  };

  render() {
    console.log("Rendering StoryCard...");

    if (this.state.user) {
      return (
        <Card containerStyle={styles.storyCard}>
          <TouchableOpacity
            style={styles.storyCard}
            onPress={() => this.onStoryPress()}
          >
            <View style={styles.userTitle}>
              <Avatar
                rounded
                containerStyle={styles.avatar}
                source={{ uri: this.state.user.photoURL }}
              />
              <Text adjustsFontSizeToFit style={styles.username}>
                {this.state.user.displayName}
              </Text>
            </View>
            <View>
              <Divider
                style={{
                  position: "absolute",
                  top: "50%",
                  zIndex: 3,
                }}
              />
            </View>
            <View>
              <Text adjustsFontSizeToFit style={styles.description}>
                {this.state.story.title}
              </Text>
            </View>
          </TouchableOpacity>
        </Card>
      );
    }
    return <View />;
  }
}

var styles = StyleSheet.create({
  storyCard: {
    // flexDirection: "column",
    width: 150,
    height: 130,
    borderRadius: 20,
    alignItems: "center",
  },
  userTitle: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "nowrap",
  },

  username: {
    marginLeft: 5,
    textAlign: "center",
    marginBottom: 25,
    fontWeight: "bold",
  },
  description: {
    textAlign: "center",
    // paddingLeft: 10,
  },
  avatar: {
    // borderWidth: 1,
    // borderColor: "black",
    // borderRadius: 100,
    // marginRight: 5,
    marginBottom: 20,
  },
});

export default StoryCard;
