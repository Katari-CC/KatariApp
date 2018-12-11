import React from 'react';
import { Platform, View, Text, StyleSheet, FlatList, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion, Polyline, Callout } from 'react-native-maps';
import MapLayout from "../constants/MapLayout";
import { getLocationPermission } from '../utils/permissions';
import firestore from "../utils/firestore";
import { ScrollView } from 'react-native-gesture-handler';

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
      markers: [],
      currentMarker: undefined,
    };
    this.addMarker = this.addMarker.bind(this);
    this.getMapRegion = this.getMapRegion.bind(this);
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
    title: "Map",
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
        showsCompass={true}
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
              <Callout style={styles.callout} onPress={() => console.log(marker.image)}>
                <View style={styles.container}>
                  <Text style={styles.title}>{marker.title}</Text>
                    <Image
                        source={{uri: marker.image}}/>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    flexWrap: 'wrap',
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
  marker: {
    backgroundColor: "#550bbc",
    padding: 5,
    borderRadius: 100,
  },
  callout: {
    flex: 1, 
    position: 'relative', 
    height: 150,
    borderRadius: 70,
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
