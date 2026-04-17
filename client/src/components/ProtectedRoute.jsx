import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Imports your auth state

export default function ProtectedRoute({ children }) {
  // Grab the 'user' data from your AuthContext
  const { user } = useContext(AuthContext);

  // If there is no user logged in, redirect them to the Login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If they ARE logged in, render the page they were trying to go to!
  return children;
}