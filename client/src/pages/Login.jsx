import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://auto-eda.onrender.com/api/login', { email, password });
      login(res.data.user); // Logs you in
      navigate('/upload');  // Sends you to the dashboard
    } catch (err) {
      alert("Login Failed! Make sure your backend is running.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-xl rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Auto EDA Login</h2>
        <input type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full p-2 mb-4 border rounded" onChange={e => setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Login</button>
      </form>
    </div>
  );
}