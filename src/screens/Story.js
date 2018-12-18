import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { Card, Button } from "react-native-elements";
import firestore from "../utils/firestore";
import firebase from "../utils/firebaseClient";
import { ScrollView } from "react-native-gesture-handler";

// const TEXT_COLOR = "#898989";
const TEXT_COLOR = "white";

export default class Location extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.navigation.state.params.username,
      profPic: this.props.navigation.state.params.profPic,
      title: this.props.navigation.state.params.title,
      story: this.props.navigation.state.params.story,
      image: this.props.navigation.state.params.image,
      // color: this.props.navigation.state.params.color,
    };
  }

  componentDidMount() {}

  render() {
    return (
      <View styles={styles.container}>
        <Card containerStyle={styles.cardContainer}>
          <ScrollView contentContainerStyle={styles.cardContent}>
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
  container: {
    backgroundColor: "red",
  },
  location: {
    paddingTop: 30,
    paddingBottom: 20,
  },
  textInput: {
    width: Dimensions.get("window").width - 50,
    height: 100,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#56b1bf",
    borderWidth: 0,
    borderRadius: 5,
  },
  detailImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 3,
    margin: 2,
  },

  detailTitle: {
    margin: 1,
    // fontSize: 25,
    textAlign: "center",
    color: TEXT_COLOR,
    fontWeight: "bold",
  },

  detailText: {
    // width: Dimensions.get("window").width - 20,
    // fontSize: 20,
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
    // width: Dimensions.get("screen").width - 30,
    marginTop: 30,
    backgroundColor: "#56b1bf",
    // backgroundColor: "white"
  },
  cardContent: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
});
