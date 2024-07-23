// LoginScreen.js
import React from "react";
import { View, Button } from "react-native";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function LoginScreen() {
  const signInWithGoogle = async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Button title="Sign in with Google" onPress={signInWithGoogle} />
    </View>
  );
}
