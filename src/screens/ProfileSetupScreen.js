import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase"; // Adjust the path as needed
import { doc, setDoc } from "firebase/firestore";

export default function ProfileSetupScreen() {
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [classes, setClasses] = useState("");
  const navigate = useNavigate();

  const saveProfile = async () => {
    const userId = auth.currentUser.uid;
    await setDoc(doc(db, "users", userId), {
      name,
      school,
      classes: classes.split(",").map((c) => c.trim()),
    });
    navigate.push("/dashboard");
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="School"
        value={school}
        onChange={(e) => setSchool(e.target.value)}
      />
      <input
        type="text"
        placeholder="Classes (comma-separated)"
        value={classes}
        onChange={(e) => setClasses(e.target.value)}
      />
      <button onClick={saveProfile}>Save Profile</button>
    </div>
  );
}
