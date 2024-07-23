import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase"; // Adjust the path as needed
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";

export default function DashboardScreen() {
  const [user, setUser] = useState(null);
  const [decks, setDecks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);
      getDoc(userDocRef).then((documentSnapshot) => {
        if (documentSnapshot.exists()) {
          setUser(documentSnapshot.data());
        } else {
          // User profile doesn't exist, redirect to profile setup
          navigate("/profile-setup");
        }
      });
    }
  }, [navigate]);

 

  useEffect(() => {
    if (user) {
      // Fetch user's decks
      const decksQuery = query(
        collection(db, "decks"),
        where("creator", "==", auth.currentUser.uid)
      );

      const unsubscribe = onSnapshot(decksQuery, (querySnapshot) => {
        const deckList = [];
        querySnapshot.forEach((doc) => {
          deckList.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setDecks(deckList);
      });

      // Cleanup function
      return () => unsubscribe();
    }
  }, [user]);

  const handleStudy = (deckId) => {
    navigate(`/study/${deckId}`);
  };

  const handleCreateDeck = () => {
    navigate("/deck-management/create");
  };

  return (
    <div>
      <h2>Welcome, {user?.name}</h2>
      <button onClick={handleCreateDeck}>Create New Deck</button>
      <ul>
        {decks.map((deck) => (
          <li key={deck.id}>
            {deck.name}
            <button onClick={() => handleStudy(deck.id)}>Study</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
