// ProfileSetupScreen.js
import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export default function ProfileSetupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [classes, setClasses] = useState("");

  const saveProfile = async () => {
    const userId = auth().currentUser.uid;
    await firestore()
      .collection("users")
      .doc(userId)
      .set({
        name,
        school,
        classes: classes.split(",").map((c) => c.trim()),
      });
    navigation.navigate("Dashboard");
  };

  return (
    <View>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput placeholder="School" value={school} onChangeText={setSchool} />
      <TextInput
        placeholder="Classes (comma-separated)"
        value={classes}
        onChangeText={setClasses}
      />
      <Button title="Save Profile" onPress={saveProfile} />
    </View>
  );
}
