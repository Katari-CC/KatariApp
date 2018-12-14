import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TextInput, 
  Image, 
  TouchableOpacity, 
} from 'react-native';
import { Card, Button } from "react-native-elements";
import firestore from "../utils/firestore";
import firebase from "../utils/firebaseClient";
import { ScrollView } from 'react-native-gesture-handler';

export default class Location  extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        stories: [],
        isAddStoryFormVisible: false,
        newStoryTitle: "",
        newStoryText: ""
      };
      this.saveNewStory = this.saveNewStory.bind(this);
    }
  
    componentDidMount() {
      newReviews = [];
      firestore
        .collection("stories")
        .where("location", "==", this.props.navigation.state.params.title)
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            newReviews.push(doc.data());
          });
        })
        .then(() => {
          this.setState({
            stories: newReviews
          });
        });
    }
  
    saveNewStory() {
      const newStory = {
        userID: firebase.auth().currentUser.uid,
        title: this.state.newStoryTitle,
        story: this.state.newStoryText,
        location: this.props.navigation.state.params.title
      };
      firestore
        .collection("stories")
        .doc()
        .set(newStory)
        .then(() => {
          this.setState({
            isAddStoryFormVisible: false,
            stories: [...this.state.stories, newStory]
          });
        });
    }
  
  
    render() {
      return (
      <ScrollView>
        <View style={styles.location}>
                <Text style={styles.detailTitle}>{this.props.navigation.state.params.title}</Text>
                {this.props.navigation.state.params.image !== undefined ? (
                  // display image only if exist
                  <Image
                    style={styles.detailImage}
                    source={{ uri: this.props.navigation.state.params.image }}
                  />
                ) : (
                    <View />
                  )}
                <Text style={styles.detailText}>
                  {this.props.navigation.state.params.description}
                </Text>
                <Button
                  title="Add your story"
                  onPress={() => {
                    this.setState({ isAddStoryFormVisible: true });
                  }}
                />
                {this.state.isAddStoryFormVisible ? (
                  // DISPLAY THE NEW STORY FORM
                  <View>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Put a title to your story"
                      onChangeText={text => this.setState({ newStoryTitle: text })}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Type here your story!"
                      onChangeText={text => this.setState({ newStoryText: text })}
                    />
                    <Button
                      title="Save your story"
                      onPress={() => {
                        this.saveNewStory();
                      }}
                    />
                  </View>
                ) : (
                    <View />
                  )}
                <View style={styles.storyContainer}>
                  {this.state.stories.map((story)=> {return <Card
                          title={story.title}
                          // image={{ uri: review.imageUrl }}
                          containerStyle={styles.storyCard}
                        >
                          <Text style={{ marginBottom: 10, textAlign: 'center' }}>{story.story}</Text>
                  </Card>})}
                </View>
              </View>
        </ScrollView>
      );
    }
  }

  const styles = StyleSheet.create({
    location: {
      paddingTop: 30,
      paddingBottom: 20,
    },
    textInput: {
      width: Dimensions.get("window").width - 50,
      height: 100
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
      margin: 2
    },
  
    detailTitle: {
      margin: 1,
      fontSize: 25,
      textAlign: "center",
      color: "#898989",
      fontWeight: "bold"
    },
  
    detailText: {
      width: Dimensions.get("window").width - 20,
      fontSize: 20,
      textAlign: "center",
      color: "#898989"
    },
    storyContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    storyCard: {
      width: 150,
      height: 120,
      borderRadius: 20,
    },
  });