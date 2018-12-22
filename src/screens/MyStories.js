import React from "react";
import {
  ScrollView,
  View,
  Clipboard,
  ActivityIndicator,
  Share,
  Image,
  StyleSheet,
  StatusBar,
  FlatList,
} from "react-native";

import firebase from "../utils/firebaseClient";
import AppNavigator from "../navigation/AppNavigator";
import Story from "./Story";
import StoryCard from "../components/StoryCard";
import { Text, Button, Card } from "react-native-elements";
import firestore from "../utils/firestore";
import "firebase/firestore";
import { createStackNavigator, NavigationActions } from "react-navigation";

class MyStories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stories: this.props.navigation.state.params.stories,
    };
  }
  componentDidMount() {}

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.username}>Your Stories</Text>

        <ScrollView
          style={styles.storyList}
          removeClippedSubviews
          bounce={true}
          overScrollMode="always"
          centerContent={true}
        >
          {this.state.stories &&
            this.state.stories.map((story, index) => {
              return (
                <StoryCard
                  prevRoute="MyStories"
                  key={index}
                  story={story}
                  allowEdit={true}
                  navigation={this.props.navigation}
                />
              );
            })}
          {!this.state.stories ? (
            <Card
              title={"No stories yet. Add one!"}
              containerStyle={styles.storyCard}
            />
          ) : (
            <View />
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  username: {
    fontWeight: "bold",
    marginTop: 50,
    justifyContent: "center",
    color: "#56b1bf",
    fontSize: 20,
  },
  title: {
    fontSize: 20,
  },
  container: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#56b1bf",
    borderWidth: 0,
    borderRadius: 5,
    marginTop: 20,
    paddingLeft: 50,
    paddingRight: 50,
  },
  textList: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  storyCard: {
    width: 150,
    height: 130,
    borderRadius: 20,
    alignItems: "center",
    elevation: 3,
    marginBottom: 5,
  },
  avatar: {
    marginTop: 10,
    paddingVertical: 30,
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 75,
  },
});

const MyStoriesScreen = createStackNavigator(
  {
    MyStories: {
      screen: MyStories,
    },
    Story: {
      screen: Story,
      navigationOptions: () => ({
        backBehavior: "initialRoute",
      }),
    },
  },
  {
    initialRouteName: "MyStories",
    headerMode: "none",
  }
);
MyStoriesScreen.navigationOptions = {
  header: null,
};
export default MyStoriesScreen;
