/* eslint-disable react/prop-types */
import MiniAuthorGrid from "./MiniAuthorGrid";
import BookOfTheDay from "./BookofTheDay";
import SavedBooks from "./MiniSavedBooks";

function DefaultData({
  // savedBooks,
  authors,
  setAuthors,
  membersList,
  setSingleBook,
  bookOfTheDay,
  setBookOfTheDay,
}) {
  return (
    <div className="bg-[#F4F4F4]">
      <BookOfTheDay
        bookOfTheDay={bookOfTheDay}
        setBookOfTheDay={setBookOfTheDay}
      />

      <MiniAuthorGrid authors={authors} setAuthors={setAuthors} />
      <div className="pb-5">
        <SavedBooks
          setSingleBook={setSingleBook}
          membersList={membersList}
          // savedBooks={savedBooks}
        />
      </div>
    </div>
  );
}

export default DefaultData;
