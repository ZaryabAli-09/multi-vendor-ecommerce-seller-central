import React, { useState } from "react";
import { AiFillProfile, AiOutlineLogout } from "react-icons/ai";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md px-4 py-2 flex justify-between items-center">
      <div className="h-8">
        <AiOutlineLogout />
      </div>
      <div className="relative">
        <div
          className="h-10 w-10 rounded-full cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <AiFillProfile />
        </div>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg">
            <a
              href="/profile"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Profile
            </a>
            <button
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => console.log("Logout")}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
