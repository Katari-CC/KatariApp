import React from 'react';
import { Platform, View, Text, StyleSheet, FlatList, Dimensions, TextInput, Image } from 'react-native';
import { ListItem, Button, Card } from "react-native-elements";
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion, Polyline, Callout } from 'react-native-maps';
import MapLayout from "../constants/MapLayout";
import { getLocationPermission } from '../utils/permissions';
// import Svg from 'expo';
// const { Image } = Svg;
import firestore from "../utils/firestore";
import firebase from "../utils/firebaseClient";
import { ScrollView } from 'react-native-gesture-handler';
import { createStackNavigator, NavigationActions } from 'react-navigation';

const DEFAULT_LATITUDE = 35.708647;
const DEFAULT_LONGITUDE = 139.729769;
const LATITUDE_DELTA = 0.001;
const LONGITUDE_DELTA = 0.003;

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: DEFAULT_LATITUDE,
      longitude: DEFAULT_LONGITUDE,
      routeCoordinates: [],
      coordinate: new AnimatedRegion({
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE
      }),
      markers: [],
    };
    this.addMarker = this.addMarker.bind(this);
    this.getMapRegion = this.getMapRegion.bind(this);
    this.onMarkerPress = this.onMarkerPress.bind(this);
  }

  componentDidMount() {
    getLocationPermission();
    let markers = [];
    firestore
      .collection("locations")
      .get()
      .then(snapshot => {
        snapshot.forEach((doc) => {
          const marker = doc.data();
          marker["title"] = doc.id;
          marker["coordinate"] = { longitude: marker.longitude, latitude: marker.latitude }
          markers.push(marker);
        })
        this.setState({
          markers
        });
        this.forceUpdate();
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
    this.watchID = navigator.geolocation.watchPosition(
      position => {
        const { coordinate } = this.state;
        const { latitude, longitude } = position.coords;
        const newCoordinate = {
          latitude,
          longitude
        };
        coordinate.timing(newCoordinate).start();

        this.setState({
          latitude,
          longitude,
        });
      },
      error => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  static navigationOptions = {
    header: null
  };

  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  });

  //Add Marker function we can use later for adding
  addMarker(e) {
    this.setState({
      markers: [
        ...this.state.markers,
        {
          coordinate: e.nativeEvent.coordinate
        }
      ],

    })
  }

  onMarkerPress(marker) {
    console.log("Marker Pressed.", marker)
    const navigateAction = NavigationActions.navigate({
      routeName: 'Location',
      params: {
        title: marker.title,
        image: marker.image,
        description: marker.description
      }
  })
  this.props.navigation.dispatch(navigateAction);
  }

  render() {
    return (
        <MapView
        ref={MapView => (this.MapView = MapView)}
        region={this.getMapRegion()}
        style={styles.map}
        initialRegion={this.state.region}
        loadingEnabled={true}
        loadingIndicatorColor="#666666"
        loadingBackgroundColor="#eeeeee"
        moveOnMarkerPress
        showsUserLocation
        showsCompass
        customMapStyle={MapLayout}
        showsPointsOfInterest={false}
        // onPress={this.addMarker}
        provider={PROVIDER_GOOGLE}>
        {this.state.markers.map((marker, index) => {
          return (
            <MapView.Marker
              key={index}
              coordinate={marker.coordinate}
            >
              <Callout style={styles.callout} onPress={() => this.onMarkerPress(marker)}>
              <View style={styles.container}>
                <Text style={styles.title}>{marker.title}</Text>
                {/* <Svg width={50} height={50}>
                    <Image
                        href={{uri: marker.image}}
                        width={50} height={50} />
                </Svg> */}
                <Text style={styles.description}>{marker.description}</Text>
              </View> 
              </Callout>
            </MapView.Marker>)
        })
        }
      </MapView>
    );
  }
}

class Location  extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stories: [],
      isAddStoryFormVisible: false,
      newStoryTitle: "",
      newStoryText: ""
    };
    this.saveNewStory = this.saveNewStory.bind(this);
    this.backToMap = this.backToMap.bind(this);
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

  static navigationOptions = {
    // title: `${this.props.navigation.state.params.title`,
    header: null,
    headerMode: 'none'
  };

  backToMap() {
      const navigateAction = NavigationActions.navigate({
        routeName: 'Map',
        params: {
          
        }
    })
    this.props.navigation.dispatch(navigateAction);
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
              <Button
                title="Back"
                style={styles.backButton}
                onPress={() => {
                  this.backToMap();
                }}
              />
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
  backButton: {
    width: Dimensions.get("window").width / 5,
    fontSize: 22,
    fontWeight: "bold",
    color: "#0061ff"
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

  container: {
    // flex: 1,
    width: 140, height: 60,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: "#fff"
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  currentLocation: {
    borderRadius: 100,
    backgroundColor: "#339EFF",
    padding: 8,
    borderWidth: 3,
    borderColor: "#FFF",
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
  marker: {
    backgroundColor: "#550bbc",
    padding: 5,
    borderRadius: 100,
  },
  callout: {
    flex: 1, 
    position: 'relative', 
    height: 150,
    borderRadius: 100,
    textAlign: 'center'
  },
  title: {
    fontSize: 12,
  },
  description: {
    marginLeft: 3,
    marginRight: 3,
    fontSize: 10,
  }
});

const MapScreen = createStackNavigator({
  Map: { screen: Map },
  Location: { screen: Location },
}, {initialRouteName: 'Map', headerMode: 'none'});
export default MapScreen;