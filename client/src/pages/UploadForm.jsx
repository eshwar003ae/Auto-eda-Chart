import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AnalysisContext } from '../context/AnalysisContext';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Pulling the setters from the Context we updated earlier
  const { setAnalysisResult, setCurrentFile } = useContext(AnalysisContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert("Please select a dataset first!");
      return;
    }

    // Security Check: Make sure it's actually a CSV!
    if (!file.name.endsWith('.csv')) {
      alert("Please upload a .csv file, not an Excel file.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("prompt", prompt);

    try {
      const res = await axios.post('https://auto-eda-chart.onrender.com/api/analyze', formData);
      
      // Save the generated charts to Context
      setAnalysisResult(res.data);
      // Save the physical file to Context so the dashboard search bar works!
      setCurrentFile(file); 
      
      // Move to the dashboard
      navigate('/results');
    } catch (err) {
      console.error(err);
      alert("Backend Error! Check your FastAPI terminal to see what crashed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-[500px] text-center">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">Auto EDA Chart</h2>
        <p className="text-gray-500 mb-8">Upload Your Dataset 📊</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="border-2 border-green-500 border-dashed rounded-lg p-4 cursor-pointer hover:bg-green-50 transition-colors">
            <input 
              type="file" 
              accept=".csv"
              onChange={(e) => setFile(e.target.files[0])} 
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>

          <input 
            type="text" 
            placeholder="e.g., pie chart for Marks" 
            className="w-full p-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)} 
          />

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-purple-600 text-white p-3 rounded-lg font-bold hover:bg-purple-700 disabled:bg-purple-300 transition-colors"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>

        </form>
      </div>
    </div>
  );
}