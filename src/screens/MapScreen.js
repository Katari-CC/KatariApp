import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-elements";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
// import MapView from "@bam.tech/react-native-component-map-clustering";
import { DEFAULT_MAP } from "../constants/MapLayout";
import { getLocationPermission } from "../utils/permissions";
// import Svg from 'expo';
import AddLocation from "./AddLocation";
import Location from "./Location";
import firestore from "../utils/firestore";
import firebase from "../utils/firebaseClient";
import { createStackNavigator, NavigationActions } from "react-navigation";
import CustomMarker from "../components/CustomMarker.js";

const DEFAULT_LATITUDE = 30.822279;
const DEFAULT_LONGITUDE = 163.016783;
const LATITUDE_DELTA = 0.001;
const LONGITUDE_DELTA = 0.003;

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // coordinate: new AnimatedRegion({
      //   latitude: DEFAULT_LATITUDE,
      //   longitude: DEFAULT_LONGITUDE
      // }),
      markers: [],
      visibleMarkers: [],
      region: {
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      backed: false,
    };
    this.onMarkerPress = this.onMarkerPress.bind(this);
    this.toAddLocation = this.toAddLocation.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
    this.handleOnNavigateBack = this.handleOnNavigateBack.bind(this);
    this.renderMarkers = this.renderMarkers.bind(this);
  }

  componentDidMount() {
    getLocationPermission();
    let markers = [];
    firestore
      .collection("locations")
      .get()
      .then((snapshot) => {
        (snapshot || []).forEach((doc) => {
          const marker = doc.data();
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

    const options = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000,
    };

    function error(err) {
      // error callback
      console.error(err);
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const region = {
          latitude,
          longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        this.setState({ region });
      },
      () => console.error(err),
      options
    );

    //KEEP THE CODE BELOW WE MIGHT NEED IT
    // this.watchID = navigator.geolocation.watchPosition(
    //   position => {
    //     const { coordinate } = this.state;
    //     const { latitude, longitude } = position.coords;
    //     const newCoordinate = {
    //       latitude,
    //       longitude
    //     };
    //     coordinate.timing(newCoordinate).start();

    //     this.setState({
    //       latitude,
    //       longitude,
    //     });
    //   },
    //   error => console.log(error),
    //   { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    // );

    this.renderMarkers();
  }

  toAddLocation() {
    this.setState({ backed: true });
    const navigateAction = NavigationActions.navigate({
      routeName: "AddLocation",
      params: {
        markers: this.state.markers,
        region: this.state.region,
        onNavigateBack: this.handleOnNavigateBack,
      },
    });
    this.props.navigation.dispatch(navigateAction);
  }

  renderMarkers() {
    const region = this.state.region;
    const min = {
      latitude: region.latitude - region.latitudeDelta / 1.5,
      longitude: region.longitude - region.longitudeDelta / 1.5,
    };
    const max = {
      latitude: region.latitude + region.latitudeDelta / 1.5,
      longitude: region.longitude + region.longitudeDelta / 1.5,
    };
    const visibleMarkers = [];
    const markers = this.state.markers.map((marker, index) => {
      marker.isVisible = false;
      if (
        marker.coordinate.latitude <= max.latitude &&
        marker.coordinate.latitude >= min.latitude
      ) {
        if (
          marker.coordinate.longitude <= max.longitude &&
          marker.coordinate.longitude >= min.longitude
        ) {
          marker.isVisible = true;
          visibleMarkers.push(marker);
        }
      }
      return marker;
    });
    console.log(
      "VISIBLE MARKERS",
      visibleMarkers.map((marker) => marker.title)
    );
    this.setState({ markers });
  }

  onMarkerPress(marker) {
    console.log("Marker Pressed.", marker);
    const navigateAction = NavigationActions.navigate({
      routeName: "Location",
      params: {
        title: marker.title,
        image: marker.image,
        description: marker.description,
      },
    });
    this.props.navigation.dispatch(navigateAction);
  }

  onRegionChange(region) {
    this.renderMarkers();
    this.setState({ region });
  }

  handleOnNavigateBack(region, markers) {
    this.setState({ region, markers });
  }

  render() {
    return (
      <View style={styles.map}>
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
          // clustering={true}
          customMapStyle={DEFAULT_MAP}
          showsPointsOfInterest={false}
          provider={PROVIDER_GOOGLE}
        >
          {this.state.markers.map((marker, index) => {
            if (marker.isVisible) {
              index++;
              return (
                <CustomMarker
                  key={index}
                  isVisible={true}
                  id={index}
                  marker={marker}
                  onMarkerPress={this.onMarkerPress}
                  // isZoomed={this.isMapZoomed(this.state.region)}
                />
              );
            }
          })}

          {/* <MapView.Marker
                  key={index}
                  flat={true}
                  coordinate={marker.coordinate}
                  // onPress={() => this.onMarkerPress(marker)}
                >
                  <Callout
                    containerStyle={styles.callout}
                    onPress={() => this.onMarkerPress(marker)}
                  >
                    <View style={styles.container}>
                      <Text adjustsFontSizeToFit style={styles.title}>
                        {marker.title}
                      </Text>
                      <Image
                        style={styles.locationImage}
                        source={{ uri: marker.image }}
                      />

                      <Text style={styles.description}>
                        {marker.description}
                      </Text>
                    </View>
                  </Callout>
                </MapView.Marker> */}
        </MapView>
        <View style={styles.addBtnPosition}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              this.toAddLocation();
            }}
          >
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  addButton: {
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
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#56b1bf",
    borderWidth: 0,
    borderRadius: 5,
  },
  container: {
    // flex: 1,
    width: 140,
    height: 200,

    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
    justifyContent: "center",
    alignItems: "center",
    width: "30%",
    paddingLeft: 0,
    paddingBottom: 5,
    paddingTop: 5,
    backgroundColor: "white",
    borderRadius: 100,
  },
  // locationImage: {
  //   resizeImage: "contain",
  // },
  callout: {
    flex: 1,
    position: "relative",
    height: 150,
    borderRadius: 100,
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

const MapScreen = createStackNavigator(
  {
    Main: { screen: Main },
    Location: {
      screen: Location,
      navigationOptions: () => ({
        backBehavior: "initialRoute",
      }),
    },
    AddLocation: {
      screen: AddLocation,
      navigationOptions: () => ({
        backBehavior: "none",
      }),
    },
  },
  {
    initialRouteName: "Main",
    headerMode: "none",
  }
);
MapScreen.navigationOptions = {
  header: null,
};
export default MapScreen;
