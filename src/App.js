// App.js
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";
import ProfileSetupScreen from "./screens/ProfileSetupScreen";
import DeckManagementScreen from "./screens/DeckManagementScreen";
import StudyScreen from "./screens/StudyScreen";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

// Configure GoogleSignin
GoogleSignin.configure({
  webClientId:
    "539764479921-g0e2gse7p0d6imdj1g5i8hk49tu8qlh6.apps.googleusercontent.comnp", // Get this from your Firebase project settings
});

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(setUser);
    return subscriber;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
            <Stack.Screen
              name="DeckManagement"
              component={DeckManagementScreen}
            />
            <Stack.Screen name="Study" component={StudyScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
