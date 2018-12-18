import React, { Component } from "react";
import {
  Modal,
  Text,
  TouchableHighlight,
  View,
  Alert,
  StyleSheet,
} from "react-native";
import firebase from "../utils/firebaseClient";
import { Button } from "react-native-elements";
import {
  getCameraPermission,
  getCameraRollPermission,
} from "../utils/permissions";
import { Constants, ImagePicker, Permissions } from "expo";

export default class ImageUploadModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUserEmail: "Not available",
      currentUserUID: "",
      currentUserImageURL: null,
    };
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
            this.props.goback();
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
            this.props.goback();
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

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
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <View style={{ marginTop: 22 }}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={{ marginTop: 22 }}>
            <View>
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

              <TouchableHighlight
                onPress={() => {
                  this.props.goback();
                }}
              >
                <Text style={styles.textList}>x Close</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    marginBottom: 10,
  },
  textList: {
    marginTop: 10,
    fontWeight: "bold",
    color: "gray",
    textAlign: "center",
  },
});
