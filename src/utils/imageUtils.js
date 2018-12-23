import React from "react";

import { Alert } from "react-native";
import { ImagePicker, Permissions, ImageManipulator } from "expo";

import firestore from "../utils/firestore";
import firebase from "../utils/firebaseClient";

// File to import to allow upload of the picure on the firebase storage
import { self } from "../utils/quick_fix.js";

uploadImage = async (uri, path, name) => {
  const resizedImageURI = await ImageManipulator.manipulateAsync(
    uri,
    [
      {
        resize: { height: 394, width: 700 },
      },
    ],
    { format: "jpg" }
  );
  console.log("Resized Img URL:", resizedImageURI);
  const response = await fetch(resizedImageURI.uri);
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
    aspect: [16, 9],
  });
  return pickerResult;
};

takePhoto = async () => {
  // Request Camera  Permissions
  await Permissions.askAsync(Permissions.CAMERA);

  let pickerResult = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [16, 9],
  });
  return pickerResult;
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
