import React from "react";

import { Alert } from "react-native";
import { ImagePicker, Permissions } from "expo";

import firestore from "../utils/firestore";
import firebase from "../utils/firebaseClient";

// File to import to allow upload of the picure on the firebase storage
import { self } from "../utils/quick_fix.js";

uploadImage = async (uri, path, name) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  var ref = firebase
    .storage()
    .ref()
    .child(path + name + ".jpg");
  return ref.put(blob);
};

pickImage = async (path, name, state) => {
  // Request Gallery Permissions
  await Permissions.askAsync(Permissions.CAMERA_ROLL);
  // Gallery Image Picker
  let pickerResult = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [4, 3],
  });
  if (!pickerResult.cancelled) {
    console.log("Here is your URI:", pickerResult.uri);
    return pickerResult.uri;
  }
  return null;
};

takePhoto = async () => {
  // Request Camera  Permissions
  await Permissions.askAsync(Permissions.CAMERA);

  let pickerResult = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [16, 9],
  });

  if (!pickerResult.cancelled) {
    console.log("Local path to the picture:", pickerResult.uri);
    this.uploadImage(pickerResult.uri, path, name)
      .then((snapshot) => {
        console.log("Image correctly uploaded");
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log("Image available at", downloadURL);
          return downloadURL;
        });
      })
      .catch((e) => {
        console.log(e);
        return null;
      });
  }
};

imageDialog = (path, imgName) => {
  Alert.alert(
    "Upload an Image",
    "Pick a method:",
    [
      { text: "Select from Gallery", onPress: () => pickImage(path, imgName) },
      { text: "Take a picture", onPress: () => takePhoto(path, imgName) },
    ],
    { cancelable: true }
  );
};

module.exports = { uploadImage, takePhoto, pickImage, imageDialog };
