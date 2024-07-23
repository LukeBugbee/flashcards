// StudyScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import firestore from "@react-native-firebase/firestore";

export default function StudyScreen({ route }) {
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const { deckId } = route.params;

  useEffect(() => {
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
  }, [deckId]);

  const nextCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((currentCardIndex + 1) % cards.length);
  };

  const currentCard = cards[currentCardIndex];

  return (
    <View>
      {currentCard && (
        <>
          <Text>{currentCard.question}</Text>
          {showAnswer && <Text>{currentCard.answer}</Text>}
          <Button
            title={showAnswer ? "Next Card" : "Show Answer"}
            onPress={showAnswer ? nextCard : () => setShowAnswer(true)}
          />
        </>
      )}
    </View>
  );
}
