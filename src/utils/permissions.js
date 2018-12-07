import { Permissions, Location } from 'expo';

export const getLocationPermission = async () => {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  console.log(status);
};