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
    // Request Camera and Gallery Permissions
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);

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
    console.log(currentUser);
  }

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(0,0,0,0.4)",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  _maybeRenderImage = () => {
    return (
      <View
        style={{
          marginTop: 30,
          width: 250,
          borderRadius: 3,
          elevation: 2,
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
            overflow: "hidden",
          }}
        >
          {/* <Image source={{ uri: image }} style={{ width: 250, height: 250 }} /> */}
        </View>

        <Text
          onPress={this._copyToClipboard}
          onLongPress={this._share}
          style={{ paddingVertical: 10, paddingHorizontal: 10 }}
        >
          {/* {image} */}
        </Text>
      </View>
    );
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
      .catch(function(error) {
        console.log(error);
      });
  }

  _pickImage = async () => {
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
    let pickerResult = await ImagePicker.launchCameraAsync({
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

  _handleImagePicked = async (pickerResult) => {
    console.log("Hello", pickerResult);
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
    // let { image } = this.state;
    // const usersRef = firestore.collection("users");
    // usersRef
    //   .get()
    //   .then((snapshot) => {
    //     snapshot.forEach((doc) => {
    //       users.push(doc.data());
    //       console.log("users=", users);
    //     });
    //     users.map((obj) => {
    //       if (firebase.auth().currentUser.email === obj.email) {
    //         console.log("email", useremail);
    //         currentUser = obj.username;
    //         console.log("currentUser=", currentUser);
    //       }
    //     });
    //   })
    //   .catch((err) => {
    //     console.log("Error getting documents", err);
    //   });

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

          {/* {this._maybeRenderImage()}
          {this._maybeRenderUploadingOverlay()} */}

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

// QUICK FIX TO UPLOAD IMAGE
(function(self) {
  "use strict";

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(":");
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(":").trim();
        headers.append(key, value);
      }
    });
    return headers;
  }

  var supportsBlob =
    "FileReader" in self &&
    "Blob" in self &&
    (function() {
      try {
        new Blob();
        return true;
      } catch (e) {
        return false;
      }
    })();

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init);
      var xhr = new XMLHttpRequest();

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || ""),
        };
        options.url =
          "responseURL" in xhr
            ? xhr.responseURL
            : options.headers.get("X-Request-URL");
        var body = "response" in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function() {
        reject(new TypeError("Network request failed"));
      };

      xhr.ontimeout = function() {
        reject(new TypeError("Network request failed"));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === "include") {
        xhr.withCredentials = true;
      } else if (request.credentials === "omit") {
        xhr.withCredentials = false;
      }
      if ("responseType" in xhr && supportsBlob) {
        xhr.responseType = "blob";
      }
      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value);
      });

      xhr.send(
        typeof request._bodyInit === "undefined" ? null : request._bodyInit
      );
    });
  };
  self.fetch.polyfill = true;
})(typeof self !== "undefined" ? self : this);

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
