/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const AuthorGrid = ({ authors, setAuthors }) => {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastIndex, setLastIndex] = useState(0); // Start from index 0
  const loadedAuthors = new Set(); // Ensures no duplicates

  const authorNames = [
    "Kalki Krishnamurthy",
    "William Shakespeare",
    "Leo Tolstoy",
    "Jane Austen",
    "Charles Dickens",
    "Homer",
    "J.K. Rowling",
    "George Orwell",
    "Gabriel García Márquez",
    "Fyodor Dostoevsky",
    "Victor Hugo",
    "Mark Twain",
    "Ernest Hemingway",
    "Franz Kafka",
    "Haruki Murakami",
    "Virginia Woolf",
    "Toni Morrison",
    "J.R.R. Tolkien",
    "Agatha Christie",
    "Miguel de Cervantes",
    "James Joyce",
    "Oscar Wilde",
    "Emily Dickinson",
    "Marcel Proust",
    "Dante Alighieri",
    "John Steinbeck",
    "Herman Melville",
    "Albert Camus",
    "Khaled Hosseini",
    "Ralph Ellison",
    "Chinua Achebe",
    "Isabel Allende",
    "Italo Calvino",
    "Orhan Pamuk",
    "Salman Rushdie",
    "Margaret Atwood",
    "Umberto Eco",
    "Zadie Smith",
    "Murasaki Shikibu",
    "Gabriela Mistral",
    "Rumi",
    "Jean-Paul Sartre",
    "Jules Verne",
    "Harper Lee",
    "Kazuo Ishiguro",
    "John Milton",
    "Wole Soyinka",
    "Louisa May Alcott",
    "Günter Grass",
    "Anne Frank",
    "J.D. Salinger",
    "Sophocles",
    "Euripides",
    "Seamus Heaney",
    "Basho Matsuo",
    "T.S. Eliot",
    "William Faulkner",
    "George Eliot",
    "Patrick White",
    "Colette",
    "Aleksandr Solzhenitsyn",
    "Paul Coelho",
    "Elena Ferrante",
    "Naguib Mahfouz",
    "Milan Kundera",
    "Arundhati Roy",
    "Jhumpa Lahiri",
    "Tahar Ben Jelloun",
    "Yasunari Kawabata",
    "Rabindranath Tagore",
    "Carlos Fuentes",
    "Kenzaburō Ōe",
    "Boris Pasternak",
    "Doris Lessing",
    "Octavio Paz",
    "Henrik Ibsen",
    "Leo Buscaglia",
    "Hans Christian Andersen",
    "C.S. Lewis",
    "Vladimir Nabokov",
    "Henrik Pontoppidan",
    "Thomas Mann",
    "Alice Munro",
    "Edgar Allan Poe",
    "Nathaniel Hawthorne",
    "Katherine Mansfield",
    "Anton Chekhov",
    "Stephen King",
    "Roald Dahl",
    "Jean Rhys",
    "Michael Ondaatje",
    "Ian McEwan",
    "Suzanne Collins",
    "Beatrix Potter",
    "Luo Guanzhong",
    "Eiji Yoshikawa",
    "Mo Yan",
    "Selma Lagerlöf",
    "Stieg Larsson",
    "Mary Shelley",
    "Emily Brontë",
    "Anne Brontë",
  ];

  const fetchAuthorData = async (startIndex) => {
    if (loading || startIndex >= authorNames.length) return;

    setLoading(true);
    const fetchedAuthors = [];

    for (
      let i = startIndex;
      i < startIndex + 10 && i < authorNames.length;
      i++
    ) {
      const name = authorNames[i];

      if (loadedAuthors.has(name)) continue; // Prevent duplicates
      loadedAuthors.add(name);

      try {
        const response = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
            name
          )}&prop=pageimages|info|extracts&exintro&explaintext&inprop=url&pithumbsize=200&format=json&origin=*`
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

    setAuthors((prevAuthors) => [...prevAuthors, ...fetchedAuthors]);
    setLastIndex((prevIndex) => prevIndex + 10);

    if (lastIndex + 10 >= authorNames.length) {
      setHasMore(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAuthorData(0); // Initial fetch
  }, []);

  return (
    <div className="min-h-screen  bg-[#F8FAFC] p-4">
      <h1 className="text-3xl pt-[2vh] font-bold font-cinzel text-center mb-6">
        Literary Luminaries
      </h1>

      <InfiniteScroll
        dataLength={authors.length}
        next={() => fetchAuthorData(lastIndex)}
        hasMore={hasMore}
        loader={
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array(10) // Loading 10 items with proper spacing
              .fill()
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white p-4 shadow-lg rounded-lg animate-pulse transition-opacity opacity-80"
                >
                  <div className="w-full h-40 bg-gray-300 rounded-md mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                </div>
              ))}
          </div>
        }
        endMessage={
          <p className="text-center mt-2">You have reached the end!</p>
        }
      >
        <div className="grid grid-cols-2 sm:grid-cols-3  lg:grid-cols-5 gap-6">
          {authors.map((author, index) => (
            <div
              key={index}
              className="bg-[#918ca9] p-4 shadow-lg rounded-lg font-montserrat uppercase hover:shadow-xl text-[#black] hover:text-white transition-colors duration-300  cursor-pointer"
              onClick={() => window.open(author.wikiLink, "_blank")}
            >
              {author.image ? (
                <img
                  src={author.image}
                  alt={author.name}
                  className="w-full h-40 object-contain rounded-md mb-2"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500 rounded-md mb-2">
                  No Image
                </div>
              )}
              <h3 className=" text-center">{author.name}</h3>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default AuthorGrid;
