/* eslint-disable react/prop-types */
import { FaArrowCircleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/UseAuthentication";

function MiniSavedBooks({ membersList, setSingleBook }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const activeUser = membersList.find((member) => {
    return member.id === user?.uid;
  });
  const savedBooks = activeUser?.savedBooks || [];

  const handleBookClick = (book) => {
    setSingleBook(book);
    navigate(`/app/book/${book.id}`); // Adjusted the book id routing
  };

  const handleOpenSavedBooks = (e) => {
    e.preventDefault();
    navigate("savedbooks");
  };
  return (
    <div className="relative">
      <h2 className="text-3xl ml-6  text-black font-cinzel font-semibold mb-5">
        Saved Books
      </h2>
      <section className="mx-5  p-6 rounded-lg bg-gradient-to-r from-[#918ca9]  to-[#c7c3dc] flex flex-col gap-5 text-white shadow-xl ">
        {/* Check if savedBooks is empty and display message */}
        {savedBooks.length === 0 ? (
          <div className="flex flex-col items-center font-ubuntu justify-center h-48 ">
            <p className="text-xl font-medium text-black">
              No books saved yet. <br />
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-start">
            <div className="grid mx-auto grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10">
              {savedBooks.slice(0, 6).map((savedBook, index) => (
                <div
                  key={index}
                  className="text-center cursor-pointer hover:scale-105 transform transition duration-300"
                  onClick={() => handleBookClick(savedBook)}
                >
                  {savedBook.imageLinks?.smallThumbnail ? (
                    <img
                      src={savedBook.imageLinks.smallThumbnail}
                      alt={savedBook.title}
                      className="w-48 h-48 mx-auto mb-3 object-contain rounded-lg shadow-md"
                    />
                  ) : (
                    <div className="w-48 h-48 bg-gray-300 rounded-lg mx-auto flex items-center justify-center mb-3 text-center text-sm text-gray-600">
                      No Image
                    </div>
                  )}
                  <p className="text-base font-josefin font-semibold">
                    {savedBook.title}
                  </p>
                </div>
              ))}{" "}
            </div>
            {savedBooks.length > 5 && (
              <button
                onClick={handleOpenSavedBooks}
                className=" text-gray-300 xl:block hidden hover:text-[#000] transition-colors duration-200 rounded-full p-2 ps-8"
              >
                <FaArrowCircleRight size={35} />
              </button>
            )}
            {savedBooks.length > 5 && (
              <button
                onClick={handleOpenSavedBooks}
                className="absolute text-[#918ca9] top-[-4px] xl:hidden  right-2 sm:right-4  hover:text-black transition-colors duration-200 rounded-full p-2"
              >
                <FaArrowCircleRight size={35} />
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default MiniSavedBooks;
