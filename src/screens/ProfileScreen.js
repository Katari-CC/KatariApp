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
  FlatList,
} from "react-native";
import ImageUploadModal from "../components/ImageUploadModal";

// File to import to allow upload of the picure on the firebase storage
import { self } from "../utils/quick_fix.js";

import firebase from "../utils/firebaseClient";
import AppNavigator from "../navigation/AppNavigator";

import { Text, Button } from "react-native-elements";
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
      modalVisible: false,
      currentUserEmail: "Not available",
      currentUserUID: "",
      currentUserImageURL: null,
      currentUserName: "Not available",
      stories: [{ title: "loading stories..." }],
      isAddStoryFormVisible: false,
      newStoryTitle: "",
      newStoryText: "",
    };
  }
  componentDidMount() {
    newReviews = [];

    firestore
      .collection("stories")
      .where("userID", "==", this.state.currentUserUID)
      .get()
      .then((snapshot) => {
        (snapshot || []).forEach((doc) => {
          newReviews.push(doc.data());
        });
      })
      .then(() => {
        this.setState({
          stories: newReviews,
        });
        console.log("stories=", this.state.stories);
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

  toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };

  updateProfileImage = (newProfileURL) => {
    this.setState({
      currentUserImageURL: newProfileURL,
    });
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
    if (this.state.modalVisible) {
      return (
        <ImageUploadModal
          goback={this.toggleModal}
          updateProfileImage={this.updateProfileImage}
        />
      );
    }
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={styles.username}>
            {"Welcome " + this.state.currentUserName + "!"}
          </Text>

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
          <FlatList
            data={this.state.stories}
            renderItem={({ item, index }) => {
              return (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text adjustsFontSizeToFit style={styles.textList}>
                    {item.title}
                  </Text>
                  <Text adjustsFontSizeToFit style={styles.textList}>
                    {item.location}
                  </Text>
                  <Text adjustsFontSizeToFit style={styles.textList}>
                    {item.story}
                  </Text>
                </View>
              );
            }}
          />

          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <StatusBar barStyle="default" />
          </View>

          <Button
            buttonStyle={styles.button}
            title="Change the profile picture"
            onPress={() => {
              this.toggleModal();
            }}
          />

          <Button
            buttonStyle={styles.button}
            title="Logout"
            onPress={this.logout}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  username: {
    fontWeight: "bold",
    marginTop: 50,
    justifyContent: "center",
    backgroundColor: "#d0d3c5",
    color: "#56b1bf",
    fontSize: 20,
  },
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
    marginBottom: 10,
  },
  textList: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
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
