/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/UseAuthentication";

function Completed({ membersList, setSingleBook }) {
  const navigate = useNavigate();

  const handleBookClick = (book) => {
    setSingleBook(book);
    navigate(`/app/book/${book.id}`);
  };
  const { user } = useAuth();

  const activeUser = membersList.find((member) => {
    return member.id === user?.uid;
  });
  const completedBooks = activeUser.completedBooks;
  return (
    <div className="w-full h-full bg-[#c7c3dc] overflow-y-scroll  scrollbar-hide p-4">
      {completedBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-xl font-medium font-lato text-black">
            No books Completed Now! 📚
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {completedBooks.map((completedBook, index) => (
            <div
              key={index}
              className="flex items-start p-4 bg-[#918ca9] rounded-md cursor-pointer hover:bg-[#7c7892] transition-colors duration-200"
              onClick={() => handleBookClick(completedBook)}
            >
              {completedBook.imageLinks?.smallThumbnail ? (
                <img
                  src={completedBook.imageLinks.smallThumbnail}
                  alt={completedBook.title}
                  className="w-24 h-36 object-cover rounded-md"
                />
              ) : (
                <div className="w-24 h-36 bg-gray-600 text-gray-400 flex items-center justify-center rounded-md text-sm">
                  No Image
                </div>
              )}
              <div className="ml-4 py-2 font-josefin flex flex-col gap-1 ">
                <p className="text-lg font-cinzel text-white">
                  {completedBook.title}
                </p>
                <p className="text-sm  text-gray-300">
                  {completedBook.authors?.join(", ") || "Unknown Author"}
                </p>
                <p className="text-sm  text-gray-300">
                  {completedBook.categories?.join(", ") || "Unknown Author"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Completed;
