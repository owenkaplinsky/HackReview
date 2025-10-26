import React from "react";

interface RubricBreakdownProps {
  rubricScores: Record<string, number>;
  maxScore?: number;
  className?: string;
}

const RubricBreakdown: React.FC<RubricBreakdownProps> = ({
  rubricScores,
  maxScore = 10,
  className = "",
}) => {
  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 75) return "bg-purple-500";
    if (percentage >= 50) return "bg-purple-400";
    return "bg-red-500";
  };

  const getScoreTextColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 75) return "text-purple-300";
    if (percentage >= 50) return "text-purple-400";
    return "text-red-300";
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">
        Rubric Breakdown
      </h3>

      {Object.entries(rubricScores).map(([criterion, score]) => (
        <div key={criterion} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-300 capitalize">
              {criterion.replace(/([A-Z])/g, " $1").trim()}
            </span>
            <span
              className={`text-sm font-semibold ${getScoreTextColor(
                score,
                maxScore
              )}`}
            >
              {score}/{maxScore}
            </span>
          </div>

          <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm">
            <div
              className={`h-2 rounded-full transition-all duration-500 ease-in-out ${getScoreColor(
                score,
                maxScore
              )}`}
              style={{ width: `${(score / maxScore) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RubricBreakdown;
