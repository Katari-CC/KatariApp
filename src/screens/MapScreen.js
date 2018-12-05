import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion } from 'react-native-maps';

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
      }
      ,
    };
  }
  static navigationOptions = {
    title: 'Map',
  };


  render() {

    return (
      <View style={styles.container} >
        <Text>{JSON.stringify(this.state)}</Text>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.010,
            longitudeDelta: 0.009,
          }}
        >
          <MapView.Marker coordinate={this.state.coordinate} />
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
