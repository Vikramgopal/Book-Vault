import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
const uploadImageToImgBB = async (imageFile) => {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;

  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (data.success) {
      return data.data.url; // Direct image URL
    } else {
      throw new Error("Image upload failed");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};
export const useSignup = () => {
  const signup = async ({
    email,
    password,
    phoneNumber,
    gender,
    fullName,
    dob,
    // uid,
    profileImage,
    confirmPassword,
    savedBooks,
    readingBooks,
    completedBooks,
  }) => {
    try {
      // First, upload the profile image to ImgBB
      // const profileImageUrl = await uploadImageToImgBB(profileImage);
       const profileImageUrl = (await uploadImageToImgBB(profileImage)) || ""; // Default to an empty string instead of returning
      if (!profileImageUrl) {
        console.error("Image upload failed");
        return;
      }

      // Create user in Firebase Auth
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = response.user;

      // Save user data in Firestore
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, {
        email,
        fullName,
        phoneNumber,
        gender,
        dob,
        uid: user.uid,
        profileImage: profileImageUrl, // Store the ImgBB URL
        confirmPassword,
        password,
        savedBooks,
        readingBooks,
        completedBooks,
      });
    } catch (error) {
      console.error("Signup error:", error);
    }
  };
  return { signup };
};
