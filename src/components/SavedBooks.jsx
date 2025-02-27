import { useNavigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

function SavedBooks() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the active tab from the current URL
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    if (location.pathname.includes("reading")) setActiveTab("reading");
    else if (location.pathname.includes("completed")) setActiveTab("completed");
    else if (location.pathname.includes("saved")) setActiveTab("saved");
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-start pt-4 h-[calc(100vh-12vh)]  bg-[#918ca9] text-white ">
      {/* Button Group - Centered */}
      <div className="bg-[#c7c3dc] flex w-80 justify-between font-lato rounded-full p-[6px] shadow-xl mb-6">
        <button
          onClick={() => navigate("saved")}
          className={`flex-1 px-5 py-3 rounded-full font-semibold transition-all duration-300 ring-2 ring-transparent text-black ${
            activeTab === "saved"
              ? "bg-[#FF0800]  text-white shadow-md"
              : "hover:bg-[#918ca9]"
          }`}
        >
          Saved
        </button>
        <button
          onClick={() => navigate("reading")}
          className={`flex-1 px-5 py-3 rounded-full font-semibold transition-all duration-300 ring-2 ring-transparent text-black ${
            activeTab === "reading"
              ? "bg-[#0000FF] text-white shadow-md"
              : "hover:bg-[#918ca9]"
          }`}
        >
          Reading
        </button>
        <button
          onClick={() => navigate("completed")}
          className={`flex-1 px-5 py-3 rounded-full font-semibold transition-all duration-300 ring-2 ring-transparent text-black ${
            activeTab === "completed"
              ? "bg-[#00FF00] text-white shadow-md"
              : "hover:bg-[#918ca9]"
          }`}
        >
          Completed
        </button>
      </div>

      {/* Fixed Size Outlet Container */}
      <div className="w-[96vw] h-[70vh] bg-[#c7c3dc] p-6 rounded-lg shadow-lg flex items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}

export default SavedBooks;
