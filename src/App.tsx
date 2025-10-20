import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import UploadPage from "./pages/UploadPage";
import ReviewDashboard from "./pages/ReviewDashboard";
import SubmissionDetail from "./pages/SubmissionDetail";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-950">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/review/:hackathonId" element={<ReviewDashboard />} />
          <Route
            path="/review/:hackathonId/submission/:submissionId"
            element={<SubmissionDetail />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
