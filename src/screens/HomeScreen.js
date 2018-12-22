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
import { Card, SearchBar, Icon } from "react-native-elements";

import { TEXT_COLOR, pinkDarker, brown, pink } from "../constants/Colors";

import { createStackNavigator, NavigationActions } from "react-navigation";

import Panel from "../components/Panel";
import Story from "./Story";
import StoryForm from "../components/StoryForm";
import StoryCard from "../components/StoryCard";

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
      selectedLocation: {},
      stories: [],
      isAddStoryFormVisible: false,
      isSearchBarVisible: false,
      searchIconType: "search",
    };
    this.backupLocation = [];
  }

  componentDidMount() {
    newLocation = [];
    firestore
      .collection("locations")
      // .where("image", ">=", "")
      .get()
      .then((snapshot) => {
        (snapshot || []).forEach((doc) => {
          let tempLocation = doc.data();
          // Need to pass a key parameter to avoid warning
          tempLocation.key = doc.id;
          newLocation.push(tempLocation);
        });
        this.setState({
          locations: newLocation,
        });
        this.backupLocation = newLocation;
      })
      .catch((err) => {
        console.log("Error getting documents", err);
      });
  }

  onItemListClick = (item) => {
    this.setState({
      selectedLocation: item,
      isAddStoryFormVisible: false,
    });

    // let avatar;
    const p1 = firestore
      .collection("stories")
      .where("location", "==", item.title)
      .get()
      .then((snapshot) => {
        stories = [];
        (snapshot || []).forEach((doc) => {
          let story = doc.data();
          story.id = doc.id;
          stories.push(story);
        });
        return stories;
      })
      .then((stories) => {
        this.setState({ stories });
      });
  };

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

  addStory = (newStory) => {
    const tempStoryList = this.state.stories;
    tempStoryList.push(newStory);
    this.setState({
      stories: tempStoryList,
    });
  };

  filter(text) {
    let newLocations = this.backupLocation.filter((location) =>
      location.title.toLowerCase().includes(text.toLowerCase())
    );
    this.setState({
      locations: newLocations,
    });
  }

  toggleSearchBar() {
    if (this.state.isSearchBarVisible) {
      // hide the search bar
      this.setState({
        isSearchBarVisible: false,
        searchIconType: "search",
        // put back all the locations on the state
        locations: this.backupLocation,
      });
    } else {
      // Show the search bar
      this.setState({
        isSearchBarVisible: true,
        searchIconType: "close",
      });
    }
  }

  render() {
    console.log("Rendering...");

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          <View>
            {this.state.isSearchBarVisible ? (
              <View style={styles.searchBar}>
                <SearchBar
                  round
                  //lightTheme
                  showLoading
                  platform="android"
                  containerStyle={{ backgroundColor: "#442C2E" }}
                  inputStyle={{ backgroundColor: "white" }}
                  onChangeText={(text) => {
                    this.filter(text);
                  }}
                  placeholder="Location Name"
                />
              </View>
            ) : (
              <View />
            )}
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
                    <Image
                      style={styles.imgList}
                      source={{ uri: item.image }}
                    />
                    <Text adjustsFontSizeToFit style={styles.textList}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
            <Icon
              raised
              name={this.state.searchIconType}
              containerStyle={styles.searchButton}
              type="font-awesome"
              color="#442C2E"
              opacity={0.5}
              onPress={() => {
                this.toggleSearchBar();
              }}
            />
          </View>
          <View style={styles.locationDetail}>
            {this.state.isAddStoryFormVisible ? (
              // DISPLAY THE NEW STORY FORM
              <StoryForm
                location={this.state.selectedLocation.title}
                toggleDisplayForm={this.toggleFormDisplay}
                addStory={this.addStory}
              />
            ) : (
              // DISPLAY THE DESCRIPTION TEXT
              <View style={styles.storyContainer}>
                <Panel
                  style={styles.storyList}
                  title={this.state.selectedLocation.title}
                >
                  <Text style={styles.detailText}>
                    {this.state.selectedLocation.description}
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
                  {this.state.stories.length == 0 ? (
                    <Card
                      title={"No stories yet. Add one!"}
                      containerStyle={styles.storyCard}
                    />
                  ) : (
                    <View />
                  )}
                  {this.state.stories.map((story, index) => {
                    return (
                      <StoryCard
                        prevRoute="Home"
                        key={index}
                        story={story}
                        navigation={this.props.navigation}
                      />
                    );
                  })}

                  <Card containerStyle={styles.addCard}>
                    <TouchableOpacity
                      // style={styles.addCard}
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
    // backgroundColor: "#08708a",
    backgroundColor: "white",
    color: "#032B2F",
    flexDirection: "column",
  },

  searchButton: {
    opacity: 50,
    position: "absolute",
    top: 18,
    right: 0,
  },

  searchBar: {
    backgroundColor: "#442C2E",
    // opacity: 0.5,
    height: 80,
    paddingTop: 20,
    marginBottom: -40,
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
    color: "#442C2E",
    textAlign: "center",
  },

  // location Description
  addBtnText: {
    fontSize: 25,
    color: "gray",
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
    // flexDirection: "column",
    width: 150,
    height: 130,
    borderRadius: 20,
    alignItems: "center",
    elevation: 3,
    marginBottom: 5,
  },
  username: {
    marginLeft: 5,
    textAlign: "center",
    marginBottom: 25,
    fontWeight: "bold",
  },
  userTitle: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "nowrap",
  },
  addCard: {
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 130,
    borderRadius: 20,
    elevation: 3,
    marginBottom: 5,
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
