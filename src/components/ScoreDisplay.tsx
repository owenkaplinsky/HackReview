import React from "react";

interface ScoreDisplayProps {
  score: number;
  maxScore?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  maxScore = 100,
  size = "md",
  showLabel = false,
  label,
  className = "",
}) => {
  const percentage = (score / maxScore) * 100;

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-12 h-12 text-sm";
      case "lg":
        return "w-24 h-24 text-2xl";
      default:
        return "w-16 h-16 text-lg";
    }
  };

  const getScoreColor = () => {
    if (percentage >= 75) return "text-purple-400";
    if (percentage >= 50) return "text-purple-500";
    return "text-red-400";
  };

  const getRingColor = () => {
    if (percentage >= 75) return "text-purple-400";
    if (percentage >= 50) return "text-purple-500";
    return "text-red-400";
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        <svg
          className={`${getSizeClasses()} transform -rotate-90`}
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
            strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
            className={`${getRingColor()} transition-all duration-500 ease-in-out`}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${getScoreColor()}`}>
            {Math.round(score)}
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="mt-2 text-center">
          <p className="text-sm font-medium text-gray-300">
            {label || "Score"}
          </p>
          <p className="text-xs text-gray-400">/ {maxScore}</p>
        </div>
      )}
    </div>
  );
};

export default ScoreDisplay;
