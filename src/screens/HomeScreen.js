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

import { ListItem, Button, Card, Icon } from "react-native-elements";
import Panel from "../components/Panel";
import { FlatList } from "react-native-gesture-handler";

import firestore from "../utils/firestore";
import firebase from "../utils/firebaseClient";

import { MonoText } from "../components/StyledText";
import "firebase/firestore";
import { bold, gray } from "ansi-colors";

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      detail: {},
      detailReviews: [],
      isListVisible: true,
      isAddStoryFormVisible: false,
      newStoryTitle: "",
      newStoryText: "",
      isSelected: false,
    };
    this.saveNewStory = this.saveNewStory.bind(this);
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
    newReviews = [];
    firestore
      .collection("stories")
      .where("location", "==", item.title)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          newReviews.push(doc.data());
        });
      })
      .then(() => {
        this.setState({
          isSelected: true,
          detailReviews: newReviews,
        });
      });
  };

  saveNewStory() {
    const newStory = {
      userID: firebase.auth().currentUser.uid,
      title: this.state.newStoryTitle,
      story: this.state.newStoryText,
      location: this.state.detail.title,
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
                  <TextInput
                    style={styles.textInput}
                    placeholder="Put a title to your story"
                    onChangeText={(text) =>
                      this.setState({ newStoryTitle: text })
                    }
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Type here your story!"
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
                  {this.state.detailReviews.length == 0 ? (
                    <Card
                      title={"No stories yet. Add one!"}
                      containerStyle={styles.storyCard}
                    />
                  ) : (
                    <View />
                  )}
                  {this.state.detailReviews.map((story, index) => {
                    return (
                      <Card
                        key={index}
                        title={story.title}
                        // image={{ uri: review.imageUrl }}
                        containerStyle={styles.storyCard}
                      >
                        <TouchableOpacity
                          style={styles.storyCard}
                          // onPress={() => this.setState({ isAddStoryFormVisible: true })}
                        >
                          <Text style={styles.description}>{story.story}</Text>
                        </TouchableOpacity>
                      </Card>
                    );
                  })}

                  <Card containerStyle={styles.storyCard}>
                    <TouchableOpacity
                      style={styles.storyCard}
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
        {/* <View style={styles.addBtnPosition}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => this.setState({ isAddStoryFormVisible: true })}
          >
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View> */}
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
    marginBottom: 10,
    textAlign: "center",
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

  //New Story Form
  textInput: {
    // width: Dimensions.get("window").width - 40,
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
    color: "#898989",
    padding: 5,
  },
  // Stories list
  storyContainer: {
    flexDirection: "column",
    alignItems: "center",
    // flexWrap: "wrap",
  },
  storyCard: {
    justifyContent: "center",
    alignItems: "center",
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
});
