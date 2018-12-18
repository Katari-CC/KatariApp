import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Dimensions,
  Alert,
  TouchableOpacity,
} from "react-native";
const TEXT_COLOR = "#898989";

import Story from "./Story";
import { createStackNavigator, NavigationActions } from "react-navigation";

import {
  ListItem,
  Button,
  Card,
  Icon,
  Avatar,
  Divider,
} from "react-native-elements";
import Panel from "../components/Panel";
import { FlatList } from "react-native-gesture-handler";

import firestore from "../utils/firestore";
import firebase from "../utils/firebaseClient";

import { MonoText } from "../components/StyledText";
import "firebase/firestore";
import { bold, gray } from "ansi-colors";

class Home extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      detail: {},
      stories: [],
      isListVisible: true,
      isAddStoryFormVisible: false,
      newStoryTitle: "",
      newStoryText: "",
      isSelected: false,
    };
    this.saveNewStory = this.saveNewStory.bind(this);
    this.onStoryPress = this.onStoryPress.bind(this);
  }

  componentDidMount() {
    newLocation = [];
    firestore
      .collection("locations")
      // .where("image", ">=", "")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          newLocation.push(doc.data());
        });
        this.setState({
          locations: newLocation,
        });
      })
      .catch((err) => {
        console.log("Error getting documents", err);
      });
  }

  onItemListClick = (item) => {
    this.setState({
      detail: item,
      isAddStoryFormVisible: false,
    });
    stories = [];
    // let avatar;
    const p1 = firestore
      .collection("stories")
      .where("location", "==", item.title)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          stories.push(doc.data());
        });
      })
      .then(() => {
        const p2 = stories.map((story) =>
          firebase
            .storage()
            .ref()
            .child("profile_img/" + story.userID + ".jpg")
            .getDownloadURL()
        );
        Promise.all(p2)
          .then((urls) => {
            urls.forEach((url, index) => {
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
  };

  onStoryPress(story) {
    // console.log(this.state.stories);
    const navigateAction = NavigationActions.navigate({
      routeName: "Story",
      params: {
        title: story.title,
        story: story.story,
        username: story.username,
        avatar: story.avatar,
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
      location: this.state.detail.title,
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
    console.log("Rendering...");
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          <FlatList
            style={styles.locationList}
            horizontal={true}
            data={this.state.locations}
            keyExtractor={this._keyExtractor}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.locationItem}
                  onPress={() => {
                    this.onItemListClick(item);
                  }}
                >
                  <Image style={styles.imgList} source={{ uri: item.image }} />
                  <Text adjustsFontSizeToFit style={styles.textList}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
          {/* <ScrollView
            style={styles.locationList}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            removeClippedSubviews
            bounce={true}
            overScrollMode="always"
            centerContent={true}
          >
            {this.state.locations.map((item) => (
              <TouchableOpacity
                style={styles.locationItem}
                onPress={() => {
                  this.onItemListClick(item);
                }}
              >
                <Image style={styles.imgList} source={{ uri: item.image }} />
                <Text adjustsFontSizeToFit style={styles.textList}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView> */}
          <View style={styles.locationDetail}>
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
                <Panel style={styles.storyList} title={this.state.detail.title}>
                  <Text style={styles.detailText}>
                    {this.state.detail.description}
                  </Text>
                </Panel>
                <ScrollView
                  style={styles.storyList}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  removeClippedSubviews
                  bounce={true}
                  overScrollMode="always"
                  centerContent={true}
                >
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
                      <Card key={index} containerStyle={styles.storyCard}>
                        <TouchableOpacity
                          style={styles.storyCard}
                          onPress={() => this.onStoryPress(story)}
                        >
                          <View style={styles.userTitle}>
                            <Avatar
                              rounded
                              key={index}
                              containerStyle={styles.avatar}
                              source={{ uri: story.avatar }}
                            />
                            <Text adjustsFontSizeToFit style={styles.username}>
                              {story.username}
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
                            <Text
                              adjustsFontSizeToFit
                              style={styles.description}
                            >
                              {story.title}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </Card>
                    );
                  })}

                  <Card containerStyle={styles.addCard}>
                    <TouchableOpacity
                      style={styles.addCard}
                      onPress={() =>
                        this.setState({ isAddStoryFormVisible: true })
                      }
                    >
                      <Text style={styles.addBtnText}>+</Text>
                    </TouchableOpacity>
                  </Card>
                </ScrollView>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  // main Container (ScrollView)
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#08708a",
    // backgroundColor: "white",
    color: "#032B2F",
    flexDirection: "column",
  },
  // Horizonthal locations list
  locationList: {
    paddingTop: 40,
  },
  storyList: {
    paddingTop: 20,
  },
  locationItem: {
    padding: 6,
  },

  imgList: {
    height: Dimensions.get("window").height / 3,
    width: Dimensions.get("window").width / 1.7,
    borderRadius: 10,
    margin: 2,
  },

  textList: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },

  // location Description
  description: {
    textAlign: "center",
    marginTop: 10,
  },
  // Add Story button
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d73a31",
    borderRadius: 100,
    width: 65,
    height: 65,
  },
  addBtnPosition: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  addBtnText: {
    fontSize: 25,
    color: "black",
  },
  avatar: {
    // borderWidth: 1,
    // borderColor: "black",
    // borderRadius: 100,
    // marginRight: 5,
    marginBottom: 20,
  },
  //New Story Form
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

  detailText: {
    fontSize: 16,
    textAlign: "center",
    color: TEXT_COLOR,
    padding: 5,
  },
  // Stories list
  storyContainer: {
    flexDirection: "column",
    alignItems: "center",
    // flexWrap: "wrap",
  },
  storyCard: {
    // flexDirection: "column",
    width: 150,
    height: 130,
    borderRadius: 20,
    alignItems: "center",
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
  },
  locationDetail: {
    paddingTop: 10,
    paddingBottom: 20,
    minHeight: Dimensions.get("screen").height / 2 - 20,
  },

  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20,
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
    // marginBottom: 10
  },
  backBtn: {
    position: "absolute",
    top: 0,
    left: 20,
    marginBottom: 8,
  },
});

const HomeScreen = createStackNavigator(
  {
    Home: { screen: Home },
    Story: {
      screen: Story,
      navigationOptions: () => ({
        backBehavior: "initialRoute",
      }),
    },
  },
  {
    initialRouteName: "Home",
    headerMode: "none",
  }
);
HomeScreen.navigationOptions = {
  header: null,
};
export default HomeScreen;
