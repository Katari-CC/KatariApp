import React from "react";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import Loading from "../authScreen/Loading";
import Start from "../authScreen/Start";
import Login from "../authScreen/Login";
import SignUp from "../authScreen/SignUp";
import MainTabNavigator from "./MainTabNavigator";

const AppNavigator = createSwitchNavigator(
  {
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Loading,
    Start,
    Login,
    SignUp,
    Main: MainTabNavigator,
  },
  { initialRouteName: "Loading" }
);
export default createAppContainer(AppNavigator);
