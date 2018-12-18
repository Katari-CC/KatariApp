import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { Card, Button, Icon } from "react-native-elements";
import firestore from "../utils/firestore";
import firebase from "../utils/firebaseClient";
import { ScrollView } from "react-native-gesture-handler";
import Story from "./Story";
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
    this.saveNewStory = this.saveNewStory.bind(this);
    this.onStoryPress = this.onStoryPress.bind(this);
  }

  componentDidMount() {
    newReviews = [];
    firestore
      .collection("stories")
      .where("location", "==", this.props.navigation.state.params.title)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          newReviews.push(doc.data());
        });
      })
      .then(() => {
        this.setState({
          stories: newReviews,
        });
      });
  }

  onStoryPress(story) {
    const navigateAction = NavigationActions.navigate({
      routeName: "Story",
      params: {
        title: story.title,
        story: story.story,
        username: "",
        profPic: "",
        image: story.image,
      },
    });
    this.props.navigation.dispatch(navigateAction);
  }

  saveNewStory() {
    const newStory = {
      userID: firebase.auth().currentUser.uid,
      title: this.state.newStoryTitle,
      story: this.state.newStoryText,
      location: this.props.navigation.state.params.title,
      username: firebase.auth().currentUser.displayName,
    };
    firestore
      .collection("stories")
      .doc()
      .set(newStory)
      .then(() => {
        this.setState({
          isAddStoryFormVisible: false,
          stories: [...this.state.stories, newStory],
        });
      });
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.location}>
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
          {/* <Button
            buttonStyle={styles.button}
            title="Add your story"
            onPress={() => {
              this.setState({ isAddStoryFormVisible: true });
            }}
          /> */}
          {this.state.isAddStoryFormVisible ? (
            // DISPLAY THE NEW STORY FORM
            <View>
              <Card containerStyle={styles.inputCard}>
                <View style={styles.inputCard}>
                  <Text style={styles.formTitle}>Tell your story</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Give your story a title"
                    onChangeText={(text) =>
                      this.setState({ newStoryTitle: text })
                    }
                  />
                  <TextInput
                    style={styles.textInput}
                    multiline={true}
                    placeholder="Give us your best story"
                    onChangeText={(text) =>
                      this.setState({ newStoryText: text })
                    }
                  />
                  <Button
                    title="Save your story"
                    buttonStyle={styles.button}
                    onPress={() => {
                      this.saveNewStory();
                    }}
                  />
                  <View style={styles.backBtn}>
                    <Icon
                      name="md-arrow-back"
                      onPress={() =>
                        this.setState({ isAddStoryFormVisible: false })
                      }
                      type="ionicon"
                      size={30}
                      color={TEXT_COLOR}
                    />
                  </View>
                </View>
              </Card>
            </View>
          ) : (
            <View style={styles.storyContainer}>
              {this.state.stories.length == 0 ? (
                <Card
                  title={"No stories yet. Add one!"}
                  containerStyle={styles.storyCard}
                />
              ) : (
                <View />
              )}
              {this.state.stories.map((story, index) => {
                return (
                  <Card
                    key={index}
                    title={story.username}
                    // image={{ uri: review.imageUrl }}
                    containerStyle={styles.storyCard}
                  >
                    <TouchableOpacity
                      style={styles.storyCard}
                      onPress={() => this.onStoryPress(story)}
                    >
                      <Text style={styles.description}>{story.title}</Text>
                    </TouchableOpacity>
                  </Card>
                );
              })}
              <Card containerStyle={styles.addCard}>
                <TouchableOpacity
                  style={styles.addCard}
                  onPress={() => this.setState({ isAddStoryFormVisible: true })}
                >
                  <Text style={styles.addBtnText}>+</Text>
                </TouchableOpacity>
              </Card>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  location: {
    paddingTop: 30,
    paddingBottom: 20,
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
    width: 150,
    height: 120,
    borderRadius: 20,
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
    height: 120,
    borderRadius: 20,
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
