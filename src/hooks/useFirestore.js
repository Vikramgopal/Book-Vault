import { useState } from "react";
import { db } from "../firebase/config";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { updatePassword } from "firebase/auth";
import { useAuth } from "../context/UseAuthentication";

export const useFirestore = (fbcollection) => {
  const [secondDocument, setSecondDocument] = useState(null);
  const collectionRef = collection(db, fbcollection);
  const { user } = useAuth();

  // Function to add a document
  const addDocument = async (data) => {
    try {
      const docRef = await addDoc(collectionRef, data);
      setSecondDocument(docRef);
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  // Function to update a document
  const updateDocument = async (id, updatedFields) => {
    try {
      await updateDoc(doc(db, fbcollection, id), updatedFields);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  // General function to handle book updates (add/remove)
  const updateUserBooks = async (userId, book, action, category) => {
    try {
      await updateDocument(userId, {
        [category]: action === "add" ? arrayUnion(book) : arrayRemove(book),
      });
    } catch (error) {
      console.error(`Error ${action}ing book in ${category}:`, error);
    }
  };

  // Function to change user password
  const changeUserPassword = async (newPassword) => {
    if (user) {
      try {
        await updatePassword(user, newPassword);
      } catch (error) {}
    } else {
      console.error("No user is signed in.");
    }
  };

  return {
    addDocument,
    updateDocument,
    changeUserPassword,
    updateUserBooks, // Use this instead of multiple add/remove functions
    secondDocument,
  };
};
