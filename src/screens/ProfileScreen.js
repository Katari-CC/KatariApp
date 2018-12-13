import React from "react";
import {
  ScrollView,
  View,
  Clipboard,
  ActivityIndicator,
  Share,
  Image,
  StyleSheet,
  StatusBar
} from "react-native";

import firebase from "../utils/firebaseClient";
import AppNavigator from "../navigation/AppNavigator";
import { Constants, ImagePicker, Permissions } from "expo";
import { FormLabel, FormInput, Text, Button } from "react-native-elements";
import firestore from "../utils/firestore";
import "firebase/firestore";

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: "Profile",
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      uploading: false
    };
  }

  async componentDidMount() {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
  }

  _share = () => {
    Share.share({
      message: this.state.image,
      title: "Check out this photo",
      url: this.state.image
    });
  };

  _copyToClipboard = () => {
    Clipboard.setString(this.state.image);
    alert("Copied image URL to clipboard");
  };

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(0,0,0,0.4)",
              alignItems: "center",
              justifyContent: "center"
            }
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  _maybeRenderImage = () => {
    let { image } = this.state;
    if (!image) {
      return;
    }

    return (
      <View
        style={{
          marginTop: 30,
          width: 250,
          borderRadius: 3,
          elevation: 2
        }}
      >
        <View
          style={{
            borderTopRightRadius: 3,
            borderTopLeftRadius: 3,
            shadowColor: "rgba(0,0,0,1)",
            shadowOpacity: 0.2,
            shadowOffset: { width: 4, height: 4 },
            shadowRadius: 5,
            overflow: "hidden"
          }}
        >
          <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
        </View>

        <Text
          onPress={this._copyToClipboard}
          onLongPress={this._share}
          style={{ paddingVertical: 10, paddingHorizontal: 10 }}
        >
          {image}
        </Text>
      </View>
    );
  };

  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });

    this._handleImagePicked(pickerResult);
  };

  _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });

    this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async pickerResult => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        uploadUrl = await uploadImageAsync(pickerResult.uri);
        this.setState({ image: uploadUrl });
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    } finally {
      this.setState({ uploading: false });
    }
  };

  logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() =>
        this.props.navigator.immediatelyResetStack(
          [AppNavigator.getRoute("Login")],
          0
        )
      )
      .catch(err => console.log("logout error", err));
  };

  render() {
    let { image } = this.state;
    const users = [];
    const currentUser = "";
    let useremail;
    const user = firebase.auth().currentUser;

    if (user != null) {
      useremail = user.email;
    }
    const usersRef = firestore.collection("users");
    usersRef
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          users.push(doc.data());
          console.log("users=", users);
        });
        users.map(obj => {
          if (firebase.auth().currentUser.email === obj.email) {
            console.log("email", useremail);
            currentUser = obj.username;
            console.log("currentUser=", currentUser);
          }
        });
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style>
          {"Welcome " + firebase.auth().currentUser.email + "!"}
        </Text>
        {/* <Image
          style={styles.avatar}
          resizeMode="cover"
          source={require("../../assets/images/avatar.png")}
        /> */}
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          {image ? null : (
            <Text
              style={{
                fontSize: 20,
                marginBottom: 20,
                textAlign: "center",
                marginHorizontal: 15
              }}
            >
              Example: Upload ImagePicker result
            </Text>
          )}

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

          {this._maybeRenderImage()}
          {this._maybeRenderUploadingOverlay()}

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

async function uploadImageAsync(uri) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function(e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const ref = firebase
    .storage()
    .ref()
    .child(uuid.v4());
  const snapshot = await ref.put(blob);

  // We're done with the blob, close and release it
  blob.close();

  return await snapshot.ref.getDownloadURL();
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#d0d3c5",
    color: "#56b1bf",
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center"
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
    paddingRight: 50
    // marginBottom: 10
  },
  avatar: {
    paddingVertical: 30,
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 75
  }
});
