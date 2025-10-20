import React from "react";
import { Link } from "react-router-dom";
import { Submission } from "../types";
import ScoreDisplay from "./ScoreDisplay";

interface SubmissionCardProps {
  submission: Submission;
  hackathonId: string;
  showScore?: boolean;
  className?: string;
}

const SubmissionCard: React.FC<SubmissionCardProps> = ({
  submission,
  hackathonId,
  showScore = true,
  className = "",
}) => {
  const getCategoryColor = (category: Submission["category"]) => {
    switch (category) {
      case "ineligible":
        return "border-red-500/30 bg-red-500/10";
      case "filtered":
        return "border-purple-500/30 bg-purple-500/10";
      case "promising":
        return "border-purple-500/30 bg-purple-500/10";
      default:
        return "border-white/20 bg-glass-gradient";
    }
  };

  const getCategoryIcon = (category: Submission["category"]) => {
    switch (category) {
      case "ineligible":
        return "🚫";
      case "filtered":
        return "⚠️";
      case "promising":
        return "✅";
      default:
        return "📋";
    }
  };

  const getCategoryLabel = (category: Submission["category"]) => {
    switch (category) {
      case "ineligible":
        return "Ineligible";
      case "filtered":
        return "Filtered Out";
      case "promising":
        return "Promising";
      default:
        return "Unknown";
    }
  };

  return (
    <div
      className={`card hover:shadow-lg transition-all duration-200 backdrop-blur-md ${getCategoryColor(
        submission.category
      )} ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">
            {getCategoryIcon(submission.category)}
          </span>
          <span className="text-sm font-medium text-gray-300">
            {getCategoryLabel(submission.category)}
          </span>
        </div>

        {submission.isFavorite && (
          <span className="text-yellow-400 text-xl">⭐</span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
        {submission.projectName}
      </h3>

      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
        {submission.description}
      </p>

      {submission.category === "ineligible" && submission.eligibilityReason && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
          <p className="text-sm text-red-300">
            <strong>Reason:</strong> {submission.eligibilityReason}
          </p>
        </div>
      )}

      {showScore && submission.category !== "ineligible" && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300">Overall Score:</span>
            <ScoreDisplay score={submission.overallScore} size="sm" />
          </div>
        </div>
      )}

      {submission.category === "promising" &&
        Object.keys(submission.rubricScores).length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-300 mb-2">Top Scores:</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(submission.rubricScores)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 2)
                .map(([criterion, score]) => (
                  <span
                    key={criterion}
                    className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30 backdrop-blur-sm"
                  >
                    {criterion}: {score}
                  </span>
                ))}
            </div>
          </div>
        )}

      <div className="flex items-center justify-between">
        <Link
          to={`/review/${hackathonId}/submission/${submission.id}`}
          className="btn-primary text-sm"
        >
          View Details
        </Link>

        {submission.demoLink && (
          <a
            href={submission.demoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors duration-200"
          >
            Demo →
          </a>
        )}
      </div>
    </div>
  );
};

export default SubmissionCard;
