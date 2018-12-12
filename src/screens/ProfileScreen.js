import React from "react";
import { ScrollView, View, Image, StyleSheet, ImagePicker } from "react-native";

import firebase from "../utils/firebaseClient";
import AppNavigator from "../navigation/AppNavigator";
import { FormLabel, FormInput, Text, Button } from "react-native-elements";
import "firebase/firestore";

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: "Profile",
    header: null
  };
  constructor(props) {
    super(props);
  }

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
    const db = firebase.firestore();
    console.log("test");
    console.log(firebase.auth());
    return (
      <ScrollView contentContainerStyle={styles.container}>
          <Text style>
            {"Welcome " + firebase.auth().currentUser.email + "!"}
          </Text>
          <Image source={require('../../assets/images/loading.gif')} />
          {/* <Image
            style={styles.avatar}
            resizeMode="cover"
            source={{
              uri:
                "https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg"
            }}
          /> */}

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
