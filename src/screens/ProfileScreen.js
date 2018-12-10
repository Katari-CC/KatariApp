import React from "react";
<<<<<<< HEAD
import { View, Image, StyleSheet, ImagePicker } from "react-native";
// import PhotoUpload from "react-native-photo-upload";
=======

import { ScrollView, View, Image, StyleSheet, ImagePicker } from "react-native";
// import PhotoUpload from "react-native-photo-upload";

>>>>>>> dcfe42759d455b3582c924c3dab77b0adc39bd8f
import firebase from "../utils/firebaseClient";
import AppNavigator from "../navigation/AppNavigator";
import { FormLabel, FormInput, Text, Button } from "react-native-elements";
import "firebase/firestore";
// import RNFetchBlob from "react-native-fetch-blob";

// const Blob = RNFetchBlob.polyfill.Blob;
// const fs = RNFetchBlob.fs;
// window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
// window.Blob = Blob;

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: "Profile",
    header: null
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

  _uploadImage = (uri, mime = "image/jpeg", name) => {
    // return new Promise((resolve, reject) => {
    //   let imgUri = uri;
    //   let uploadBlob = null;
    //   const uploadUri =
    //     Platform.OS === "ios" ? imgUri.replace("file://", "") : imgUri;
    //   const { currentUser } = firebase.auth();
    //   const imageRef = firebase.storage().ref(`/jobs/${currentUser.uid}`);
    //   fs.readFile(uploadUri, "base64")
    //     .then(data => {
    //       return Blob.build(data, { type: `${mime};BASE64` });
    //     })
    //     .then(blob => {
    //       uploadBlob = blob;
    //       return imageRef.put(blob, { contentType: mime, name: name });
    //     })
    //     .then(() => {
    //       uploadBlob.close();
    //       return imageRef.getDownloadURL();
    //     })
    //     .then(url => {
    //       resolve(url);
    //     })
    //     .catch(error => {
    //       reject(error);
    //     });
    // });
  };

  render() {
    return (
      <ScrollView >
        <View style={styles.container}>
          <Text>
            A bunch of random text to see if scrolling actually works. A bunch of
            random text to see if scrolling actually works.
        </Text>
          <Text>
            A bunch of random text to see if scrolling actually works. A bunch of
            random text to see if scrolling actually works. A bunch of random text
            to see if scrolling actually works.
        </Text>
          <Button
            buttonStyle={styles.size}
            title="Logout"
            onPress={this.logout}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  size: {
    backgroundColor: "rgba(92, 99,216, 1)",
    width: "100%",
    height: 50,
    borderWidth: 0,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10
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
