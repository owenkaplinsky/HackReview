import React from "react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-glass-gradient backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold bg-purple-gradient bg-clip-text text-transparent animate-fade-in">
                HackReview
              </h1>
            </div>
            <div className="flex items-center">
              <Link to="/upload" className="btn-primary animate-scale-in">
                Start Reviewing
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-slide-up">
            AI-Powered
            <span
              className="bg-purple-gradient bg-clip-text text-transparent block animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              HackReview
            </span>
          </h1>

          <p
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto animate-slide-up"
            style={{ animationDelay: "0.6s" }}
          >
            Save 80% of your review time with our multi-agent AI system that
            automatically filters, scores, and evaluates hackathon submissions
            using intelligent debate agents.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up"
            style={{ animationDelay: "0.9s" }}
          >
            <Link to="/upload" className="btn-primary text-lg px-8 py-4">
              Start Reviewing
            </Link>
            <button className="btn-secondary text-lg px-8 py-4">
              Learn More
            </button>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-slide-up"
            style={{ animationDelay: "1.2s" }}
          >
            <div className="glass-card">
              <div className="text-3xl font-bold bg-purple-gradient bg-clip-text text-transparent mb-2">
                80%
              </div>
              <div className="text-gray-300">Time Saved</div>
            </div>
            <div className="glass-card">
              <div className="text-3xl font-bold bg-purple-gradient bg-clip-text text-transparent mb-2">
                Multi-Agent
              </div>
              <div className="text-gray-300">AI Evaluation</div>
            </div>
            <div className="glass-card">
              <div className="text-3xl font-bold bg-purple-gradient bg-clip-text text-transparent mb-2">
                Smart
              </div>
              <div className="text-gray-300">Filtering</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our AI agents work together to provide comprehensive evaluation of
              hackathon submissions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center glass-card">
              <div className="bg-purple-gradient rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">
                Upload & Setup
              </h3>
              <p className="text-gray-300">
                Upload your rubric, requirements, and submissions
              </p>
            </div>

            <div className="text-center glass-card">
              <div className="bg-purple-gradient rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">
                Eligibility Check
              </h3>
              <p className="text-gray-300">
                Automatically filter out ineligible submissions
              </p>
            </div>

            <div className="text-center glass-card">
              <div className="bg-purple-gradient rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">
                AI Scoring
              </h3>
              <p className="text-gray-300">
                Grade submissions based on your rubric
              </p>
            </div>

            <div className="text-center glass-card">
              <div className="bg-purple-gradient rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">⚖️</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">
                Debate Analysis
              </h3>
              <p className="text-gray-300">
                Devil's Advocate vs Praise agents evaluate promising submissions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card max-w-4xl mx-auto animate-slide-up">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Streamline Your Hackathon Reviews?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join hackathon organizers who have saved hundreds of hours with
              HackReview.
            </p>
            <Link to="/upload" className="btn-primary text-lg px-8 py-4">
              Get Started Now
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-glass-gradient backdrop-blur-md border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300">
            &copy; 2024 HackReview. Built with AI for hackathon organizers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
