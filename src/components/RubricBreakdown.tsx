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
    if (percentage >= 75) return "bg-success-500";
    if (percentage >= 50) return "bg-warning-500";
    return "bg-danger-500";
  };

  const getScoreTextColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 75) return "text-success-700";
    if (percentage >= 50) return "text-warning-700";
    return "text-danger-700";
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Rubric Breakdown
      </h3>

      {Object.entries(rubricScores).map(([criterion, score]) => (
        <div key={criterion} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 capitalize">
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

          <div className="w-full bg-gray-200 rounded-full h-2">
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
