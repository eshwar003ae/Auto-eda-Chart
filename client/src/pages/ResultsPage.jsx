import React, { useContext, useState } from 'react';
import { AnalysisContext } from '../context/AnalysisContext';
import { Activity, Database, FileText, Send } from 'lucide-react';
import axios from 'axios';

export default function ResultsPage() {
  // Now we pull the saved file directly from context!
  const { analysisResult, setAnalysisResult, currentFile } = useContext(AnalysisContext);
  const [newPrompt, setNewPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  // Fallback if they visit without uploading
  if (!analysisResult) {
    return (
      <div className="min-h-screen bg-[#13131a] flex flex-col items-center justify-center font-sans text-white w-full">
        <h2 className="text-2xl font-bold mb-4">No Analysis Data Found</h2>
        <p className="text-gray-400">Please go back to the dashboard and upload a dataset to view results.</p>
      </div>
    );
  }

  const { filename, plots, summary } = analysisResult;

  // This function sends the new prompt without leaving the page
  const handleNewAnalysis = async () => {
    if (!currentFile) {
        alert("File lost! Please re-upload.");
        return;
    }
    if (!newPrompt.trim()) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", currentFile);
    formData.append("prompt", newPrompt);

    try {
      const res = await axios.post("http://localhost:8000/api/analyze", formData);
      setAnalysisResult(res.data); // This instantly updates the UI with the new chart!
      setNewPrompt(""); // Clear the input bar
    } catch (err) {
      alert("Error generating new chart.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#13131a] p-8 font-sans text-white w-full">
      
      {/* Top Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-wide">Auto EDA <span className="text-blue-500">Dashboard</span></h1>
      </div>

      {/* NEW PROMPT BAR: Ask for new charts here! */}
      <div className="bg-[#1c1c24] border border-gray-800 p-4 rounded-2xl shadow-lg mb-8 flex gap-4">
        <input
          type="text"
          placeholder="Ask for a new chart (e.g., 'histogram of Age')"
          className="flex-1 bg-[#13131a] text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500"
          value={newPrompt}
          onChange={(e) => setNewPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleNewAnalysis()}
        />
        <button
          onClick={handleNewAnalysis}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2"
        >
          {loading ? "Analyzing..." : <><Send size={18} /> Analyze</>}
        </button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium mb-1">Dataset Analyzed</p>
              <h2 className="text-xl font-bold truncate w-48">{filename || "Data.csv"}</h2>
            </div>
            <FileText size={32} className="text-indigo-200 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm font-medium mb-1">Analysis Engine</p>
              <h2 className="text-2xl font-bold">Matplotlib</h2>
            </div>
            <Database size={32} className="text-teal-200 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-100 text-sm font-medium mb-1">Status</p>
              <h2 className="text-2xl font-bold">Complete</h2>
            </div>
            <Activity size={32} className="text-rose-200 opacity-80" />
          </div>
        </div>
      </div>

      {/* Main Plot Area */}
      {plots && plots.length > 0 && (
        <div className="bg-[#1c1c24] border border-gray-800 p-6 rounded-2xl shadow-2xl mb-8">
          <h3 className="text-xl font-semibold mb-6 text-gray-200">Generated Visualization: {plots[0].prompt}</h3>
          <div className="w-full flex justify-center p-4 overflow-hidden">
            <img 
              src={`data:image/png;base64,${plots[0].plot_base64}`} 
              alt="Generated EDA Chart" 
              className="max-w-full h-auto object-contain rounded-lg shadow-sm"
            />
          </div>
        </div>
      )}

      {/* Summary Statistics Area */}
      {summary && (
        <div className="bg-[#1c1c24] border border-gray-800 p-6 rounded-2xl shadow-2xl">
          <h3 className="text-xl font-semibold mb-6 text-gray-200">Summary Statistics</h3>
          <div className="bg-[#13131a] p-4 rounded-xl overflow-x-auto text-sm text-gray-300 font-mono">
             <pre>{JSON.stringify(summary, null, 2)}</pre>
          </div>
        </div>
      )}

    </div>
  );
}