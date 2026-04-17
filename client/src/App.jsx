// client/src/App.js
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UploadForm from "./pages/UploadForm";
import ResultsPage from "./pages/ResultsPage"; // Import the new component
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// Assuming you have a provider for your analysis context
import { AnalysisProvider } from "./context/AnalysisContext";

function App() {
  return (
    <div className="min-h-screen pt-16">
      <Navbar />
      <AnalysisProvider> {/* Wrap the routes with the context provider */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadForm />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/results" 
            element={
              <ProtectedRoute>
                <ResultsPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AnalysisProvider>
    </div>
  );
}

export default App;