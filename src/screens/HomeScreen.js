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
  Animated,
  Easing,
  KeyboardAvoidingView,
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
      locationSelected: false,
      isImageSmall: false,
      imgListStyle: {},
      listKey: 1,
    };
    this.backupLocation = [];
    this.changeBigImage = this.changeBigImage.bind(this);
    this.changeSmallImage = this.changeSmallImage.bind(this);
  }

  componentDidMount() {
    firestore
      .collection("locations")
      // .where("image", ">=", "")
      .onSnapshot(
        (snapshot) => {
          const newLocation = [];
          (snapshot || []).forEach((doc) => {
            let tempLocation = doc.data();
            // Need to pass a key parameter to avoid warning
            tempLocation.key = doc.id;
            newLocation.push(tempLocation);
          });
          this.setState({
            locations: newLocation,
            imgListStyle: {
              height: Dimensions.get("window").height / 1.4,
              width: Dimensions.get("window").width / 1.5,
              borderRadius: 5,
              margin: 2,
            },
          });
          this.backupLocation = newLocation;
        },
        (err) => {
          console.log("Error getting documents", err);
        }
      );
    // .catch((err) => {
    //   console.log("Error getting documents", err);
    // });
  }

  changeBigImage = () => {
    this.setState({
      listKey: this.state.listKey++,
      locationSelected: false,
      isImageSmall: false,
      imgListStyle: {
        height: Dimensions.get("window").height / 1.4,
        width: Dimensions.get("window").width / 1.5,
        borderRadius: 5,
        margin: 2,
      },
    });
  };

  changeSmallImage = (item) => {
    // Animated.timing(this.animateToSmall, {
    //   toValue: 1,
    //   duration: 1000,
    //   easing: Easing.ease
    // }).start()
    this.setState({
      listKey: this.state.listKey++,
      imgListStyle: {
        height: Dimensions.get("window").height / 3,
        width: Dimensions.get("window").width / 1.5,
        borderRadius: 5,
        margin: 2,
      },
      isImageSmall: true,
      locationSelected: true,
      selectedLocation: item,
      isAddStoryFormVisible: false,
    });
  };

  onItemListClick = (item) => {
    if (
      this.state.selectedLocation &&
      this.state.selectedLocation.key === item.key &&
      this.state.isImageSmall
    ) {
      this.changeBigImage();
    } else {
      if (!this.state.isImageSmall) {
        this.changeSmallImage(item);
      } else {
        this.setState({
          isImageSmall: true,
          locationSelected: true,
          selectedLocation: item,
          isAddStoryFormVisible: false,
        });
      }
      firestore
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
          this.setState({ stories });
          return stories;
        });
    }
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

  componentDidUpdate() {
    if (this.state.isSearchBarVisible) {
      this.search.focus();
    }
  }

  render() {
    console.log("Homescreen Rendering...");
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          enabled
        >
          <View>
            {this.state.isSearchBarVisible ? (
              <View style={styles.searchBar}>
                <SearchBar
                  round
                  //lightTheme
                  showLoading
                  platform="android"
                  ref={(search) => (this.search = search)}
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
            {this.state.locations == 0 ? (
              // NO LOCATIONS
              <Image
                style={styles.noResult}
                resizeMode="contain"
                source={require("../../assets/images/no_results.png")}
              />
            ) : (
              <FlatList
                key={this.state.listKey}
                style={styles.locationList}
                horizontal={true}
                data={this.state.locations}
                keyExtractor={this._keyExtractor}
                extraData={this.state}
                // onScroll={() => this.changeBigImage()}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      key={index + this.state.listKey}
                      style={styles.locationItem}
                      onPress={() => {
                        this.onItemListClick(item);
                      }}
                    >
                      <Image
                        key={index + "_" + this.state.listKey}
                        style={this.state.imgListStyle}
                        source={{ uri: item.image }}
                      />
                      <Text
                        key={index + this.state.listKey}
                        adjustsFontSizeToFit
                        style={styles.textList}
                      >
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            )}
            <Icon
              raised
              name={this.state.searchIconType}
              containerStyle={styles.searchButton}
              reverse
              type="font-awesome"
              color="#442C2E"
              onPress={() => {
                this.toggleSearchBar();
              }}
            />
          </View>
          <ScrollView>
            <View style={styles.locationDetail}>
              {this.state.isAddStoryFormVisible ? (
                // DISPLAY THE NEW STORY FORM
                <StoryForm
                  location={this.state.selectedLocation.title}
                  toggleDisplayForm={this.toggleFormDisplay}
                  addStory={this.addStory}
                />
              ) : this.state.locationSelected ? (
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
                      <Card containerStyle={styles.noStoryCard}>
                        <Image
                          style={{
                            width: 120,
                            height: 110,
                          }}
                          resizeMode="cover"
                          source={require("../../assets/images/no_stories.png")}
                        />
                      </Card>
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
                    <TouchableOpacity
                      // style={styles.addCard}
                      onPress={() =>
                        this.setState({ isAddStoryFormVisible: true })
                      }
                    >
                      <Card containerStyle={styles.addCard}>
                        <Text style={styles.addBtnText}>+</Text>
                      </Card>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              ) : (
                <View>
                  {/* <Text style={styles.filler}>Choose a location</Text> */}
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
    marginBottom: -80,
  },
  noResult: {
    marginTop: 40,
    height: Dimensions.get("window").height / 2,
    width: Dimensions.get("window").width,
  },
  // Horizonthal locations list
  locationList: {
    paddingTop: 60,
    marginTop: 20,
  },
  storyList: {
    // paddingTop: 20,
  },
  locationItem: {
    padding: 6,
  },
  filler: {
    textAlign: "center",
    fontSize: 30,
    marginTop: 20,
  },
  imgList: {
    // height: Dimensions.get("window").height / 3,
    // width: Dimensions.get("window").width / 1.7,
    // height: Dimensions.get("window").height / 3,
    // width: Dimensions.get("window").width / 1.5,
    height: Dimensions.get("window").height / 1.4,
    width: Dimensions.get("window").width / 1.3,
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
    fontSize: 35,
    fontWeight: "bold",
    color: "#659ade",
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
  noStoryCard: {
    // flexDirection: "column",
    width: 150,
    height: 130,
    paddingTop: 10,
    borderRadius: 20,
    alignItems: "center",
    elevation: 3,
    marginBottom: 5,
  },
  //Story Form
  storyFormContainer: {
    paddingBottom: 120,
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
    // paddingTop: 10,
    paddingBottom: 50,
    minHeight: Dimensions.get("screen").height / 8,
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
