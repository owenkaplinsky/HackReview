import React, { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { Submission } from "../types";
import ScoreDisplay from "../components/ScoreDisplay";
import DebateView from "../components/DebateView";
import RubricBreakdown from "../components/RubricBreakdown";

const SubmissionDetail: React.FC = () => {
  const { hackathonId, submissionId } = useParams<{
    hackathonId: string;
    submissionId: string;
  }>();
  const { currentReview, updateSubmission } = useStore();
  const navigate = useNavigate();

  const [organizerNotes, setOrganizerNotes] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] =
    useState<Submission["category"]>("promising");

  const submission = useMemo(() => {
    if (!currentReview) return null;
    return currentReview.submissions.find((s) => s.id === submissionId) || null;
  }, [currentReview, submissionId]);

  const submissionIndex = useMemo(() => {
    if (!currentReview || !submission) return -1;
    return currentReview.submissions.findIndex((s) => s.id === submissionId);
  }, [currentReview, submission, submissionId]);

  const previousSubmission = useMemo(() => {
    if (!currentReview || submissionIndex <= 0) return null;
    return currentReview.submissions[submissionIndex - 1];
  }, [currentReview, submissionIndex]);

  const nextSubmission = useMemo(() => {
    if (
      !currentReview ||
      submissionIndex === -1 ||
      submissionIndex >= currentReview.submissions.length - 1
    )
      return null;
    return currentReview.submissions[submissionIndex + 1];
  }, [currentReview, submissionIndex]);

  const handleToggleFavorite = () => {
    if (submission) {
      updateSubmission(submission.id, { isFavorite: !submission.isFavorite });
    }
  };

  const handleSaveNotes = () => {
    if (submission) {
      updateSubmission(submission.id, { organizerNotes: organizerNotes });
    }
  };

  const handleCategoryChange = () => {
    if (submission) {
      updateSubmission(submission.id, { category: newCategory });
      setShowCategoryModal(false);
    }
  };

  const getCategoryColor = (category: Submission["category"]) => {
    switch (category) {
      case "ineligible":
        return "bg-danger-100 text-danger-800 border-danger-200";
      case "filtered":
        return "bg-warning-100 text-warning-800 border-warning-200";
      case "promising":
        return "bg-success-100 text-success-800 border-success-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  if (!currentReview || !submission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Submission Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The submission you're looking for doesn't exist.
          </p>
          <Link to={`/review/${hackathonId}`} className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to={`/review/${hackathonId}`} className="btn-secondary">
                ← Back to Dashboard
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {submission.projectName}
                </h1>
                <p className="text-gray-600">{currentReview.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-lg transition-colors ${
                  submission.isFavorite
                    ? "text-yellow-500 bg-yellow-50"
                    : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
                }`}
              >
                <span className="text-2xl">⭐</span>
              </button>

              <button
                onClick={() => setShowCategoryModal(true)}
                className="btn-secondary"
              >
                Move Category
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Information */}
            <div className="card">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">
                    {getCategoryIcon(submission.category)}
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Project Information
                    </h2>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(
                        submission.category
                      )}`}
                    >
                      {getCategoryLabel(submission.category)}
                    </span>
                  </div>
                </div>

                {submission.demoLink && (
                  <a
                    href={submission.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    View Demo
                  </a>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-900 leading-relaxed">
                    {submission.description}
                  </p>
                </div>

                {submission.teamMembers &&
                  submission.teamMembers.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Team Members
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {submission.teamMembers.map((member, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                          >
                            {member}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {submission.category === "ineligible" &&
                  submission.eligibilityReason && (
                    <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-danger-800 mb-2">
                        Ineligibility Reason
                      </h3>
                      <p className="text-danger-700">
                        {submission.eligibilityReason}
                      </p>
                    </div>
                  )}
              </div>
            </div>

            {/* AI Evaluation */}
            {submission.category !== "ineligible" && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  AI Evaluation
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Overall Score */}
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">
                      Overall Score
                    </h3>
                    <ScoreDisplay
                      score={submission.overallScore}
                      size="lg"
                      showLabel
                      label="Score"
                    />
                  </div>

                  {/* Rubric Breakdown */}
                  <div>
                    <RubricBreakdown
                      rubricScores={submission.rubricScores}
                      maxScore={10}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Debate Section */}
            {submission.category === "promising" && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  AI Debate Analysis
                </h2>
                <DebateView
                  devilsAdvocate={submission.devilsAdvocate}
                  praiseAgent={submission.praiseAgent}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Navigation */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Navigation
              </h3>
              <div className="flex justify-between">
                <button
                  onClick={() =>
                    previousSubmission &&
                    navigate(
                      `/review/${hackathonId}/submission/${previousSubmission.id}`
                    )
                  }
                  disabled={!previousSubmission}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                <button
                  onClick={() =>
                    nextSubmission &&
                    navigate(
                      `/review/${hackathonId}/submission/${nextSubmission.id}`
                    )
                  }
                  disabled={!nextSubmission}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Organizer Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Organizer Actions
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={organizerNotes}
                    onChange={(e) => setOrganizerNotes(e.target.value)}
                    className="input-field h-24 resize-none"
                    placeholder="Add your notes about this submission..."
                  />
                  <button
                    onClick={handleSaveNotes}
                    className="btn-primary w-full mt-2"
                  >
                    Save Notes
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button className="btn-secondary w-full mb-2">
                    Export as PDF
                  </button>
                  <button className="btn-secondary w-full">
                    Share Results
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">
                    {getCategoryLabel(submission.category)}
                  </span>
                </div>
                {submission.category !== "ineligible" && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Score:</span>
                    <span className="font-medium">
                      {submission.overallScore}/100
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Favorite:</span>
                  <span className="font-medium">
                    {submission.isFavorite ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Position:</span>
                  <span className="font-medium">
                    {submissionIndex + 1} of {currentReview.submissions.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Change Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Move to Category
            </h3>
            <p className="text-gray-600 mb-4">
              Select a new category for this submission:
            </p>

            <div className="space-y-3 mb-6">
              {(["promising", "filtered", "ineligible"] as const).map(
                (category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={newCategory === category}
                      onChange={(e) =>
                        setNewCategory(e.target.value as Submission["category"])
                      }
                      className="mr-3"
                    />
                    <span className="flex items-center">
                      <span className="mr-2">{getCategoryIcon(category)}</span>
                      {getCategoryLabel(category)}
                    </span>
                  </label>
                )
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button onClick={handleCategoryChange} className="btn-primary">
                Move
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionDetail;
