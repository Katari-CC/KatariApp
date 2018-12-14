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

import firestore from "../utils/firestore";
import firebase from "../utils/firebaseClient";

import { MonoText } from "../components/StyledText";
import "firebase/firestore";
import { bold, gray } from "ansi-colors";
import { FlatList } from "react-native-gesture-handler";

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
      <ScrollView style={styles.container}>
        <View style={styles.locationList}>
          <FlatList
            horizontal={true}
            data={this.state.locations}
            keyExtractor={this._keyExtractor}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  style={styles.locationItem}
                  onPress={() => {
                    this.onItemListClick(item);
                  }}
                >
                  <Image style={styles.imgList} source={{ uri: item.image }} />
                  <Text style={styles.textList}>{item.title}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <View style={styles.locationDetail}>
          {this.state.isAddStoryFormVisible ? (
            // DISPLAY THE NEW STORY FORM
            <View>
              <TextInput
                style={styles.textInput}
                placeholder="Put a title to your story"
                onChangeText={(text) => this.setState({ newStoryTitle: text })}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Type here your story!"
                onChangeText={(text) => this.setState({ newStoryText: text })}
              />
              <Button
                title="Save your story"
                onPress={() => {
                  this.saveNewStory();
                }}
              />
            </View>
          ) : (
            <View style={styles.storyContainer}>
              <Panel title={this.state.detail.title}>
                <Text style={styles.detailText}>
                  {this.state.detail.description}
                </Text>
              </Panel>

              {this.state.detailReviews.map((story) => {
                return (
                  <Card
                    title={story.title}
                    // image={{ uri: review.imageUrl }}
                    containerStyle={styles.storyCard}
                  >
                    <Text style={styles.description}>{story.story}</Text>
                  </Card>
                );
              })}
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => this.setState({ isAddStoryFormVisible: true })}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  // main Container (ScrollView)
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#032B2F",
    color: "#08708a",
  },

  // Horizonthal locations list
  locationList: {
    paddingTop: 30,
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
    fontSize: 20,
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
    bottom: 0,
    right: 20,
    height: 50,
    width: 50,
    position: "absolute",
    borderRadius: 25,
    alignItems: "center",
    backgroundColor: "#D73A31",
  },
  addButtonText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    padding: 3,
    height: 40,
    width: 40,
    textAlign: "center",
  },

  //New Story Form
  textInput: {
    width: Dimensions.get("window").width - 40,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    height: 50,
    backgroundColor: "#08708A",
    color: "white",
    paddingLeft: 8,
    borderRadius: 5,
    fontSize: 18,
  },

  detailText: {
    fontSize: 20,
    textAlign: "center",
    color: "#898989",
    padding: 5,
  },

  // Stories list
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

  locationDetail: {
    paddingTop: 30,
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
});
