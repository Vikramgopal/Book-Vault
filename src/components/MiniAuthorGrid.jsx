/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FaArrowCircleRight } from "react-icons/fa";

function MiniAuthorGrid({ authors, setAuthors }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const authorNames = [
    "Umberto Eco",
    "Zadie Smith",
    "Jane Austen",
    "Homer",
    "George Orwell",
    "Mark Twain",
  ];

  useEffect(() => {
    if (authors.length > 0) {
      setLoading(false);
      return; // Skip fetching if authors are already available
    }
    const fetchAuthors = async () => {
      setLoading(true);
      const fetchedAuthors = [];
      for (const name of authorNames) {
        try {
          const response = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
              name
            )}&prop=pageimages|info&inprop=url&pithumbsize=100&format=json&origin=*`
          );
          const data = await response.json();
          const page = Object.values(data.query.pages)[0];
          fetchedAuthors.push({
            name,
            image: page.thumbnail?.source || null,
            wikiLink: page.fullurl,
          });
        } catch (error) {
          console.error(`Failed to fetch data for ${name}:`, error);
        }
      }
      setAuthors(fetchedAuthors);
      setLoading(false);
    };

    fetchAuthors();
  }, [authors, setAuthors]);

  function handleNavigate(e) {
    e.preventDefault();
    navigate("authorslist");
  }

  return (
    <section className="relative">
      <h2 className="  text-3xl ml-6 text-black font-cinzel font-semibold mb-5">
        Literary Luminaries
      </h2>
      <div className="  m-5 p-6 bg-gradient-to-r from-[#918ca9]  to-[#c7c3dc] rounded-lg flex flex-col gap-5 text-black shadow-md">
        <div className="flex items-center gap-4">
          <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-14 mx-auto mt-4">
            {loading
              ? authorNames.map((_, index) => (
                  <div
                    key={index}
                    className="text-center cursor-default border-2 border-transparent rounded-lg p-2"
                  >
                    {/* Skeleton Image */}
                    <div className="xl:w-44 lg:w-36 md:w-36 w-28 xl:h-48 lg:h-36 md:h-36 h-36 bg-gray-300 rounded-full mx-auto mb-3 animate-pulse"></div>
                    {/* Skeleton Name */}
                    <div className="w-32 xl:w-36  h-4 bg-gray-300 rounded mx-auto mb-3 animate-pulse"></div>
                  </div>
                ))
              : authors.map((author, index) => (
                  <div
                    key={index}
                    className="text-center transition-all duration-300 cursor-pointer border-2 border-transparent hover:text-white text-black   rounded-lg p-2"
                    onClick={() => window.open(author.wikiLink, "_blank")}
                  >
                    {author.image ? (
                      <img
                        src={author.image}
                        alt={author.name}
                        className="xl:w-48 lg:w-40 md:w-36 max-sm:w-40 xl:h-48 lg:h-40 md:h-36 h-36   rounded-full border-2 border-black mx-auto mb-3 object-cover"
                      />
                    ) : (
                      <div className="w-48 h-48 bg-gray-300 rounded-full mx-auto flex items-center justify-center mb-3">
                        No Image
                      </div>
                    )}
                    <p className="text-[16px] font-montserrat  uppercase text-nowrap tracking-wider ">
                      {author.name}
                    </p>
                  </div>
                ))}
          </div>
          {!loading && (
            <button
              className=" text-gray-300 xl:block hidden hover:text-black transition-colors duration-200 rounded-full p-2"
              onClick={handleNavigate}
            >
              <FaArrowCircleRight size={35} />
            </button>
          )}
          {!loading && (
            <button
              className="absolute text-[#918ca9] top-[-4px] xl:hidden  right-2 sm:right-4 hover:text-black transition-colors duration-200 rounded-full p-2"
              onClick={handleNavigate}
            >
              <FaArrowCircleRight size={35} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default MiniAuthorGrid;
