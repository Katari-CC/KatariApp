import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { Card, Button, Icon, Avatar, Divider } from "react-native-elements";
import firestore from "../utils/firestore";
import firebase from "../utils/firebaseClient";
import { ScrollView } from "react-native-gesture-handler";
import Story from "./Story";
import StoryCard from "../components/StoryCard";
import StoryForm from "../components/StoryForm";
import { createStackNavigator, NavigationActions } from "react-navigation";
const TEXT_COLOR = "#898989";

class LocationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stories: [],
      isAddStoryFormVisible: false,
      newStoryTitle: "",
      newStoryText: "",
    };
    // this.saveNewStory = this.saveNewStory.bind(this);
    this.onStoryPress = this.onStoryPress.bind(this);
    this.toggleFormDisplay = this.toggleFormDisplay.bind(this);
    this.addStory = this.addStory.bind(this);
  }

  componentDidMount() {
    stories = [];
    // let avatar;
    const p1 = firestore
      .collection("stories")
      .where("location", "==", this.props.navigation.state.params.title)
      .onSnapshot((snapshot) => {
        (snapshot || []).forEach((doc) => {
          let story = doc.data();
          story.id = doc.id;
          stories.push(story);
        });
        const p2 = stories.map((story) =>
          firebase
            .storage()
            .ref()
            .child("profile_img/" + story.userID + ".jpg")
            .getDownloadURL()
        );
        Promise.all(p2)
          .then((urls) => {
            (urls || []).forEach((url, index) => {
              stories[index].avatar = url;
            });
          })
          .then(() => {
            this.setState({
              isSelected: true,
              stories,
            });
          });
      });
  }

  onStoryPress(story) {
    const navigateAction = NavigationActions.navigate({
      routeName: "Story",
      params: {
        id: story.id,
        title: story.title,
        story: story.story,
        username: story.username,
        avatar: story.avatar,
        image: story.image,
      },
    });
    this.props.navigation.dispatch(navigateAction);
  }

  toggleFormDisplay = () => {
    this.setState({ isAddStoryFormVisible: !this.state.isAddStoryFormVisible });
  };

  addStory = (newStory) => {
    const tempStoryList = this.state.stories;
    tempStoryList.push(newStory);
    this.setState({
      stories: tempStoryList,
    });
  };

  // saveNewStory() {
  //   const newStory = {
  //     userID: firebase.auth().currentUser.uid,
  //     title: this.state.newStoryTitle,
  //     story: this.state.newStoryText,
  //     location: this.props.navigation.state.params.title,
  //     username: firebase.auth().currentUser.displayName,
  //   };
  //   firestore
  //     .collection("stories")
  //     .doc()
  //     .set(newStory)
  //     .then(() => {
  //       this.setState({
  //         isAddStoryFormVisible: false,
  //         stories: [...this.state.stories, newStory],
  //       });
  //     });
  // }

  render() {
    return (
      <ScrollView>
        <View style={styles.location}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
            enabled
          >
            <Text style={styles.detailTitle}>
              {this.props.navigation.state.params.title}
            </Text>
            {this.props.navigation.state.params.image !== undefined ? (
              // display image only if exist
              <Image
                style={styles.detailImage}
                source={{ uri: this.props.navigation.state.params.image }}
              />
            ) : (
              <View />
            )}
            <Text style={styles.detailText}>
              {this.props.navigation.state.params.description}
            </Text>
            {this.state.isAddStoryFormVisible ? (
              // DISPLAY THE NEW STORY FORM
              <StoryForm
                location={this.props.navigation.state.params.title}
                toggleDisplayForm={this.toggleFormDisplay}
                addStory={this.addStory}
              />
            ) : (
              <View style={styles.storyContainer}>
                {this.state.stories.length == 0 ? (
                  <Card containerStyle={styles.noStoryCard}>
                    <Image
                      style={{
                        width: 120,
                        height: 110,
                      }}
                      resizeMode="cover"
                      source={require("../../assets/images/no_stories.png")}
                    />
                  </Card>
                ) : (
                  <View />
                )}
                {this.state.stories.map((story, index) => {
                  return (
                    <StoryCard
                      prevRoute="Location"
                      key={index}
                      story={story}
                      navigation={this.props.navigation}
                    />
                  );
                })}

                <TouchableOpacity
                  // style={styles.addCard}
                  onPress={() => this.setState({ isAddStoryFormVisible: true })}
                >
                  <Card containerStyle={styles.addCard}>
                    <Text style={styles.addBtnText}>+</Text>
                  </Card>
                </TouchableOpacity>
              </View>
            )}
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  location: {
    paddingTop: 30,
    paddingBottom: 100,
  },
  textInput: {
    width: Dimensions.get("window").width - 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    // height: 50,
    // backgroundColor: "#08708A",
    // color: "white",
    borderWidth: 1.5,
    paddingLeft: 8,
    borderRadius: 8,
    fontSize: 14,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#56b1bf",
    // width: "100%",
    // height: 50,
    borderWidth: 0,
    borderRadius: 5,
    marginTop: 10,
    paddingLeft: 50,
    paddingRight: 50,
    marginBottom: 3,
  },
  detailImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 3,
    marginTop: 2,
    marginBottom: 2,
  },

  detailTitle: {
    margin: 1,
    fontSize: 25,
    textAlign: "center",
    color: TEXT_COLOR,
    fontWeight: "bold",
  },
  formTitle: {
    textAlign: "center",
    color: TEXT_COLOR,
    fontSize: 18,
    marginTop: 1,
    marginBottom: 3,
  },
  detailText: {
    width: Dimensions.get("window").width - 20,
    fontSize: 20,
    textAlign: "center",
    color: TEXT_COLOR,
  },
  storyContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  storyCard: {
    // flexDirection: "column",
    width: 150,
    height: 130,
    borderRadius: 20,
    alignItems: "center",
    elevation: 3,
    marginBottom: 5,
  },
  username: {
    marginLeft: 5,
    textAlign: "center",
    marginBottom: 25,
    fontWeight: "bold",
  },
  userTitle: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "nowrap",
  },
  avatar: {
    // borderWidth: 1,
    // borderColor: "black",
    // borderRadius: 100,
    // marginRight: 5,
    marginBottom: 20,
  },
  noStoryCard: {
    // flexDirection: "column",
    width: 150,
    height: 130,
    paddingTop: 10,
    borderRadius: 20,
    alignItems: "center",
    elevation: 3,
    marginBottom: 5,
  },
  inputCard: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // width: Dimensions.get("screen").width - 20,
    borderRadius: 10,
  },
  addCard: {
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 130,
    borderRadius: 20,
    elevation: 3,
    marginBottom: 5,
  },
  addBtnText: {
    fontSize: 25,
    color: "black",
  },
  backBtn: {
    position: "absolute",
    top: 0,
    left: 20,
    marginBottom: 8,
  },
});

const Location = createStackNavigator(
  {
    LocationScreen: { screen: LocationScreen },
    Story: {
      screen: Story,
      navigationOptions: () => ({
        backBehavior: "initialRoute",
      }),
    },
  },
  {
    initialRouteName: "LocationScreen",
    headerMode: "none",
  }
);
Location.navigationOptions = {
  header: null,
};
export default Location;
