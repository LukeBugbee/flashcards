// DashboardScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList } from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export default function DashboardScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      firestore()
        .collection("users")
        .doc(currentUser.uid)
        .get()
        .then((documentSnapshot) => {
          if (documentSnapshot.exists) {
            setUser(documentSnapshot.data());
          } else {
            // User profile doesn't exist, redirect to profile setup
            navigation.navigate("ProfileSetup");
          }
        });
    }
  }, []);

  useEffect(() => {
    if (user) {
      // Fetch user's decks
      firestore()
        .collection("decks")
        .where("creator", "==", auth().currentUser.uid)
        .onSnapshot((querySnapshot) => {
          const deckList = [];
          querySnapshot.forEach((doc) => {
            deckList.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          setDecks(deckList);
        });
    }
  }, [user]);

  const renderDeck = ({ item }) => (
    <View>
      <Text>{item.name}</Text>
      <Button
        title="Study"
        onPress={() => navigation.navigate("Study", { deckId: item.id })}
      />
    </View>
  );

  return (
    <View>
      <Text>Welcome, {user?.name}</Text>
      <Button
        title="Create New Deck"
        onPress={() =>
          navigation.navigate("DeckManagement", { mode: "create" })
        }
      />
      <FlatList
        data={decks}
        renderItem={renderDeck}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
