import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

export default class MapScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lattitude: 35.708647,
      longitude: 139.729769,
      coordinate: new AnimatedRegion({
        latitude: 35.708647,
        longitude: 139.729769
      }),
    };
  }
  static navigationOptions = {
    title: 'Map',
  };


  render() {

    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
