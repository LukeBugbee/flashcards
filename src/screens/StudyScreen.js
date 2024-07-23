// StudyScreen.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase"; // Adjust the path as needed
import { collection, query, where, getDocs } from "firebase/firestore";

export default function StudyScreen() {
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  const { deckId } = useParams();

  useEffect(() => {
    async function fetchCards() {
      setLoading(true);
      const cardsQuery = query(
        collection(db, "cards"),
        where("deck", "==", deckId)
      );
      const querySnapshot = await getDocs(cardsQuery);
      const cardList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCards(cardList);
      setLoading(false);
    }

    fetchCards();
  }, [deckId]);

  const nextCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const currentCard = cards[currentCardIndex];

  if (loading) {
    return <div>Loading cards...</div>;
  }

  if (cards.length === 0) {
    return <div>No cards found in this deck.</div>;
  }

  return (
    <div>
      {currentCard && (
        <>
          <h2>Question:</h2>
          <p>{currentCard.question}</p>
          {showAnswer && (
            <>
              <h2>Answer:</h2>
              <p>{currentCard.answer}</p>
            </>
          )}
          <button onClick={showAnswer ? nextCard : () => setShowAnswer(true)}>
            {showAnswer ? "Next Card" : "Show Answer"}
          </button>
        </>
      )}
    </div>
  );
}
