import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";

import MapView, { Marker, Callout } from "react-native-maps";
import React from "react";
import { Card, Avatar, Divider } from "react-native-elements";

import firestore from "../utils/firestore";
import firebase from "../utils/firebaseClient";

class CustomMarker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isZoomed: props.isZoomed,
      image: props.image,
      coordinate: props.coordinate,
      isSelected: props.isSelected,
    };
  }

  render() {
    return (
      <MapView.Marker
        key={index}
        flat={true}
        coordinate={marker.coordinate}
        onPress={() => this.onMarkerPress(marker)}
      >
        {/* <Image style={styles.locationImage} source={{uri: marker.image}} /> */}
        <Avatar rounded source={{ uri: marker.image }} />
        {/* <Callout
              containerStyle={styles.callout}
              onPress={() => this.onMarkerPress(marker)}
            >
              <View style={styles.container}>
                <Text adjustsFontSizeToFit style={styles.title}>{marker.title}</Text>
                <Avatar
                  rounded
                  source={{ uri: marker.image }}
                /> 

                <Text style={styles.description}>{marker.description}</Text>
              </View>
            </Callout> */}
      </MapView.Marker>
    );
  }
}

var styles = StyleSheet.create({
  marker: {
    backgroundColor: "#550bbc",
    padding: 5,
    borderRadius: 5,
  },
  locationImage: {},
});

export default CustomMarker;
