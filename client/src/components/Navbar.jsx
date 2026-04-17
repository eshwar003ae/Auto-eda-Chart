import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext} from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-lg p-4 flex justify-between items-center fixed top-0 w-full z-10">
      <div className="text-2xl font-bold text-gray-800">
        <Link to="/upload">Auto EDA Chart</Link>
      </div>
      <div className="flex space-x-4">
        {user ? (
          <>
            <Link
              to="/upload"
              className="text-gray-600 hover:text-blue-600 transition duration-200"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;