import {
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Animated,
  Dimensions,
} from "react-native";
import React from "react";
import { pink, brown } from "../constants/Colors";

class Panel extends React.Component {
  constructor(props) {
    super(props);

    this.icons = {
      up: require("../../assets/images/Arrowhead-Up.png"),
      down: require("../../assets/images/Arrowhead-Down.png"),
    };

    this.state = {
      title: props.title,
      expanded: true,
      animation: new Animated.Value(),
    };
  }

  toggle() {
    let initialValue = this.state.expanded
        ? this.state.maxHeight + this.state.minHeight
        : this.state.minHeight,
      finalValue = this.state.expanded
        ? this.state.minHeight
        : this.state.maxHeight + this.state.minHeight;

    this.setState({
      expanded: !this.state.expanded,
    });

    this.state.animation.setValue(initialValue);
    Animated.spring(this.state.animation, {
      toValue: finalValue,
    }).start();
  }

  _setMaxHeight(event) {
    this.setState({
      maxHeight: event.nativeEvent.layout.height,
    });
  }

  _setMinHeight(event) {
    this.setState({
      minHeight: event.nativeEvent.layout.height,
    });
  }

  render() {
    let icon = this.icons["down"];

    if (this.state.expanded) {
      icon = this.icons["up"];
    }

    return (
      <TouchableHighlight
        style={styles.button}
        onPress={this.toggle.bind(this)}
        underlayColor="#f1f1f1"
      >
        <Animated.View
          style={[styles.container, { height: this.state.animation }]}
        >
          <View
            style={styles.titleContainer}
            onLayout={this._setMinHeight.bind(this)}
          >
            <Text style={styles.title}>{this.props.title}</Text>

            <Image style={styles.buttonImage} source={icon} />
          </View>
          <View style={styles.body} onLayout={this._setMaxHeight.bind(this)}>
            {this.props.children}
          </View>
        </Animated.View>
      </TouchableHighlight>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    width: Dimensions.get("screen").width - 10,
    backgroundColor: "#FEEAE6",
    marginRight: 20,
    marginLeft: 20,
    overflow: "hidden",
    borderRadius: 5,
  },
  titleContainer: {
    flexDirection: "row",
  },
  title: {
    flex: 1,
    padding: 10,
    color: "#442C2E",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 25,
  },
  button: {},
  buttonImage: {
    width: 40,
    height: 40,
    borderColor: "transparent",
    marginRight: 20,
  },
  body: {
    padding: 10,
    paddingTop: 0,
    color: "#FEDBD0",
  },
});

export default Panel;
