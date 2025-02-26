/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import Logo from "./Logo";
import Select from "react-select";
import User from "./User";
import { FaBookmark } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { ImCross } from "react-icons/im";
function PageNav({
  selectedOption,
  setSelectedOption,
  encodedName,
  setEncodedName,
  setItems,
  membersList,
}) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandedMobile, setIsExpandedMobile] = useState(false);
  const searchRef = useRef(null);

  const options = [
    { value: "intitle", label: "By Book" },
    { value: "inauthor", label: "By Author" },
  ];

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "none",
      borderRadius: "10rem",
      boxShadow: "none",
      padding: "5px 12px",
      backgroundColor: "white",
      width: "150px", // Fixed width
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "white",
      borderRadius: "0.375rem",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "rgba(0, 0, 0, 0.1)" : "white",
      color: "black",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "black",
      whiteSpace: "nowrap", // Prevents text from breaking
      overflow: "hidden",
      textOverflow: "ellipsis", // Show '...' if text overflows
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "rgba(0,0,0,0.6)",
    }),
    input: (base) => ({
      ...base,
      color: "black",
    }),
  };

  const handleOpenSavedBooks = (e) => {
    e.preventDefault();
    navigate("savedbooks");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOption === "" || encodedName.trim() === "") return;
    navigate("search");
    setIsExpanded(false);
    setIsExpandedMobile(false);
  };

  // Close search bar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="px-8 flex justify-between items-center bg-white/30 backdrop-blur-md border-b border-gray-200 shadow-lg w-full h-[12vh] fixed top-0 left-0 z-50">
        {/* Logo */}
        <Logo />

        {/* Animated Search Bar */}
        <div
          ref={searchRef}
          className="relative lg:flex items-center font-dmsans justify-center w-full  max-lg:hidden  lg:max-w-[600px] xl:max-w-[700px]"
        >
          {!isExpanded && (
            <motion.button
              onClick={() => setIsExpanded(true)}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.1 }}
              className="text-black bg-white p-2 ps-4  rounded-full shadow-md flex items-center font-poppins gap-3 border-2 border-gray-400 hover:bg-gray-100 transition"
            >
              Search Books here
              <div className="bg-[#c1bcdb] p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#c1bcdb"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="black"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
              </div>
            </motion.button>
          )}

          {/* Expanded Search Form */}
          <AnimatePresence>
            {isExpanded && (
              <motion.form
                onSubmit={handleSubmit}
                initial={{ width: "5rem", opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                exit={{ width: "5rem", opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute left-0 right-0 mx-auto flex items-center gap-3 p-2 bg-white rounded-full shadow-md border border-gray-300"
                style={{ maxWidth: "700px" }}
              >
                {/* Dropdown */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="w-[150px]"
                >
                  <Select
                    value={options.find(
                      (option) => option.value === selectedOption
                    )}
                    onChange={(selected) =>
                      setSelectedOption(selected?.value || "")
                    }
                    options={options}
                    placeholder="Select"
                    styles={customStyles}
                    className="font-poppins"
                  />
                </motion.div>

                {/* Search Input */}
                <motion.input
                  type="text"
                  value={encodedName}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEncodedName(value);
                    if (value.trim() === "") {
                      setItems([]);
                    }
                  }}
                  placeholder="Search for books..."
                  className="w-full p-2 pl-4   border-none font-poppins outline-none"
                  required
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                />

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 bg-[#c1bcdb] font-poppins text-black font-medium rounded-full shadow-md hover:bg-[#b5b1ca] transition focus:outline-none"
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#c1bcdb"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="black"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                      />
                    </svg>
                  </div>
                  Search
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
        {/* /////////////////////// */}
        <div className="lg:hidden">
          {!isExpandedMobile && (
            <button
              onClick={() => setIsExpandedMobile(true)}
              className="hover:bg-[#000] flex items-center gap-2 bg-[#c1bcdb] text-black py-2 px-3 rounded-full cursor-pointer hover:text-[#fff] font-poppins font-semibold uppercase transition-colors duration-300"
            >
              <FaSearch size={20} />
              Search
            </button>
          )}
        </div>
        {/* //////////////////////////////// */}
        {/* Watchlist & Login */}
        <div className="flex max-lg:hidden items-center gap-8">
          <button
            className="hover:bg-[#000] flex items-center gap-2 bg-[#c1bcdb] text-black p-2 rounded-xl cursor-pointer hover:text-[#fff]  font-poppins font-semibold uppercase transition-colors duration-300"
            onClick={handleOpenSavedBooks}
          >
            Saved Books <FaBookmark />
          </button>
          <User membersList={membersList} />
        </div>
        <div className="flex lg:hidden items-center gap-8">
          <button
            className="hover:bg-[#000] flex items-center gap-2 bg-[#c1bcdb] text-black p-3 rounded-full cursor-pointer hover:text-[#fff]  font-poppins font-semibold uppercase transition-colors duration-300"
            onClick={handleOpenSavedBooks}
          >
            <FaBookmark size={17} />
          </button>
          <User membersList={membersList} />
        </div>
      </nav>
      {/* /////////////////////////// */}
      {isExpandedMobile && (
        <div className="h-screen font-dmsans w-screen lg:hidden">
          <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 p-4">
            <button
              onClick={() => setIsExpandedMobile(false)}
              className="absolute top-4 right-4 text-black text-2xl"
            >
              <ImCross />
            </button>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-start gap-4 font-dmsans"
            >
              <div className="flex text-lg gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="searchType"
                    value="intitle"
                    checked={selectedOption === "intitle"}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  />
                  By Book
                </label>
                <label className="flex items-center  gap-2">
                  <input
                    type="radio"
                    name="searchType"
                    value="inauthor"
                    checked={selectedOption === "inauthor"}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  />
                  By Author
                </label>
              </div>

              <input
                type="text"
                value={encodedName}
                onChange={(e) => {
                  const value = e.target.value;
                  setEncodedName(value);
                }}
                placeholder="Search for books..."
                className="w-64   border-black border-2 p-3 rounded-full outline-none"
                required
              />

              <button
                type="submit"
                className="bg-[#c1bcdb] text-black px-4 py-2 rounded-full flex items-center gap-2 hover:bg-[#000] hover:text-white transition-colors duration-300"
              >
                <FaSearch size={20} />
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default PageNav;
