import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Card, Button, Avatar, Icon } from "react-native-elements";
import firestore from "../utils/firestore";
import firebase from "../utils/firebaseClient";
import { ScrollView } from "react-native-gesture-handler";
import { createStackNavigator, NavigationActions } from "react-navigation";

// const TEXT_COLOR = "#898989";
const TEXT_COLOR = "white";

export default class Story extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.navigation.state.params.id,
      username: this.props.navigation.state.params.username,
      avatar: this.props.navigation.state.params.avatar,
      title: this.props.navigation.state.params.title,
      story: this.props.navigation.state.params.story,
      image: this.props.navigation.state.params.image,
      viewer: firebase.auth().currentUser.displayName,
      prevRoute: this.props.navigation.state.params.prevRoute,
      // color: this.props.navigation.state.params.color,
    };
    this.displayOptions = this.displayOptions.bind(this);
  }

  componentDidMount() {}

  backToMyStories = () => {
    // const navigateAction = NavigationActions.navigate({
    //   routeName: "Main",
    // });
    // this.props.navigation.dispatch(navigateAction);
    const navigateAction = NavigationActions.navigate({
      routeName: this.state.prevRoute,
    });
    this.props.navigation.dispatch(navigateAction);
  };

  displayOptions = () => {
    Alert.alert(
      "Options",
      "Choose an option:",
      [
        {
          text: "Edit Story",
          onPress: () => {
            console.log("Edit the story clicked.");
          },
        },
        {
          text: "Delete Story",
          onPress: () => {
            firestore
              .collection("stories")
              .doc(this.state.id)
              .delete()
              .then(function() {
                console.log("Document successfully deleted!");
              })
              .catch(function(error) {
                console.error("Error removing document: ", error);
              });
            this.props.navigation.state.params.handleDelete(this.state.id);
            const navigateAction = NavigationActions.navigate({
              routeName: this.state.prevRoute,
            });
            this.props.navigation.dispatch(navigateAction);
          },
        },
      ],
      { cancelable: true }
    );
  };

  render() {
    return (
      <View>
        <Card containerStyle={styles.cardContainer}>
          {this.state.viewer == this.state.username ? (
            <View style={{ left: 150 }}>
              <Icon
                name="md-settings"
                type="ionicon"
                color={"#442C2E"}
                onPress={() => this.displayOptions()}
                size={25}
              />
              <View style={{ right: 150 }}>
                <Icon
                  name="md-arrow-back"
                  onPress={() => {
                    this.backToMyStories();
                  }}
                  type="ionicon"
                  size={30}
                  color={"#442C2E"}
                />
              </View>
            </View>
          ) : (
            <View />
          )}

          <ScrollView contentContainerStyle={styles.cardContent}>
            <View
              style={{
                flex: 2,
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
                marginTop: 10,
              }}
            >
              <Avatar
                rounded
                containerStyle={styles.avatar}
                source={{ uri: this.props.navigation.state.params.avatar }}
              />
            </View>
            <Text adjustsFontSizeToFit style={styles.username}>
              {this.props.navigation.state.params.username}
            </Text>
            <Text adjustsFontSizeToFit style={styles.detailTitle}>
              {this.props.navigation.state.params.title}
            </Text>
            {this.props.navigation.state.params.image !== undefined ? (
              // display image only if exist
              <Image
                style={styles.detailImage}
                source={{ uri: this.props.navigation.state.params.image }}
              />
            ) : (
              <View />
            )}
            <Text adjustsFontSizeToFit style={styles.detailText}>
              {this.props.navigation.state.params.story}
            </Text>
          </ScrollView>
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  detailImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 3,
    margin: 2,
  },

  detailTitle: {
    margin: 1,
    textAlign: "center",
    color: TEXT_COLOR,
    fontWeight: "bold",
  },

  detailText: {
    textAlign: "center",
    color: TEXT_COLOR,
  },
  storyContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  storyCard: {
    width: 150,
    height: 120,
    borderRadius: 20,
  },
  cardContainer: {
    borderRadius: 20,
    height: Dimensions.get("screen").height - 130,
    marginTop: 10,
    backgroundColor: "#56b1bf",
  },
  cardContent: {
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  username: {
    color: TEXT_COLOR,
  },
  avatar: {},
  backBtn: {
    // right: 150,
    // marginTop: 10,
    // position: "absolute",
    bottom: 0,
    marginBottom: 8,
  },
});
