import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { ListItem } from "react-native-elements";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import { DEFAULT_MAP } from "../constants/MapLayout";
import { getLocationPermission } from "../utils/permissions";
// import Svg from 'expo';
// const { Image } = Svg;
import AddLocation from "./AddLocation";
import Location from "./Location";
import firestore from "../utils/firestore";
import firebase from "../utils/firebaseClient";
import { createStackNavigator, NavigationActions } from "react-navigation";

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
  }

  toAddLocation() {
    this.setState({ backed: true });
    const navigateAction = NavigationActions.navigate({
      routeName: "AddLocation",
      params: {
        region: this.state.region,
        onNavigateBack: this.handleOnNavigateBack,
      },
    });
    this.props.navigation.dispatch(navigateAction);
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
          customMapStyle={DEFAULT_MAP}
          showsPointsOfInterest={false}
          provider={PROVIDER_GOOGLE}
        >
          {this.state.markers.map((marker, index) => {
            return (
              <MapView.Marker key={index} coordinate={marker.coordinate}>
                <Callout
                  style={styles.callout}
                  onPress={() => this.onMarkerPress(marker)}
                >
                  <View style={styles.container}>
                    <Text style={styles.title}>{marker.title}</Text>

                    <Text style={styles.description}>{marker.description}</Text>
                  </View>
                </Callout>
              </MapView.Marker>
            );
          })}
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
    height: 60,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
    backgroundColor: "#550bbc",
    padding: 5,
    borderRadius: 100,
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
