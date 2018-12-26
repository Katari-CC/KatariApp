import React from "react";
import { View, Alert, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Button } from "react-native-elements";

import {
  getCameraPermission,
  getCameraRollPermission,
} from "../utils/permissions";
import { ImagePicker, Permissions, ImageManipulator } from "expo";

import AppNavigator from "../navigation/AppNavigator";
import { createStackNavigator, NavigationActions } from "react-navigation";

import MyStories from "./MyStories";

import firebase from "../utils/firebaseClient";
import firestore from "../utils/firestore";
import "firebase/firestore";

class Profile extends React.Component {
  static navigationOptions = {
    title: "Profile",
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      currentUserEmail: "Not available",
      currentUserUID: "",
      currentUserImageURL: null,
      currentUserName: "Not available",
      stories: [],
      isAddStoryFormVisible: false,
      newStoryTitle: "",
      newStoryText: "",
    };
    this.toMyStories = this.toMyStories.bind(this);
  }

  componentDidMount() {
    newReviews = [];
    firestore
      .collection("stories")
      .where("userID", "==", this.state.currentUserUID)
      .get()
      .then((snapshot) => {
        (snapshot || []).forEach((doc) => {
          let story = doc.data();
          story.id = doc.id;
          newReviews.push(story);
        });
      })
      .then(() => {
        this.setState({
          stories: newReviews,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  UNSAFE_componentWillMount() {
    let currentUser = firebase.auth().currentUser;
    this.setState({
      currentUserEmail: currentUser.email,
      currentUserUID: currentUser.uid,
      currentUserName: currentUser.displayName,
      currentUserImageURL: currentUser.photoURL,
    });
  }

  toMyStories = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "MyStories",
      params: {
        stories: this.state.stories,
      },
    });
    this.props.navigation.dispatch(navigateAction);
  };

  logout = () => {
    console.log("logout current user");
    firebase
      .auth()
      .signOut()
      .then(() =>
        this.props.navigator.immediatelyResetStack(
          [AppNavigator.getRoute("Start")],
          0
        )
      )
      .catch((err) => console.log("logout error", err));
  };

  // UPDATE PROFILE IMAGE
  imageDialog = (path, imgName) => {
    Alert.alert(
      "Upload an Image with your story",
      "Pick a method:",
      [
        {
          text: "Select from Gallery",
          onPress: () => {
            this._pickImage();
          },
        },
        {
          text: "Take a picture",
          onPress: () => {
            this._takePhoto();
          },
        },
      ],
      { cancelable: true }
    );
  };

  _pickImage = async () => {
    // Request Gallery Permissions
    await Permissions.askAsync(Permissions.CAMERA_ROLL);

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!pickerResult.cancelled) {
      console.log("Here is your link", pickerResult.uri);
      this.uploadImage(pickerResult.uri)
        .then((snapshot) => {
          console.log("Image correctly uploaded");
          snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log("Image available at", downloadURL);
            this.setState({
              currentUserImageURL: downloadURL,
            });
            this.updateProfileImage(downloadURL);
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  _takePhoto = async () => {
    // Request Camera  Permissions
    await Permissions.askAsync(Permissions.CAMERA);

    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!pickerResult.cancelled) {
      console.log("Local path to the picture:", pickerResult.uri);
      this.uploadImage(pickerResult.uri)
        .then((snapshot) => {
          console.log("Image correctly uploaded");
          snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log("Image available at", downloadURL);
            this.setState({
              currentUserImageURL: downloadURL,
            });
            this.updateProfileImage(downloadURL);
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  uploadImage = async (uri) => {
    const resizedImageURI = await ImageManipulator.manipulateAsync(
      uri,
      [
        {
          resize: { height: 150, width: 200 },
        },
      ],
      { format: "jpg" }
    );
    console.log("Resized Img URL:", resizedImageURI.uri);
    const response = await fetch(resizedImageURI.uri);
    const blob = await response.blob();
    var ref = firebase
      .storage()
      .ref()
      .child("profile_img/" + this.state.currentUserUID + ".jpg");
    return ref.put(blob);
  };

  updateProfileImage(url) {
    // Update the user account photoURL
    firebase
      .auth()
      .currentUser.updateProfile({
        photoURL: url,
      })
      .then(() => {
        console.log("Profile Picture updated");
      })
      .catch((error) => {
        console.log(error);
      });

    // Update the user table
    console.log("trying to update img for user: ", this.state.currentUserUID);
    console.log("this.state.currentUserUID", this.state.currentUserUID);
    firestore
      .collection("users")
      .where("uid", "==", this.state.currentUserUID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log("HEELLOOO");
          firestore
            .collection("users")
            .doc(doc.id)
            .update({
              photoURL: url,
            });
        });
      });
    // Update the Image Component of the profile screen
    this.updateLocalImage(url);
  }

  updateLocalImage = (newProfileURL) => {
    this.setState({
      currentUserImageURL: newProfileURL,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.username}>
          {"Welcome " + this.state.currentUserName + "!"}
        </Text>
        {this.state.currentUserImageURL ? (
          <TouchableOpacity
            onPress={() => {
              this.imageDialog();
            }}
          >
            <Image
              style={styles.avatar}
              resizeMode="cover"
              source={{
                uri: this.state.currentUserImageURL,
              }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              this.imageDialog();
            }}
          >
            <Image
              style={styles.avatar}
              resizeMode="cover"
              source={require("../../assets/images/avatar.png")}
            />
          </TouchableOpacity>
        )}
        <Button
          buttonStyle={styles.button}
          title="My Stories"
          onPress={() => {
            this.toMyStories();
          }}
        />

        <Button
          buttonStyle={styles.button}
          title="Logout"
          onPress={this.logout}
        />
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

const ProfileScreen = createStackNavigator(
  {
    Profile: { screen: Profile },
    MyStories: {
      screen: MyStories,
      navigationOptions: () => ({
        backBehavior: "initialRoute",
      }),
    },
  },
  {
    initialRouteName: "Profile",
    headerMode: "none",
  }
);
ProfileScreen.navigationOptions = {
  header: null,
};
export default ProfileScreen;
