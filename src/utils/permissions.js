import { Permissions, Location } from 'expo';

export const getLocationAsync = async () => {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  console.log(status);
};