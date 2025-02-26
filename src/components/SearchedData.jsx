/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { fetchBooksData } from "../utility/FetchSearching";
import { useNavigate } from "react-router-dom";
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";
import BookshelfLoading from "../context/BookshelfLoading";

function SearchedData({ selectedOption, encodedName, setSingleBook }) {
  const [items, setItems] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const booksPerPage = 20;
  useEffect(() => {
    setStartIndex(0); // Reset to first page when a new search is performed
  }, [selectedOption, encodedName]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { items: fetchedData, totalItems } = await fetchBooksData(
          selectedOption,
          encodedName,
          startIndex
        );

        setItems(fetchedData);
        setTotalPages(Math.ceil(totalItems / booksPerPage)); // Set total pages dynamically
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedOption, encodedName, startIndex]);

  const handleBookClick = (book) => {
    setSingleBook(book);
    navigate(`/app/book/:${book.id}`);
  };

  return (
    <div className="p-5 relative min-h-screen flex flex-col items-center">
      {/* Centered Loading Animation */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-50">
          <BookshelfLoading />
        </div>
      )}

      {/* Grid for book items */}
      <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-6 bg-gray-100 p-5 rounded-md w-full">
        {!isLoading &&
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-md p-3 cursor-pointer hover:shadow-lg flex flex-col items-center bg-white border border-gray-200"
              onClick={() => handleBookClick(item)}
            >
              <div className="w-36 h-48 bg-gray-200 flex items-center justify-center overflow-hidden rounded-md mb-3">
                {item.imageLinks?.smallThumbnail ? (
                  <img
                    src={item.imageLinks.smallThumbnail}
                    alt={item.title}
                    className="object-cover h-full w-full"
                  />
                ) : (
                  <span className="text-sm text-gray-500">
                    Sorry, image not found
                  </span>
                )}
              </div>
              <div className="text-left w-full">
                <h3 className="font-bold text-sm mb-1">
                  <span>Title: </span>
                  {item.title}
                </h3>
                <p className="text-sm mb-1">
                  <span className="font-semibold">Author: </span>
                  {item.authors?.join(", ") || "Unknown"}
                </p>
                <p className="sm:text-sm text-xs">
                  <span className="font-semibold">Published Date: </span>
                  {item.publishedDate || "Not available"}
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination & Buttons */}
      {!isLoading && items.length > 0 && (
        <div className="my-4 flex flex-col items-center">
          {/* Pagination Carousel */}
          <div className="flex space-x-2 mb-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <div
                key={index}
                className={`w-6 h-6 rounded-full ${
                  index === Math.floor(startIndex / booksPerPage)
                    ? "bg-blue-500"
                    : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>

          {/* Page Info */}
          <p className="text-gray-700 font-semibold">
            Page {Math.floor(startIndex / booksPerPage) + 1} of {totalPages}
          </p>

          {/* Navigation Buttons */}
          <div className="mt-3 flex items-center justify-between gap-5">
            <button
              onClick={() =>
                setStartIndex((prev) => Math.max(0, prev - booksPerPage))
              }
              className={`px-5 py-3 rounded-full shadow-md text-white font-semibold transition-all ${
                startIndex === 0
                  ? "invisible"
                  : "bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105"
              }`}
              disabled={startIndex === 0}
            >
              <FaArrowCircleLeft />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setStartIndex((prev) => prev + booksPerPage)}
              className="flex justify-between gap-3 h-10 items-center py-2 px-3 rounded-full shadow-md text-white font-semibold bg-[#918ca9] hover:bg-[#746d93] transition-all"
            >
              <span>Next</span>
              <FaArrowCircleRight />
            </button>
          </div>
        </div>
      )}

      {/* Show message if no data is found */}
      {!isLoading && items.length === 0 && (
        <p className="text-center text-gray-600 mt-4">No books found.</p>
      )}
    </div>
  );
}

export default SearchedData;
