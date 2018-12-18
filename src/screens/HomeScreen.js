import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Card } from "react-native-elements";

import { TEXT_COLOR } from "../constants/Colors";

import { createStackNavigator, NavigationActions } from "react-navigation";

import Panel from "../components/Panel";
import Story from "./Story";
import StoryForm from "../components/StoryForm";

import firestore from "../utils/firestore";
import firebase from "../utils/firebaseClient";

class Home extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      detail: {},
      detailReviews: [],
      isListVisible: true,
      isAddStoryFormVisible: false,
      isSelected: false,
    };
    this.onStoryPress = this.onStoryPress.bind(this);
  }

  componentDidMount() {
    newLocation = [];
    firestore
      .collection("locations")
      // .where("image", ">=", "")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          newLocation.push(doc.data());
        });
        this.setState({
          locations: newLocation,
        });
      })
      .catch((err) => {
        console.log("Error getting documents", err);
      });
  }

  onItemListClick = (item) => {
    this.setState({
      detail: item,
      isAddStoryFormVisible: false,
    });
    newReviews = [];
    firestore
      .collection("stories")
      .where("location", "==", item.title)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          newReviews.push(doc.data());
        });
      })
      .then(() => {
        this.setState({
          isSelected: true,
          detailReviews: newReviews,
        });
      });
  };

  onStoryPress(story) {
    const navigateAction = NavigationActions.navigate({
      routeName: "Story",
      params: {
        title: story.title,
        story: story.story,
        username: "",
        profPic: "",
        image: story.image,
      },
    });
    this.props.navigation.dispatch(navigateAction);
  }

  uploadImage = async (uri, path, name) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    var ref = firebase
      .storage()
      .ref()
      .child(path + name + ".jpg");
    return ref.put(blob);
  };

  toggleFormDisplay = () => {
    this.setState({ isAddStoryFormVisible: !this.state.isAddStoryFormVisible });
  };

  render() {
    console.log("Rendering...");

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          <FlatList
            style={styles.locationList}
            horizontal={true}
            data={this.state.locations}
            keyExtractor={this._keyExtractor}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.locationItem}
                  onPress={() => {
                    this.onItemListClick(item);
                  }}
                >
                  <Image style={styles.imgList} source={{ uri: item.image }} />
                  <Text adjustsFontSizeToFit style={styles.textList}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
          <View style={styles.locationDetail}>
            {this.state.isAddStoryFormVisible ? (
              // DISPLAY THE NEW STORY FORM
              <StoryForm
                locationID={this.state.detail.id}
                toggleDisplayForm={this.toggleFormDisplay}
              />
            ) : (
              <View style={styles.storyContainer}>
                <Panel style={styles.storyList} title={this.state.detail.title}>
                  <Text style={styles.detailText}>
                    {this.state.detail.description}
                  </Text>
                </Panel>
                <ScrollView
                  style={styles.storyList}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  removeClippedSubviews
                  bounce={true}
                  overScrollMode="always"
                  centerContent={true}
                >
                  {this.state.detailReviews.length == 0 ? (
                    <Card
                      title={"No stories yet. Add one!"}
                      containerStyle={styles.storyCard}
                    />
                  ) : (
                    <View />
                  )}
                  {this.state.detailReviews.map((story, index) => {
                    return (
                      <Card
                        key={index}
                        title={story.username}
                        // image={{ uri: review.imageUrl }}
                        containerStyle={styles.storyCard}
                      >
                        <TouchableOpacity
                          style={styles.storyCard}
                          onPress={() => this.onStoryPress(story)}
                        >
                          <Text style={styles.description}>{story.title}</Text>
                        </TouchableOpacity>
                      </Card>
                    );
                  })}

                  <Card containerStyle={styles.addCard}>
                    <TouchableOpacity
                      style={styles.addCard}
                      onPress={() =>
                        this.setState({ isAddStoryFormVisible: true })
                      }
                    >
                      <Text style={styles.addBtnText}>+</Text>
                    </TouchableOpacity>
                  </Card>
                </ScrollView>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  // main Container (ScrollView)
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#08708a",
    // backgroundColor: "white",
    color: "#032B2F",
    flexDirection: "column",
  },

  // Horizonthal locations list
  locationList: {
    paddingTop: 40,
  },
  storyList: {
    paddingTop: 20,
  },
  locationItem: {
    padding: 6,
  },

  imgList: {
    height: Dimensions.get("window").height / 3,
    width: Dimensions.get("window").width / 1.7,
    borderRadius: 5,
    margin: 2,
  },

  textList: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },

  // location Description
  addBtnText: {
    fontSize: 25,
    color: "black",
  },

  detailText: {
    fontSize: 16,
    textAlign: "center",
    color: TEXT_COLOR,
    padding: 5,
  },

  // Stories list
  storyContainer: {
    flexDirection: "column",
    alignItems: "center",
    // flexWrap: "wrap",
  },
  storyCard: {
    width: 150,
    height: 120,
    borderRadius: 20,
  },
  addCard: {
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 120,
    borderRadius: 20,
  },
  locationDetail: {
    paddingTop: 10,
    paddingBottom: 20,
    minHeight: Dimensions.get("screen").height / 2 - 20,
  },

  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20,
  },
});

const HomeScreen = createStackNavigator(
  {
    Home: { screen: Home },
    Story: {
      screen: Story,
      navigationOptions: () => ({
        backBehavior: "initialRoute",
      }),
    },
  },
  {
    initialRouteName: "Home",
    headerMode: "none",
  }
);
HomeScreen.navigationOptions = {
  header: null,
};
export default HomeScreen;
