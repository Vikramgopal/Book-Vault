import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import CreateUser from "./pages/CreateUser";
import Login from "./components/Login";
import Signing from "./components/Signing";
import AppLayout from "./pages/AppLayout";
import DefaultData from "./components/DefaultData";
import { useEffect, useState } from "react";
import SearchedData from "./components/SearchedData";
import SingleBookData from "./components/SingleBookData";
import AuthorGrid from "./components/AuthorGrid";
import SavedBooks from "./components/SavedBooks";
import Reading from "./components/Reading";
import Completed from "./components/Completed";
import Saved from "./components/Saved";
import { AuthProvider } from "./context/UseAuthentication";
import ProtectedRoute from "./pages/ProtectedRoute";
import Profile from "./components/Profile";

import { useFetchCollections } from "./hooks/useFetchCollections";
function App() {
  const [selectedOption, setSelectedOption] = useState("");
  const [encodedName, setEncodedName] = useState("");
  const [singleBook, setSingleBook] = useState(null); // Initialize as null
  const [items, setItems] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [mainAuthors, setMainAuthors] = useState([]);
  const [bookOfTheDay, setBookOfTheDay] = useState(null);
  const { document } = useFetchCollections("users");
  const [membersList, setMembersList] = useState([]);
  useEffect(() => {
    if (document) {
      setMembersList(document); // Update memberList with fetched data
    }
  }, [document]); // Runs whenever `document` updates

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<CreateUser />}>
            <Route index element={<Login />} />
            <Route
              path="signin"
              element={
                <Signing setMembers={setMembersList} members={membersList} />
              }
            />
          </Route>
          <Route
            path="app"
            element={
              <ProtectedRoute>
                <AppLayout
                  selectedOption={selectedOption}
                  encodedName={encodedName}
                  setEncodedName={setEncodedName}
                  setSelectedOption={setSelectedOption}
                  items={items}
                  setItems={setItems}
                  singleBook={singleBook}
                  setSingleBook={setSingleBook}
                  membersList={membersList}
                />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <DefaultData
                  // savedBooks={savedBooks}
                  membersList={membersList}
                  setSingleBook={setSingleBook}
                  authors={authors}
                  setAuthors={setAuthors}
                  bookOfTheDay={bookOfTheDay}
                  setBookOfTheDay={setBookOfTheDay}
                />
              }
            />
            <Route
              path="profile"
              element={
                <Profile
                  membersList={membersList}
                  setMembersList={setMembersList}
                />
              }
            />

            <Route
              path="search"
              element={
                <SearchedData
                  selectedOption={selectedOption}
                  encodedName={encodedName}
                  setSingleBook={setSingleBook}
                />
              }
            />
            <Route
              path="book/:id"
              element={
                <SingleBookData
                  singleBook={singleBook}
                  membersList={membersList}
                />
              }
            />
            <Route
              path="authorslist"
              element={
                <AuthorGrid authors={mainAuthors} setAuthors={setMainAuthors} />
              }
            />
            <Route path="savedbooks" element={<SavedBooks />}>
              <Route index element={<Navigate to="saved" replace />} />
              <Route
                path="saved"
                element={
                  <Saved
                    membersList={membersList}
                    setSingleBook={setSingleBook}
                  />
                }
              />
              <Route
                path="reading"
                element={
                  <Reading
                    setSingleBook={setSingleBook}
                    membersList={membersList}
                  />
                }
              />
              <Route
                path="completed"
                element={
                  <Completed
                    setSingleBook={setSingleBook}
                    membersList={membersList}
                  />
                }
              />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
