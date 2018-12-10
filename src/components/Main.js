import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ScrollView,
  Picker,
  Card,
  View
} from "react-native";
import Story from "./Story";
import firestore from "../utils/firestore";
import "firebase/firestore";
import ModalDropdown from "react-native-modal-dropdown";

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      storyArray: [],
      selectedLocation: "",
      storyTitle: "",
      storyText: "",
      refreshing: false,
      locationList: [],
      storyType: "",
      story_img_url: ""
    };
  }

  componentDidMount() {
    firestore
      .collection("locations")
      .get()
      .then(snapshot => {
        this.setState({
          locations: snapshot.docs
        });
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });

    this.state.locations.map(obj => this.setState({ locationList: obj.id }));
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  };

  addStory = () => {
    if (this.state.storyText) {
      const d = new Date();
      this.state.storyArray.push({
        date: d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate(),
        location: this.state.selectedLocation,
        type: this.state.storyType,
        url: this.state.story_img_url,
        title: this.state.storyTitle,
        story: this.state.storyText
      });
      this.setState({ storyArray: this.state.storyArray });
      this.setState({ storyText: this.state.storyArray.story });
    }
  };

  deleteStory = key => {
    this.state.storyArray.splice(key, 1);
    this.setState({ storyArray: this.state.storyArray });
  };

  render() {
    const stories = this.state.storyArray.map((val, key) => {
      return (
        <Story
          key={key}
          keyval={key}
          val={val}
          deleteMethod={() => this.deleteStory(key)}
        />
      );
    });

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}> - STORIES - </Text>
        </View>

        <ScrollView style={styles.scrollContainer}>
          <FlatList
            data={this.state.locations}
            renderItem={({ item }) => <Text>{item.id}</Text>}
          />
          {stories}
        </ScrollView>
        <View style={styles.footer}>
          <TextInput
            style={styles.textInputTitle}
            onChangeText={selectedLocation =>
              this.setState({ selectedLocation })
            }
            value={this.state.selectedLocation}
            placeholder="location..."
            placeholderTextColor="gray"
            underlineColorAndroid="transparent"
          />
          <TextInput
            style={styles.textInputTitle}
            onChangeText={storyTitle => this.setState({ storyTitle })}
            value={this.state.storyTitle}
            placeholder="title..."
            placeholderTextColor="gray"
            underlineColorAndroid="transparent"
          />
          <TextInput
            style={styles.textInputTitle}
            onChangeText={storyType => this.setState({ storyType })}
            value={this.state.storyType}
            placeholder="story category"
            placeholderTextColor="gray"
            underlineColorAndroid="transparent"
          />
          <TextInput
            style={styles.textInputTitle}
            onChangeText={story_img_url => this.setState({ story_img_url })}
            value={this.state.story_img_url}
            placeholder="image url"
            placeholderTextColor="gray"
            underlineColorAndroid="transparent"
          />

          <TextInput
            style={styles.textInput}
            onChangeText={storyText => this.setState({ storyText })}
            value={this.state.storyText}
            placeholder="Write your story here!"
            placeholderTextColor="gray"
            underlineColorAndroid="transparent"
          />
        </View>
        <TouchableOpacity onPress={this.addStory} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    backgroundColor: "#4abdac",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 10,
    borderBottomColor: "#efefef"
  },
  headerText: {
    color: "#efefef",
    fontWeight: "bold",
    fontSize: 18,
    padding: 26
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 100
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10
  },
  textInputTitle: {
    alignSelf: "stretch",
    color: "#efefef",
    padding: 20,
    backgroundColor: "#dfdce3",
    borderTopWidth: 4,
    borderTopColor: "#fc4a1a",
    fontWeight: "bold"
  },
  textInput: {
    alignSelf: "stretch",
    color: "#efefef",
    padding: 30,
    backgroundColor: "#dfdce3",
    borderTopWidth: 4,
    borderTopColor: "#fc4a1a",
    fontWeight: "bold"
  },
  addButton: {
    position: "absolute",
    zIndex: 11,
    right: 20,
    bottom: 90,
    backgroundColor: "#f7b733",
    width: 90,
    height: 90,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8
  },
  addButtonText: {
    color: "#efefef",
    fontSize: 24,
    fontWeight: "bold"
  }
});
