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

import StoryCard from "../components/StoryCard";
import { Text, Button, Card } from "react-native-elements";
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
      stories: [],
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
          [AppNavigator.getRoute("Start")],
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
      <View style={styles.container}>
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
        <ScrollView
          style={styles.storyList}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          removeClippedSubviews
          bounce={true}
          overScrollMode="always"
          centerContent={true}
        >
          {this.state.stories &&
            this.state.stories.map((story, index) => {
              return (
                <StoryCard
                  key={index}
                  story={story}
                  navigation={this.props.navigation}
                />
              );
            })}
          {!this.state.stories ? (
            <Card
              title={"No stories yet. Add one!"}
              containerStyle={styles.storyCard}
            />
          ) : (
            <View />
          )}
        </ScrollView>
        {/* <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <StatusBar barStyle="default" />
          </View> */}

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
