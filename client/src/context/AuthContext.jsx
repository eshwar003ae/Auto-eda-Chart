

import { createContext, useState, useContext } from "react";
import axios from "axios"; // Make sure you have axios installed

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      return null;
    }
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const signup = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:8000/api/signup", {
        email,
        password,
      });
  
      if (response.status !== 200) {
        throw new Error(response.data.message || "Signup failed");
      }
  
      // If the status is 200 (OK), it means signup was successful.
      // We do not throw an error, so the catch block will not run.
  
    } catch (error) {
      console.error("Signup failed:", error);
      alert(error.message); // This will alert a more specific error message if the server provides one
      throw error; // Re-throw the error so the component can handle it if needed
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
