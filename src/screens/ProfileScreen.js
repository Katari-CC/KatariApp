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
} from "react-native";

// File to import to allow upload of the picure on the firebase storage
import { self } from "../utils/quick_fix.js";

import {
  getCameraPermission,
  getCameraRollPermission,
} from "../utils/permissions";
import firebase from "../utils/firebaseClient";
import AppNavigator from "../navigation/AppNavigator";
import { Constants, ImagePicker, Permissions } from "expo";
import { FormLabel, FormInput, Text, Button } from "react-native-elements";
import firestore from "../utils/firestore";
import "firebase/firestore";

export default class ProfileScreen extends React.Component {
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
    };
  }

  async componentDidMount() {
    let currentUser = firebase.auth().currentUser;
    this.setState({
      currentUserEmail: currentUser.email,
      currentUserUID: currentUser.uid,
      currentUserName: currentUser.displayName,
      currentUserImageURL: currentUser.photoURL,
    });
    console.log("user currently logged: ", this.state.currentUserEmail);
    console.log("uuid: ", this.state.currentUserUID);
    console.log("displayName: ", this.state.currentUserName);
    console.log("photoURL: ", currentUser.photoURL);
    console.log("Full User Info: ", currentUser);
  }

  uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    var ref = firebase
      .storage()
      .ref()
      .child("profile_img/" + this.state.currentUserUID + ".jpg");
    return ref.put(blob);
  };

  updateProfileImage(url) {
    firebase
      .auth()
      .currentUser.updateProfile({
        photoURL: url,
      })
      .then(() => {
        console.log("Profile Picture updated");
      })
      .catch(function(error) {
        console.log(error);
      });
  }

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
      // this._handleImagePicked(pickerResult);
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

  logout = () => {
    console.log("logout current user");
    firebase
      .auth()
      .signOut()
      .then(() =>
        this.props.navigator.immediatelyResetStack(
          [AppNavigator.getRoute("Login")],
          0
        )
      )
      .catch((err) => console.log("logout error", err));
  };

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style>{"Welcome " + this.state.currentUserEmail + "!"}</Text>
        {this.state.currentUserImageURL ? (
          <Image
            style={styles.avatar}
            resizeMode="cover"
            source={{
              uri: this.state.currentUserImageURL,
            }}
          />
        ) : (
          <Image
            style={styles.avatar}
            resizeMode="cover"
            source={require("../../assets/images/avatar.png")}
          />
        )}

        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Button
            buttonStyle={styles.button}
            onPress={this._pickImage}
            title="Pick an image from camera roll"
          />

          <Button
            buttonStyle={styles.button}
            onPress={this._takePhoto}
            title="Take a photo"
          />

          <StatusBar barStyle="default" />
        </View>

        <Button
          buttonStyle={styles.button}
          title="Change the profile picture"
          onPress={this._uploadImage}
        />

        <Button
          buttonStyle={styles.button}
          title="Logout"
          onPress={this.logout}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#d0d3c5",
    color: "#56b1bf",
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
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
  avatar: {
    paddingVertical: 30,
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 75,
  },
});
