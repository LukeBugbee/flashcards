import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function DeckManagementScreen() {
  const [deckName, setDeckName] = useState("");
  const [cards, setCards] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const { mode, deckId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchDeck = async () => {
      if (mode === "edit" && deckId && user) {
        try {
          const deckDoc = await getDoc(doc(db, "decks", deckId));
          if (deckDoc.exists()) {
            setDeckName(deckDoc.data().name);
          }
        } catch (error) {
          console.error("Error fetching deck: ", error);
        }
      }
    };

    const fetchCards = async () => {
      if (mode === "edit" && deckId && user) {
        try {
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
        } catch (error) {
          console.error("Error fetching cards: ", error);
        }
      }
      setLoading(false);
    };

    if (user) {
      fetchDeck();
      fetchCards();
    }
  }, [mode, deckId, user]);

  const saveDeck = async () => {
    if (!user) {
      console.error("No user is signed in");
      return;
    }

    try {
      let newDeckId;
      if (mode === "create") {
        const docRef = await addDoc(collection(db, "decks"), {
          name: deckName,
          creator: user.uid,
          createdAt: serverTimestamp(),
        });
        newDeckId = docRef.id;
      } else if (deckId) {
        const deckRef = doc(db, "decks", deckId);
        await updateDoc(deckRef, {
          name: deckName,
          updatedAt: serverTimestamp(),
        });
        newDeckId = deckId;
      } else {
        throw new Error("Invalid mode or deckId for editing");
      }
      navigate(`/deck-management/edit/${newDeckId}`);
    } catch (error) {
      console.error("Error saving deck: ", error);
    }
  };

  const addCard = async () => {
    if (!deckId && mode === "create") {
      alert("Please save the deck before adding cards.");
      return;
    }

    if (!user) {
      console.error("No user is signed in");
      return;
    }

    const newCard = {
      question,
      answer,
      deck: deckId,
      creator: user.uid,
      createdAt: serverTimestamp(),
    };
    try {
      const docRef = await addDoc(collection(db, "cards"), newCard);
      setCards([...cards, { ...newCard, id: docRef.id }]);
      setQuestion("");
      setAnswer("");
    } catch (error) {
      console.error("Error adding card: ", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to manage decks.</div>;
  }

  return (
    <div>
      <h2>{mode === "create" ? "Create New Deck" : "Edit Deck"}</h2>
      <input
        type="text"
        placeholder="Deck Name"
        value={deckName}
        onChange={(e) => setDeckName(e.target.value)}
      />
      <button onClick={saveDeck}>Save Deck</button>

      {mode === "edit" && (
        <>
          <h3>Add New Card</h3>
          <input
            type="text"
            placeholder="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <input
            type="text"
            placeholder="Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button onClick={addCard}>Add Card</button>

          <h3>Cards in this Deck</h3>
          <ul>
            {cards.map((item) => (
              <li key={item.id}>
                <p>Q: {item.question}</p>
                <p>A: {item.answer}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
