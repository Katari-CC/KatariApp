import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion, Circle } from 'react-native-maps';

export default class MapScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 35.708647,
      longitude: 139.729769,
      coordinate:
      {
        latitude: 35.708647,
        longitude: 139.729769
      },
      markers: [],
    };
    this.addMarker = this.addMarker.bind(this);
  }
  static navigationOptions = {
    title: "Map",
    header: null
  };

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
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={{
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.007,
        }}
      >
        <MapView.Marker coordinate={this.state.coordinate} >
          <View style={styles.currentLocation}>
          </View>
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
  }
});
