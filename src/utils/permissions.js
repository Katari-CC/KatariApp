import { Permissions, Location } from "expo";

export const getLocationPermission = async () => {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status != "granted") {
    console.log("Permission to access location was denied");
  } else {
    console.log("Permission to access location was granted");
  }
};

export const getCameraPermission = async () => {
  let { status } = await Permissions.askAsync(Permissions.CAMERA);
  if (status != "granted") {
    console.log("Permission to access camera was denied");
  } else {
    console.log("Permission to access camera was granted");
  }
};

export const getCameraRollPermission = async () => {
  let { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status != "granted") {
    console.log("Permission to access camera was denied");
  } else {
    console.log("Permission to access camera was granted");
  }
};
