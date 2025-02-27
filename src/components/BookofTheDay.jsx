/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { db } from "../firebase/config";
import { updateDoc, arrayUnion, doc, getDoc, setDoc } from "firebase/firestore";

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";

const genres = [
  "fiction",
  "mystery",
  "fantasy",
  "romance",
  "history",
  "science",
  "adventure",
  "thriller",
  "self-help",
];

const getRandomGenre = () => genres[Math.floor(Math.random() * genres.length)];
const fetchBook = async () => {
  try {
    const docRef = doc(db, "displayedBooks", "bookOfTheDay");
    const docSnap = await getDoc(docRef);

    const currentTime = Date.now();

    if (docSnap.exists()) {
      const { book, timestamp } = docSnap.data();

      // If it's been less than 24 hours, return the existing book
      if (currentTime - timestamp < 24 * 60 * 60 * 1000) {
        return book;
      }

      // ✅ Save the previous book's ID before replacing it
      if (book?.id) {
        await saveBookIdToFirebase(book.id);
      }
    }

    let isDuplicate = true;
    let bookData = null;

    while (isDuplicate) {
      const randomGenre = getRandomGenre();
      const response = await fetch(
        `${GOOGLE_BOOKS_API_URL}?q=${randomGenre}&maxResults=1`
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const book = data.items[0];
        const bookId = book.id;

        isDuplicate = await checkIfBookExists(bookId);
        if (!isDuplicate) {
          bookData = {
            id: bookId,
            title: book.volumeInfo.title,
            author: book.volumeInfo.authors?.join(", ") || "Unknown",
            description:
              book.volumeInfo.description || "No description available",
            image: book.volumeInfo.imageLinks?.thumbnail || null,
            link: book.volumeInfo.infoLink,
          };

          // ✅ Store new book in Firebase
          await setDoc(docRef, {
            book: bookData,
            timestamp: currentTime,
          });

          // ✅ Add the new book ID to Firebase
          await saveBookIdToFirebase(bookId);
        }
      }
    }

    return bookData;
  } catch (error) {
    console.error("Error fetching book:", error);
    return null;
  }
};

const checkIfBookExists = async (bookId) => {
  try {
    const docRef = doc(db, "displayedBooks", "bookIds");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const storedBookIds = docSnap.data().books || [];
      return storedBookIds.includes(bookId);
    }

    return false;
  } catch (error) {
    console.error("Error checking book existence:", error);
    return false;
  }
};
const saveBookIdToFirebase = async (bookId) => {
  try {
    const docRef = doc(db, "displayedBooks", "bookIds");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, { books: [] });
    }

    await updateDoc(docRef, {
      books: arrayUnion(bookId),
    });
  } catch (error) {
    console.error("Error saving book ID to Firebase:", error);
  }
};
function BookOfTheDay({ bookOfTheDay, setBookOfTheDay }) {
  const fetchedOnce = useRef(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!fetchedOnce.current) {
      fetchedOnce.current = true;

      fetchBook().then((book) => {
        if (book) {
          setBookOfTheDay(book);
        }
        setLoading(false);
      });
    }
  }, [setBookOfTheDay]);
  return (
    <div className="flex flex-col w-full max-sm:h-[calc(100vh-10vh)] md:h-[calc(100vh-12vh)] p-6">
      {/* Title */}
      <h2 className="text-3xl font-cinzel font-semibold text-black text-left mb-5">
        Book of the Day
      </h2>

      {/* Container with responsive grid */}
      <div className="w-full md:h-[90%]  bg-gradient-to-r from-[#918ca9] to-[#c7c3dc] p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-start">
        {loading ? (
          <>
            {/* Left (Image) */}
            <div className="w-full  h-[350px] md:w-[17rem] lg:w-[21rem] md:h-[100%] flex-shrink-0 rounded-lg overflow-hidden bg-gray-300 shadow-md animate-pulse"></div>
            {/* Right (Text) */}
            <div className="flex flex-col flex-grow mt-6 md:mt-0 md:ml-6 text-white">
              <div className="h-8 w-[80%] bg-gray-300 rounded-md mb-3 animate-pulse"></div>
              <div className="h-6 w-[60%] bg-gray-300 rounded-md mb-3 animate-pulse"></div>
              <div className="h-24 w-full bg-gray-300 rounded-md mb-4 animate-pulse"></div>
              <div className="h-10 w-[8rem] bg-gray-300 rounded-full animate-pulse"></div>
            </div>
          </>
        ) : bookOfTheDay ? (
          <>
            {/* Left (Image) */}
            <div className="w-full  h-[350px] md:w-[17rem] lg:w-[21rem] md:h-[100%]  flex-shrink-0 rounded-lg overflow-hidden">
              {bookOfTheDay.image ? (
                <img
                  className="w-full h-full object-contain"
                  src={bookOfTheDay.image}
                  alt={bookOfTheDay.title}
                />
              ) : (
                <div className="w-full  h-[350px] md:w-[17rem] lg:w-[21rem] md:h-[100%] flex items-center justify-center text-white">
                  No Image Available
                </div>
              )}
            </div>

            {/* Right (Text) */}
            <div className="flex flex-col flex-grow mt-6 md:mt-0 md:ml-6 md:p-4  text-white">
              <h3 className="text-3xl font-bold uppercase font-josefin text-black mb-2">
                {bookOfTheDay.title}
              </h3>
              <p className="text-xl text-[#EAEAEA] font-montserrat font-medium mb-2">
                <strong>Author:</strong> {bookOfTheDay.author}
              </p>
              <p className="text-md mb-4 max-h-[70%] text-[#EAEAEA] overflow-y-scroll font-ubuntu scrollbar-hide">
                {bookOfTheDay.description}
              </p>
              <a
                href={bookOfTheDay.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-ubuntu bg-black w-[8rem] text-center text-white px-4 py-2 rounded-full shadow-md transition-all hover:bg-white hover:text-black hover:shadow-lg"
              >
                Learn More
              </a>
            </div>
          </>
        ) : (
          <div className="text-center w-full text-white">
            <p className="text-xl">No Book Found 😢</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookOfTheDay;
