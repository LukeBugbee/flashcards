import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { auth } from "./firebase"; // Adjust the import path as needed

import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";
import ProfileSetupScreen from "./screens/ProfileSetupScreen";
import DeckManagementScreen from "./screens/DeckManagementScreen";
import StudyScreen from "./screens/StudyScreen";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        console.log("User is signed in:", user.uid);
      } else {
        console.log("No user is signed in.");
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <LoginScreen />}
        />
        {user ? (
          <>
            <Route path="/dashboard" element={<DashboardScreen />} />
            <Route path="/profile-setup" element={<ProfileSetupScreen />} />
            <Route
              path="/deck-management/:mode/:deckId?"
              element={<DeckManagementScreen />}
            />
            <Route path="/study/:deckId" element={<StudyScreen />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
