/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/UseAuthentication";

function Saved({ membersList, setSingleBook }) {
  const navigate = useNavigate();

  const handleBookClick = (book) => {
    setSingleBook(book);
    navigate(`/app/book/${book.id}`);
  };
  const { user } = useAuth();

  const activeUser = membersList.find((member) => {
    return member.id === user?.uid;
  });
  const savedBooks = activeUser.savedBooks;
  return (
    <div className="w-full h-full bg-[#c7c3dc]  overflow-y-scroll  scrollbar-hide p-4">
      {savedBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-xl font-lato font-medium text-black">
            No books saved yet! 📚
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {savedBooks.map((savedBook, index) => (
            <div
              key={index}
              className="flex items-start  p-4 bg-[#918ca9]  rounded-md cursor-pointer hover:bg-[#7c7892] transition-colors duration-200"
              onClick={() => handleBookClick(savedBook)}
            >
              {savedBook.imageLinks?.smallThumbnail ? (
                <img
                  src={savedBook.imageLinks.smallThumbnail}
                  alt={savedBook.title}
                  className="w-24 h-36 object-cover rounded-md"
                />
              ) : (
                <div className="w-24 h-36 bg-gray-600 text-gray-400 flex items-center justify-center rounded-md text-sm">
                  No Image
                </div>
              )}
              <div className="ml-4 py-2 flex flex-col gap-1 ">
                <p className="text-lg  font-cinzel text-white">
                  {savedBook.title}
                </p>
                <p className="text-sm  font-josefin text-gray-300">
                  {savedBook.authors?.join(", ") || "Unknown Author"}
                </p>
                <p className="text-sm  font-josefin text-gray-300">
                  {savedBook.categories?.join(", ") || "Unknown Author"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Saved;
