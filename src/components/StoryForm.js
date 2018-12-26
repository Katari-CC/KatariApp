import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";

import { TEXT_COLOR } from "../constants/Colors";
import React from "react";
import { Button, Card, Icon } from "react-native-elements";

import { uploadImage, pickImage } from "../utils/imageUtils.js";

import firestore from "../utils/firestore";
import firebase from "../utils/firebaseClient";

class StoryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      toggleDisplayForm: props.toggleDisplayForm,
      addStory: props.addStory,
      currentUserID: null,
      newStoryTitle: null,
      newStoryText: null,
      newStoryImageURL: null,
      newStoryImageURI: null,
      newStoryID: null,
    };
  }

  componentWillMount() {
    this.setState({
      currentUserID: firebase.auth().currentUser.uid,
    });
  }

  saveNewStory() {
    if (
      // Check if title and text is not empty
      this.state.newStoryTitle &&
      this.state.newStoryText
    ) {
      const newStory = {
        userID: this.state.currentUserID,
        title: this.state.newStoryTitle,
        story: this.state.newStoryText,
        location: this.state.location,
      };
      firestore
        .collection("stories")
        .add(newStory)
        .then((docRef) => {
          if (this.state.newStoryImageURI) {
            console.log("Story Created successfully, ID=>", docRef.id);
            uploadImage(this.state.newStoryImageURI, "/stories/", docRef.id)
              .then((snapshot) => {
                console.log("Image Uploaded Succesfully");
                snapshot.ref.getDownloadURL().then((downloadURL) => {
                  console.log("Image Available at: ", downloadURL);
                  this.addURL(downloadURL, docRef.id);
                  // Update the current HomeScreen with the newStory
                  let tempStory = newStory;
                  tempStory.photoURL = downloadURL;
                  this.props.addStory(newStory);
                });
              })
              .catch((e) => {
                console.log(e);
                return null;
              });
          } else {
            this.props.addStory(newStory);
          }
          this.props.toggleDisplayForm();
        });
    } else {
      Alert.alert("Empty Field", "Please provide title and text", [
        { text: "OK", onPress: null },
      ]);
    }
  }

  addURL = (url, storyID) => {
    console.log("Update the url of the picture on the story document");
    firestore
      .collection("stories")
      .doc(storyID)
      .update({ photoURL: url })
      .then(() => {
        console.log("Update Successful");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  imageDialog = (path, imgName) => {
    Alert.alert(
      "Upload an Image with your story",
      "Pick a method:",
      [
        {
          text: "Select from Gallery",
          onPress: () => {
            pickImage()
              .then((picker) => {
                if (!picker.cancelled) {
                  console.log("Here is your URI:", picker.uri);
                  this.setState({
                    newStoryImageURI: picker.uri,
                  });
                }
              })
              .catch((e) => {
                console.log(e);
                return null;
              });
          },
        },
        {
          text: "Take a picture",
          onPress: () => {
            takePhoto()
              .then((picker) => {
                if (!picker.cancelled) {
                  console.log("Here is your URI:", picker.uri);
                  this.setState({
                    newStoryImageURI: picker.uri,
                  });
                }
              })
              .catch((e) => {
                console.log(e);
                return null;
              });
          },
        },
      ],
      { cancelable: true }
    );
  };

  render() {
    console.log("Rendering StoryForm...");
    console.log("Current URI:", this.state.newStoryImageURI);

    return (
      <View>
        <Card containerStyle={styles.inputCard}>
          <View style={styles.inputCard}>
            <Text style={styles.detailTitle}>Tell your story</Text>

            <TextInput
              style={styles.storytitle}
              underlineColorAndroid="transparent"
              placeholder="Give your story a title"
              onChangeText={(text) => this.setState({ newStoryTitle: text })}
            />
            <TextInput
              style={styles.textarea}
              multiline={true}
              numberOfLines={5}
              underlineColorAndroid="transparent"
              placeholder="Give us your best story"
              onChangeText={(text) => this.setState({ newStoryText: text })}
            />

            <View>
              {this.state.newStoryImageURI ? (
                <TouchableOpacity
                  onPress={() => {
                    this.imageDialog();
                  }}
                >
                  <Image
                    style={styles.imgStory}
                    source={{ uri: this.state.newStoryImageURI }}
                  />
                </TouchableOpacity>
              ) : (
                <View style={styles.cameraButton}>
                  <Icon
                    style={{ marginRight: 20 }}
                    reverse
                    name="camera"
                    type="font-awesome"
                    color="#442C2E"
                    onPress={() => {
                      this.imageDialog();
                    }}
                  />
                  <Text style={styles.textList}>No image</Text>
                </View>
              )}
            </View>

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
                onPress={() => this.props.toggleDisplayForm()}
                type="ionicon"
                size={30}
                color={TEXT_COLOR}
              />
            </View>
          </View>
        </Card>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  detailTitle: {
    margin: 1,
    fontSize: 25,
    textAlign: "center",
    color: "#442C2E",
    fontWeight: "bold",
    marginBottom: 5,
  },
  textList: {
    fontWeight: "bold",
    color: "#442C2E",
  },
  inputCard: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#56b1bf",
    borderWidth: 0,
    borderRadius: 5,
    marginTop: 10,
    paddingLeft: 50,
    paddingRight: 50,
  },
  cameraButton: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    margin: 5,
    // justifyContent: "",
  },
  imgStory: {
    marginTop: 10,
    width: 200,
    height: 150,
  },
  textInput: {
    width: Dimensions.get("window").width - 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 1.5,
    paddingLeft: 8,
    borderRadius: 8,
    fontSize: 14,
  },
  textarea: {
    height: 100,
    borderColor: "#442C2E",
    width: Dimensions.get("window").width - 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 1.5,
    paddingLeft: 8,
    borderRadius: 8,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  storytitle: {
    width: Dimensions.get("window").width - 40,
    marginTop: 10,
    paddingTop: 10,
    borderColor: "#442C2E",
    paddingBottom: 10,
    borderWidth: 1.5,
    paddingLeft: 8,
    borderRadius: 8,
  },
  backBtn: {
    position: "absolute",
    top: 0,
    left: 20,
    marginBottom: 8,
  },
});

export default StoryForm;
