import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import React from "react";
import { Card, Avatar, Divider, Icon } from "react-native-elements";

import { createStackNavigator, NavigationActions } from "react-navigation";

import Story from "../screens/Story";

import firestore from "../utils/firestore";
import firebase from "../utils/firebaseClient";

class StoryCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prevRoute: props.prevRoute,
      story: props.story,
      allowEdit: props.allowEdit,
      user: null,
      toggleDelete: false,
    };
  }

  componentWillMount() {
    console.log("STORY", this.state.story);
    firestore
      .collection("users")
      .where("uid", "==", this.state.story.userID)
      .get()
      .then((snapshot) => {
        (snapshot || []).forEach((doc) => {
          this.setState({
            user: doc.data(),
          });
        });
      })
      .catch((err) => {
        console.log("Error getting documents", err);
      });
  }

  handleLongPress = () => {
    if (this.state.allowEdit) {
      this.setState({ toggleDelete: true });
    }
  };

  onStoryPress = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "Story",
      params: {
        id: this.state.story.id,
        title: this.state.story.title,
        story: this.state.story.story,
        username: this.state.user.displayName,
        avatar: this.state.user.photoURL,
        image: this.state.story.photoURL,
        handleDelete: this.handleDelete,
        prevRoute: this.state.prevRoute,
      },
    });
    this.props.navigation.dispatch(navigateAction);
  };

  handleDelete = (id) => {
    if (this.state.story.id == id) {
      this.setState({ user: null });
    }
  };

  render() {
    // console.log("Rendering StoryCard...");

    if (this.state.user) {
      return (
        <Card containerStyle={styles.storyCard}>
          <TouchableOpacity
            // key={this.state.id}
            onPress={() => this.onStoryPress()}
            onLongPress={() => this.handleLongPress()}
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
    width: 150,
    height: 130,
    borderRadius: 20,
    alignItems: "center",
    elevation: 3,
    marginBottom: 5,
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
    // marginBottom: 20,
  },
});

export default StoryCard;
