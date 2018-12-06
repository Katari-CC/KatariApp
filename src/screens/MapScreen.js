import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

export default class MapScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lattitude: 35.708647,
      longitude: 139.729769,
      // coordinate: new AnimatedRegion({
      //   latitude: 35.708647,
      //   longitude: 139.729769
      // }),
    };
  }
  static navigationOptions = {
    title: "Map"
  };


  render() {
    //   this.watchID = navigator.geolocation.watchPosition(
    //     position => {
    //       const { coordinate, routeCoordinates, distanceTravelled } = this.state;
    //       const { latitude, longitude } = position.coords;

    //       const newCoordinate = {
    //         latitude,
    //         longitude
    //       };
    //       if (Platform.OS === "android") {
    //         if (this.marker) {
    //           this.marker._component.animateMarkerToCoordinate(
    //             newCoordinate,
    //             500
    //           );
    //         }
    //       } else {
    //         coordinate.timing(newCoordinate).start();
    //       }
    //       this.setState({
    //         latitude,
    //         longitude,
    //         routeCoordinates: routeCoordinates.concat([newCoordinate]),
    //         distanceTravelled:
    //           distanceTravelled + this.calcDistance(newCoordinate),
    //         prevLatLng: newCoordinate
    //       });
    //     },
    //     error => console.log(error),
    //     { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    //   );
    // }
    return (
      <View style={styles.container} >
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: 35.708647,
            longitude: 139.729769,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121
          }}
        />
      </View>
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
  }
});
