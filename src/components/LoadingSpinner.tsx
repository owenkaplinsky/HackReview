import React from "react";
import { ProcessingStatus } from "../types";

interface LoadingSpinnerProps {
  status: ProcessingStatus;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  status,
  className = "",
}) => {
  const getStageMessage = (stage: ProcessingStatus["stage"]) => {
    switch (stage) {
      case "generating-schema":
        return "Generating evaluation schema from rubric...";
      case "checking-eligibility":
        return "Checking submission eligibility...";
      case "grading-projects":
        return "Grading projects with AI...";
      case "running-debate":
        return "Running debate agents for analysis...";
      case "complete":
        return "Processing complete!";
      default:
        return "Processing submissions...";
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 ${className}`}
    >
      <div className="glass-card max-w-lg w-full text-center">
        <div className="relative mb-6">
          {/* Progress Ring */}
          <svg
            className="w-24 h-24 transform -rotate-90 animate-spin mx-auto"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-white/20"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${
                2 * Math.PI * 40 * (1 - status.progress / 100)
              }`}
              className="text-purple-500 transition-all duration-500 ease-in-out"
              strokeLinecap="round"
            />
          </svg>

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-purple-gradient rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="animate-fade-in">
          <h3 className="text-xl font-semibold text-white mb-3">
            {getStageMessage(status.stage)}
          </h3>
          <p className="text-gray-300 mb-6">
            {status.message ||
              "Please wait while we process your submissions..."}
          </p>
          <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm mb-3">
            <div
              className="bg-purple-gradient h-3 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${status.progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400">
            {Math.round(status.progress)}% complete
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
