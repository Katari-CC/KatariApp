import React from "react";
import { Platform, View, Text, StyleSheet } from "react-native";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  AnimatedRegion,
  Polyline,
  Callout
} from "react-native-maps";
import MapLayout from "../constants/MapLayout";
import { getLocationPermission } from "../utils/permissions";

const DEFAULT_LATITUDE = 35.708647;
const DEFAULT_LONGITUDE = 139.729769;
const LATITUDE_DELTA = 0.001;
const LONGITUDE_DELTA = 0.003;

export default class MapScreen extends React.Component {
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
      markers: []
    };
    this.addMarker = this.addMarker.bind(this);
    this.calcDistance = this.calcDistance.bind(this);
    this.getMapRegion = this.getMapRegion.bind(this);
  }

  componentDidMount() {
    getLocationPermission();
    // firestore
    //   .collection("locations")
    //   .get()
    //   .then(snapshot => {
    //     this.setState({
    //       locations: snapshot.docs
    //     });
    //   })
    //   .catch(err => {
    //     console.log("Error getting documents", err);
    //   });

    this.watchID = navigator.geolocation.watchPosition(
      position => {
        const { coordinate, routeCoordinates, distanceTravelled } = this.state;
        const { latitude, longitude } = position.coords;
        console.log("POSITION", position);
        const newCoordinate = {
          latitude,
          longitude
        };
        coordinate.timing(newCoordinate).start();

        this.setState({
          latitude,
          longitude,
          routeCoordinates: routeCoordinates.concat([newCoordinate])
        });
      },
      error => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  static navigationOptions = {
    title: "Map",
    header: null
  };

  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  });

  calcDistance = newLatLng => {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };

  //Add Marker function we can use later for adding
  addMarker(e) {
    this.setState({
      markers: [
        ...this.state.markers,
        {
          coordinate: e.nativeEvent.coordinate
        }
      ]
    });
  }
  render() {
    return (
      <MapView
        provider={PROVIDER_GOOGLE}
        customMapStyle={MapLayout}
        style={styles.map}
        showUserLocation
        followUserLocation
        loadingEnabled
        region={this.getMapRegion()}
      >
        <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} />
        <Marker.Animated
          ref={marker => {
            this.marker = marker;
          }}
          coordinate={this.state.coordinate}
        >
          <View style={styles.currentLocation} />
        </Marker.Animated>
        <MapView.Marker
          coordinate={{ latitude: 35.658226, longitude: 139.727757 }}
        >
          <Callout
            onPress={() => console.log("This will take you to location page.")}
          >
            <Text>Sensoji Temple</Text>
          </Callout>
        </MapView.Marker>

        {/* {this.state.markers.map((marker) => {
            return (
              <Marker {...marker} />
            )
          })} */}
      </MapView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  currentLocation: {
    borderRadius: 100,
    backgroundColor: "#339EFF",
    padding: 8,
    borderWidth: 3,
    borderColor: "#FFF"
  },
  marker: {
    backgroundColor: "#550bbc",
    padding: 5,
    borderRadius: 100
  }
});
