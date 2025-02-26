/* eslint-disable react/prop-types */
import { useAuth } from "../context/UseAuthentication";
import { useFirestore } from "../hooks/useFirestore";
function SingleBookData({ singleBook, membersList }) {
  const { user } = useAuth();

  const activeUser = membersList.find((member) => {
    return member.id === user?.uid;
  });
  const savedBooks = activeUser.savedBooks;
  const readingBooks = activeUser.readingBooks;
  const completedBooks = activeUser.completedBooks;
  const isBookSaved = savedBooks.some((book) => book.id === singleBook.id);
  const isBookReading = readingBooks.some((book) => book.id === singleBook.id);
  const isBookCompleted = completedBooks.some(
    (book) => book.id === singleBook.id
  );
  const { updateUserBooks } = useFirestore("users");
  const getLanguageName = (langCode) => {
    const languageMap = {
      en: "English",
      mr: "Marathi",
      hi: "Hindi",
      fr: "French",
      es: "Spanish",
      de: "German",
      it: "Italian",
      ru: "Russian",
      zh: "Chinese",
      ja: "Japanese",
      ko: "Korean",
      ar: "Arabic",
      pt: "Portuguese",
      bn: "Bengali",
      pa: "Punjabi",
      ta: "Tamil",
      te: "Telugu",
      ur: "Urdu",
      gu: "Gujarati",
      kn: "Kannada",
      ml: "Malayalam",
      tr: "Turkish",
      vi: "Vietnamese",
      th: "Thai",
      nl: "Dutch",
      sv: "Swedish",
      no: "Norwegian",
      da: "Danish",
      fi: "Finnish",
      el: "Greek",
      pl: "Polish",
      cs: "Czech",
      hu: "Hungarian",
      ro: "Romanian",
      sk: "Slovak",
      uk: "Ukrainian",
      id: "Indonesian",
      fa: "Persian",
      sr: "Serbian",
      bg: "Bulgarian",
      lt: "Lithuanian",
      lv: "Latvian",
      et: "Estonian",
      he: "Hebrew",
      ga: "Irish",
      af: "Afrikaans",
      sw: "Swahili",
      ms: "Malay",
      tl: "Tagalog",
    };

    return languageMap[langCode] || langCode;
  };

  const descriptionParagraphs = (
    singleBook.description || "No description available."
  ).match(/[^.!?]+[.!?]+/g) || ["No description available."];

  function handleToggleSave(e) {
    e.preventDefault();
    if (isBookSaved) {
      updateUserBooks(user?.uid, singleBook, "remove", "savedBooks"); // Remove from reading books
    } else {
      updateUserBooks(user?.uid, singleBook, "add", "savedBooks");
      updateUserBooks(user?.uid, singleBook, "remove", "readingBooks"); // Remove from reading books
      updateUserBooks(user?.uid, singleBook, "remove", "completedBooks"); // Remove from reading books
    }
  }
  function handleToggleRead(e) {
    e.preventDefault();
    if (isBookReading) {
      updateUserBooks(user?.uid, singleBook, "remove", "readingBooks"); // Remove from reading books
    } else {
      updateUserBooks(user?.uid, singleBook, "remove", "savedBooks"); // Remove from reading books
      updateUserBooks(user?.uid, singleBook, "remove", "completedBooks"); // Remove from reading books
      updateUserBooks(user?.uid, singleBook, "add", "readingBooks");
    }
  }
  function handleToggleComplete(e) {
    e.preventDefault();
    if (isBookCompleted) {
      updateUserBooks(user?.uid, singleBook, "remove", "completedBooks"); // Remove from reading books
    } else {
      updateUserBooks(user?.uid, singleBook, "remove", "savedBooks"); // Remove from reading books
      updateUserBooks(user?.uid, singleBook, "remove", "readingBooks"); // Remove from reading books
      updateUserBooks(user?.uid, singleBook, "add", "completedBooks");
    }
  }

  return (
    <div className="p-8  mt-28 mb-5 bg-[#c7c3dc] rounded-lg shadow-md max-w-6xl text-gray-700 mx-4 xl:mx-auto">
      <div className="  flex flex-col md:flex-row lg:gap-16 gap-8  mb-8">
        {singleBook.imageLinks?.thumbnail ? (
          <img
            src={singleBook.imageLinks.thumbnail}
            alt={singleBook.title}
            className="w-[17rem] h-[26rem] max-md:mx-auto  object-contain rounded-md "
          />
        ) : (
          <div className="w-[17rem] h-[26rem] bg-gray-200 flex items-center justify-center rounded-md ">
            <span className="text-gray-500 text-sm">Image not available</span>
          </div>
        )}
        <div className="flex flex-col gap-5 max-md:mx-auto font-josefin flex-1">
          <h3 className="text-4xl font-bold font-cinzel text-black">
            {singleBook.title}
          </h3>
          <p className="text-xl ">
            <span className=" font-semibold">Authors: </span>
            {singleBook.authors?.join(", ") || "Unknown"}
          </p>
          <p className="text-xl ">
            <span className="font-semibold">Language: </span>
            {getLanguageName(singleBook.language)}
          </p>
          <p className="text-xl">
            <span className="font-semibold">Category: </span>
            {singleBook.categories || "N/A"}
          </p>
          <p className="text-xl ">
            <span className="font-semibold">Page Count: </span>
            {singleBook.pageCount || "N/A"}
          </p>
          <p className="text-xl ">
            <span className="font-semibold">Publisher: </span>
            {singleBook.publisher || "Unknown"}
          </p>
          <p className="text-xl ">
            <span className="font-semibold">Published Date: </span>
            {singleBook.publishedDate || "Unknown"}
          </p>

          <div className="bg-[#918ca9] text-lg flex w-80 font-lato justify-between rounded-full p-1 shadow-lg max-sm:mx-auto">
            <button
              onClick={handleToggleSave}
              className={`flex-1 px-4 py-2 rounded-full text-black font-semibold  transition-all duration-300 ring-2 ring-transparent  ${
                isBookSaved ? "bg-[#FF0800] text-white " : "hover:bg-[#c7c3dc] "
              }`}
            >
              Save
            </button>
            <button
              onClick={handleToggleRead}
              className={`flex-1 px-4 py-2 rounded-full font-semibold text-black transition-all duration-300 ring-2 ring-transparent  ${
                isBookReading ? "bg-[#0000FF] text-white" : "hover:bg-[#c7c3dc]"
              }`}
            >
              Reading
            </button>
            <button
              onClick={handleToggleComplete}
              className={`flex-1 px-4 py-2 rounded-full font-semibold text-black transition-all duration-300 ring-2 ring-transparent ${
                isBookCompleted
                  ? "bg-[#00FF00] text-white"
                  : "hover:bg-[#c7c3dc]"
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>
      <div className="mb-8">
        <h4 className="text-xl font-semibold font-merriweather mb-4">
          Description:
        </h4>
        {descriptionParagraphs.map((paragraph, index) => (
          <p key={index} className=" text-lg font-ubuntu mb-4 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

export default SingleBookData;
