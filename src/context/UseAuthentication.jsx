/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/config";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isAuthReady: false, // New state
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return { ...state, user: null, isAuthenticated: false };
    case "authReady": // New case
      return { ...state, isAuthReady: true };
    default:
      throw new Error("Unknown action");
  }
}

function AuthProvider({ children }) {
  const [error, setError] = useState(null);
  const [{ user, isAuthenticated, isAuthReady }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ type: "login", payload: user });
        localStorage.setItem("user", JSON.stringify(user));
      } else if (storedUser) {
        dispatch({ type: "login", payload: storedUser });
      }

      // ✅ Mark auth as ready
      dispatch({ type: "authReady" });
    });

    return () => unsub();
  }, []);

  const login = ({ email, password }) => {
    setError(null);

    signInWithEmailAndPassword(auth, email, password)
      .then((response) => {
        const user = response.user;
        dispatch({ type: "login", payload: user });

        localStorage.setItem("user", JSON.stringify(user));
      })
      .catch((err) => {
        setError(err.message);
        // return Promise.reject(err); // 🔹 Return error so it can be caught in `handleSubmit`
      });
  };

  const logout = () => {
    setError(null);

    signOut(auth)
      .then(() => {
        dispatch({ type: "logout" });
        localStorage.removeItem("user");
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, error, login, logout }}
    >
      {isAuthReady ? children : null}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside AuthProvider");
  return context;
}
export { AuthProvider, useAuth };
