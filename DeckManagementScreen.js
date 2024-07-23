// DeckManagementScreen.js
import React, { useState, useEffect } from "react";
import { View, TextInput, Button, FlatList } from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export default function DeckManagementScreen({ route, navigation }) {
  const [deckName, setDeckName] = useState("");
  const [cards, setCards] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const { mode, deckId } = route.params;

  useEffect(() => {
    if (mode === "edit" && deckId) {
      // Fetch deck details and cards
      firestore()
        .collection("decks")
        .doc(deckId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setDeckName(doc.data().name);
          }
        });

      firestore()
        .collection("cards")
        .where("deck", "==", deckId)
        .get()
        .then((querySnapshot) => {
          const cardList = [];
          querySnapshot.forEach((doc) => {
            cardList.push({ id: doc.id, ...doc.data() });
          });
          setCards(cardList);
        });
    }
  }, [mode, deckId]);

  const saveDeck = async () => {
    const userId = auth().currentUser.uid;
    if (mode === "create") {
      await firestore().collection("decks").add({
        name: deckName,
        creator: userId,
      });
    } else {
      await firestore().collection("decks").doc(deckId).update({
        name: deckName,
      });
    }
    navigation.goBack();
  };

  const addCard = async () => {
    const newCard = {
      question,
      answer,
      deck: deckId,
      creator: auth().currentUser.uid,
    };
    await firestore().collection("cards").add(newCard);
    setCards([...cards, newCard]);
    setQuestion("");
    setAnswer("");
  };

  return (
    <View>
      <TextInput
        placeholder="Deck Name"
        value={deckName}
        onChangeText={setDeckName}
      />
      <Button title="Save Deck" onPress={saveDeck} />
      <TextInput
        placeholder="Question"
        value={question}
        onChangeText={setQuestion}
      />
      <TextInput placeholder="Answer" value={answer} onChangeText={setAnswer} />
      <Button title="Add Card" onPress={addCard} />
      <FlatList
        data={cards}
        renderItem={({ item }) => (
          <View>
            <Text>Q: {item.question}</Text>
            <Text>A: {item.answer}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
