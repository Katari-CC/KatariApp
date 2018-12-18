import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  Alert,
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
      locationID: props.location,
      toggleDisplayForm: props.toggleDisplayForm,
      newStoryTitle: null,
      newStoryText: null,
      newStoryImageURL: null,
      newStoryImageURI: null,
    };
  }

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
      .then((docRef) => {
        if (this.state.newStoryImageURI) {
          uploadImage(this.state.newStoryImageURI, "/stories/", docRef.id)
            .then((snapshot) => {
              snapshot.ref.getDownloadURL().then((downloadURL) => {
                this.setState({
                  newStoryImageURL: downloadURL,
                });
              });
            })
            .catch((e) => {
              console.log(e);
              return null;
            });
        }
        this.setState({
          isAddStoryFormVisible: false,
          stories: [...this.state.stories, newStory],
        });
      });
  }
  imageDialog = (path, imgName) => {
    Alert.alert(
      "Upload an Image with your story",
      "Pick a method:",
      [
        {
          text: "Select from Gallery",
          onPress: () => {
            pickImage();
          },
        },
        {
          text: "Take a picture",
          onPress: () => {
            this.takePhoto().then(() => {});
          },
        },
      ],
      { cancelable: true }
    );
  };

  render() {
    if (this.state.expanded) {
      icon = this.icons["up"];
    }

    return (
      <View>
        <Card containerStyle={styles.inputCard}>
          <View style={styles.inputCard}>
            <Text>Tell your story</Text>
            <Button
              title="Provide an Image"
              buttonStyle={styles.button}
              onPress={() => {
                this.imageDialog();
              }}
            />

            {this.state.newStoryImage ? (
              <Image
                style={styles.imgStory}
                source={{ uri: this.state.newStoryImageURI }}
              />
            ) : (
              <View />
            )}
            <TextInput
              style={styles.textInput}
              placeholder="Give your story a title"
              onChangeText={(text) => this.setState({ newStoryTitle: text })}
            />
            <TextInput
              style={styles.textInput}
              multiline={true}
              placeholder="Give us your best story"
              onChangeText={(text) => this.setState({ newStoryText: text })}
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
  inputCard: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // width: Dimensions.get("screen").width - 20,
    borderRadius: 10,
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
  imgStory: {},
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
  backBtn: {
    position: "absolute",
    top: 0,
    left: 20,
    marginBottom: 8,
  },
});

export default StoryForm;
