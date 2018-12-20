import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Image,
  Alert,
  TouchableOpacity,
  Modal,
  Picker,
} from "react-native";
import { Button, Icon } from "react-native-elements";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import { DEFAULT_MAP, ADD_LOCATION } from "../constants/MapLayout";
// import Svg from 'expo';
// const { Image } = Svg;
import firestore from "../utils/firestore";
import firebase from "../utils/firebaseClient";
import { NavigationActions } from "react-navigation";

export default class AddLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: this.props.navigation.state.params.region.latitude,
        longitude: this.props.navigation.state.params.region.longitude,
        latitudeDelta: this.props.navigation.state.params.region.latitudeDelta,
        longitudeDelta: this.props.navigation.state.params.region
          .longitudeDelta,
      },
      markers: [],
      modalVisible: false,
      categories: [
        "Entertainment",
        "Attractions",
        "Shopping",
        "Restaurants",
        "Nightlife",
        "Information",
        "Events",
        "Transportation",
      ],
      selectedCategory: undefined,
      newLocationTitle: undefined,
      newLocationDescription: undefined,
      newLocationImage:
        "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
    };
    this.onRegionChange = this.onRegionChange.bind(this);
    this.backToMap = this.backToMap.bind(this);
  }

  componentDidMount() {
    let markers = [];
    firestore
      .collection("locations")
      .get()
      .then((snapshot) => {
        (snapshot || []).forEach((doc) => {
          const marker = doc.data();
          marker["title"] = doc.id;
          marker["coordinate"] = {
            longitude: marker.longitude,
            latitude: marker.latitude,
          };
          markers.push(marker);
        });
        this.setState({
          markers,
        });
        this.forceUpdate();
      })
      .catch((err) => {
        console.log("Error getting documents", err);
      });
  }

  saveNewLocation() {
    if (
      !this.state.newLocationTitle ||
      !this.state.selectedCategory ||
      !this.state.newLocationDescription ||
      !this.state.newLocationImage
    ) {
      Alert.alert(
        "Missing some field(s)!",
        "Please make sure to fill everything out.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
    } else {
      const latitude = this.state.region.latitude;
      const longitude = this.state.region.longitude;
      const newLocation = {
        category: this.state.selectedCategory,
        latitude,
        longitude,
        description: this.state.newLocationDescription,
        image: this.state.newLocationImage,
        title: this.state.newLocationTitle,
      };
      firestore
        .collection("locations")
        .doc()
        .set(newLocation)
        .then((docRef) => {
          if (this.state.newStoryImageURI) {
            console.log("Story Created successfully, ID=>", docRef.id);
            uploadImage(this.state.newLocationImage, "/locations/", docRef.id)
              .then((snapshot) => {
                console.log("Image Uploaded Succesfully");
                snapshot.ref.getDownloadURL().then((downloadURL) => {
                  console.log("Image Available at: ", downloadURL);
                  this.addURL(downloadURL, docRef.id);
                });
              })
              .catch((e) => {
                console.log(e);
                return null;
              });
          }
          newLocation["coordinate"] = { latitude, longitude };
          this.setState({
            modalVisible: false,
            markers: [...this.state.markers, newLocation],
            selectedCategory: undefined,
            newLocationDescription: undefined,
            newLocationTitle: undefined,
            newLocationImage: undefined,
          });
        });
    }
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  backToMap() {
    this.props.navigation.state.params.onNavigateBack(
      this.state.region,
      this.state.markers
    );
    const navigateAction = NavigationActions.navigate({
      routeName: "Main",
    });
    this.props.navigation.dispatch(navigateAction);
  }

  addURL = (url, locationID) => {
    console.log("Update the url of the picture for location.");
    firestore
      .collection("locations")
      .doc(locationID)
      .update({ image: url })
      .then(() => {
        console.log("Update Successful");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  imageDialog = (path, imgName) => {
    Alert.alert(
      "Upload an Image with your story",
      "Pick a method:",
      [
        {
          text: "Select from Gallery",
          onPress: () => {
            pickImage()
              .then((picker) => {
                if (!picker.cancelled) {
                  console.log("Here is your URI:", picker.uri);
                  this.setState({
                    newLocationImage: picker.uri,
                  });
                }
              })
              .catch((e) => {
                console.log(e);
                return null;
              });
          },
        },
        {
          text: "Take a picture",
          onPress: () => {
            takePhoto()
              .then((picker) => {
                if (!picker.cancelled) {
                  console.log("Here is your URI:", picker.uri);
                  this.setState({
                    newLocationImage: picker.uri,
                  });
                }
              })
              .catch((e) => {
                console.log(e);
                return null;
              });
          },
        },
      ],
      { cancelable: true }
    );
  };

  render() {
    return (
      <View style={styles.map}>
        <Modal
          // animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({ modalVisible: false })}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.detailTitle}>Adding Location</Text>
            <TextInput
              containerStyle={styles.textInput}
              placeholder="Name of location:"
              onChangeText={(text) => this.setState({ newLocationTitle: text })}
            />
            <Picker
              selectedValue={this.state.selectedCategory}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ selectedCategory: itemValue })
              }
            >
              <Picker.Item
                key={-1}
                label="Select a Category"
                value={undefined}
              />
              {this.state.categories.map((category, index) => (
                <Picker.Item key={index} label={category} value={category} />
              ))}
            </Picker>
            <TextInput
              containerStyle={styles.textInput}
              placeholder="Enter a description about the location:"
              onChangeText={(text) =>
                this.setState({ newLocationDescription: text })
              }
            />
            <Button
              title="Provide an Image"
              buttonStyle={styles.button}
              onPress={() => {
                this.imageDialog();
              }}
            />

            {this.state.newLocationImage ? (
              <Image
                style={styles.imgStory}
                source={{ uri: this.state.newLocationImage }}
              />
            ) : (
              <Text>No image</Text>
            )}
            <Button
              title="Save location."
              onPress={() => {
                this.saveNewLocation();
              }}
            />
          </View>
        </Modal>

        <MapView
          ref={(MapView) => (this.MapView = MapView)}
          region={this.state.region}
          onRegionChangeComplete={this.onRegionChange}
          style={styles.map}
          loadingEnabled={true}
          loadingIndicatorColor="#666666"
          loadingBackgroundColor="#eeeeee"
          moveOnMarkerPress
          showsUserLocation
          showsCompass
          customMapStyle={DEFAULT_MAP}
          showsPointsOfInterest={false}
          provider={PROVIDER_GOOGLE}
        >
          {this.state.markers.map((marker, index) => {
            return (
              <MapView.Marker key={index} coordinate={marker.coordinate}>
                <Callout style={styles.callout}>
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
              </MapView.Marker>
            );
          })}
        </MapView>

        <View style={styles.addBtnPosition}>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={() => this.setState({ modalVisible: true })}
          >
            <Text style={styles.addBtnText}>✓</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.xBtnPosition}>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={() => this.backToMap()}
          >
            <Text style={styles.addBtnText}>x</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.centerPin}>
          <Icon name="md-pin" type="ionicon" size={40} color="#f00" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    marginTop: 10,
    width: Dimensions.get("window").width - 50,
    height: 100,
    borderWidth: 5,
  },
  button: {
    backgroundColor: "black",
    marginTop: 10,
    marginBottom: 10,
  },
  picker: {
    width: "60%",
  },
  circleButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#56b1bf",
    borderRadius: 100,
    width: 65,
    height: 65,
  },
  addBtnPosition: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  xBtnPosition: {
    zIndex: 3,
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  detailImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 3,
    margin: 2,
  },
  detailTitle: {
    margin: 1,
    fontSize: 25,
    textAlign: "center",
    color: "#898989",
    fontWeight: "bold",
  },
  container: {
    // flex: 1,
    width: 140,
    height: 60,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  centerPin: {
    zIndex: 3,
    position: "absolute",
    marginTop: -37,
    marginLeft: -11,
    left: "50%",
    top: "50%",
  },
  callout: {
    flex: 1,
    position: "relative",
    height: 150,
    borderRadius: 100,
  },
  title: {
    fontSize: 12,
  },
  addBtnText: {
    fontSize: 25,
    color: "white",
  },
  description: {
    marginLeft: 3,
    marginRight: 3,
    fontSize: 10,
  },
});
