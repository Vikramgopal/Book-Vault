import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

export const useFetchCollections = (fbcollection) => {
  const [document, setDocument] = useState(null);
  useEffect(() => {
    let collectionRef = collection(db, fbcollection);

    const unsub = onSnapshot(collectionRef, (snapshot) => {
      let result = [];
      snapshot.docs.forEach((doc) => {
        result.push({ ...doc.data(), id: doc.id });
      });
      setDocument(result);
    });

    return () => unsub();
  }, [fbcollection]);
  return { document };
};
