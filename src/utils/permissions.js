import { Permissions, Location } from 'expo';

export const getLocationPermission = async () => {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status != "granted") {
    console.log("Permission to access location was denied");
  } else {
    console.log("Permission to access location was granted");
  }
};