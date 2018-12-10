import React from "react";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import Loading from "../authScreen/Loading";
import Login from "../authScreen/Login";
import SignUp from "../authScreen/SignUp";
import AddStory from "../components/AddStory";
import MainTabNavigator from "./MainTabNavigator";

const AppNavigator = createSwitchNavigator(
  {
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Loading,
    Login,
    SignUp,
    AddStory,
    Main: MainTabNavigator
  },
  { initialRouteName: "Loading" }
);
export default createAppContainer(AppNavigator);
