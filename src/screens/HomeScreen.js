import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Dimensions
} from "react-native";

import { ListItem, Button, Card } from "react-native-elements";
import firestore from "../utils/firestore";
import firebase from "../utils/firebaseClient";

import { MonoText } from "../components/StyledText";
import "firebase/firestore";
import { bold, gray } from "ansi-colors";
import { FlatList } from "react-native-gesture-handler";

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      detail: {},
      detailReviews: [],
      isListVisible: true,
      isAddStoryFormVisible: false,
      newStoryTitle: "",
      newStoryText: ""
    };
    this.saveNewStory = this.saveNewStory.bind(this);
  }

  componentDidMount() {
    newLocation = [];
    firestore
      .collection("locations")
      // .where("image", ">=", "")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          newDoc = doc.data();
          newDoc["title"] = doc.id;
          newLocation.push(newDoc);
        });
        this.setState({
          locations: newLocation
        });
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
  }

  onItemListClick = item => {
    if (!this.state.isListVisible) {
      this.setState({
        isListVisible: true,
        isAddStoryFormVisible: false
      });
    } else {
      this.setState({
        detail: item,
        isListVisible: false
      });
      newReviews = [];
      firestore
        .collection("stories")
        .where("location", "==", item.title)
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            newReviews.push(doc.data());
          });
        })
        .then(() => {
          this.setState({
            detailReviews: newReviews
          });
        });
    }
  };

  saveNewStory() {
    const newStory = {
      userID: firebase.auth().currentUser.uid,
      title: this.state.newStoryTitle,
      story: this.state.newStoryText,
      location: this.state.detail.title
    };
    firestore
      .collection("stories")
      .doc()
      .set(newStory)
      .then(() => {
        this.setState({
          isAddStoryFormVisible: false,
          stories: [...this.state.stories, newStory]
        });
      });
  }

  render() {
    console.log("Rendering...");

    return (
      <ScrollView style={styles.container}>
        {this.state.isListVisible ? (
          // DISPLAY LIST OF LOCATIONS
          <View style={styles.list}>
            {this.state.locations.map((item, index) => {
              return (
                <ListItem
                  key={index}
                  title={item.title}
                  subtitle={item.description}
                  avatar={{ uri: item.image }}
                  onPress={() => this.onItemListClick(item)}
                />
              );
            })}
          </View>
        ) : (
            // DISPLAY DETAILED LOCATION
            <View style={styles.location}>
              <Button
                title="Back"
                style={styles.backButton}
                onPress={() => {
                  this.onItemListClick();
                }}
              />
              <Text style={styles.detailTitle}>{this.state.detail.title}</Text>
              {this.state.detail.image !== undefined ? (
                // display image only if exist
                <Image
                  style={styles.detailImage}
                  source={{ uri: this.state.detail.image }}
                />
              ) : (
                  <View />
                )}
              <Text style={styles.detailText}>
                {this.state.detail.description}
              </Text>
              <Button
                title="Add your story"
                onPress={() => {
                  this.setState({ isAddStoryFormVisible: true });
                }}
              />
              {this.state.isAddStoryFormVisible ? (
                // DISPLAY THE NEW STORY FORM
                <View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Put a title to your story"
                    onChangeText={text => this.setState({ newStoryTitle: text })}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Type here your story!"
                    onChangeText={text => this.setState({ newStoryText: text })}
                  />
                  <Button
                    title="Save your story"
                    onPress={() => {
                      this.saveNewStory();
                    }}
                  />
                </View>
              ) : (
                  <View />
                )}
              <View style={styles.storyContainer}>
              {this.state.detailReviews.map((story)=> {return <Card
                        title={story.title}
                        // image={{ uri: review.imageUrl }}
                        containerStyle={styles.storyCard}
                      >
                        <Text style={{ marginBottom: 10, textAlign: 'center' }}>{story.story}</Text>
                </Card>})}
              </View>
            </View>
          )}
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  textInput: {
    width: Dimensions.get("window").width - 50,
    height: 100
  },

  backButton: {
    width: Dimensions.get("window").width / 5,
    fontSize: 22,
    fontWeight: "bold",
    color: "#0061ff"
  },

  detailImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 3,
    margin: 2
  },

  detailTitle: {
    margin: 1,
    fontSize: 25,
    textAlign: "center",
    color: "#898989",
    fontWeight: "bold"
  },

  detailText: {
    width: Dimensions.get("window").width - 20,
    fontSize: 20,
    textAlign: "center",
    color: "#898989"
  },
  storyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  storyCard: {
    width: 150,
    height: 120,
    borderRadius: 20,
  },
  container: {
    ...StyleSheet.absoluteFillObject
  },
  list: {
    paddingTop: 20,
  },
  location: {
    paddingTop: 30,
    paddingBottom: 20,
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)"
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
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
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center"
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  }
});