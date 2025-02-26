export async function fetchBooksData(
  selectedOption,
  encodedName,
  startIndex = 0
) {
  if (!encodedName || encodedName.length <= 3) {
    console.warn("Search term must be longer than 3 characters.");
    return { items: [], totalItems: 0 };
  }

  const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

  const url = `https://www.googleapis.com/books/v1/volumes?q=${selectedOption}:${encodedName}&startIndex=${startIndex}&maxResults=20&key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const totalItems = data.totalItems || 0; // Get totalItems from API
    const fetchedItems = data.items?.map((item) => {
      const {
        id,

        volumeInfo: {
          title,
          authors,
          publisher,
          publishedDate,
          description,
          imageLinks,
          industryIdentifiers,
          categories,
          pageCount,
          language,
        },
      } = item;

      return {
        id,
        title,
        authors,
        publisher,
        publishedDate,
        description,
        imageLinks,
        industryIdentifiers,
        categories,
        pageCount,
        language,
      };
    });

    return { items: fetchedItems || [], totalItems };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { items: [], totalItems: 0 };
  }
}
