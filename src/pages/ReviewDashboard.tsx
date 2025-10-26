import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useStore } from "../store/useStore";
// import { Submission } from "../types"; // Available for future use
import TabNavigation from "../components/TabNavigation";
import SubmissionCard from "../components/SubmissionCard";

const ReviewDashboard: React.FC = () => {
  const { hackathonId } = useParams<{ hackathonId: string }>();
  const { currentReview } = useStore();
  // const { updateSubmission } = useStore(); // Available for future use
  const [activeTab, setActiveTab] = useState("promising");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "name">("score");

  // Filter submissions by category
  const submissionsByCategory = useMemo(() => {
    if (!currentReview) return { ineligible: [], filtered: [], promising: [] };

    const ineligible = currentReview.submissions.filter(
      (s) => s.category === "ineligible"
    );
    const filtered = currentReview.submissions.filter(
      (s) => s.category === "filtered"
    );
    const promising = currentReview.submissions.filter(
      (s) => s.category === "promising"
    );

    return { ineligible, filtered, promising };
  }, [currentReview]);

  // Get current tab submissions
  const currentSubmissions = useMemo(() => {
    const submissions =
      submissionsByCategory[activeTab as keyof typeof submissionsByCategory] ||
      [];

    // Filter by search term
    const filtered = searchTerm
      ? submissions.filter(
          (submission) =>
            submission.projectName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            submission.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
      : submissions;

    // Sort submissions
    return filtered.sort((a, b) => {
      if (sortBy === "score") {
        return b.overallScore - a.overallScore;
      } else {
        return a.projectName.localeCompare(b.projectName);
      }
    });
  }, [submissionsByCategory, activeTab, searchTerm, sortBy]);

  const tabs = [
    {
      id: "promising",
      label: "Promising",
      count: submissionsByCategory.promising.length,
      icon: "✅",
      color: "success",
    },
    {
      id: "filtered",
      label: "Filtered Out",
      count: submissionsByCategory.filtered.length,
      icon: "⚠️",
      color: "warning",
    },
    {
      id: "ineligible",
      label: "Ineligible",
      count: submissionsByCategory.ineligible.length,
      icon: "🚫",
      color: "danger",
    },
  ];

  // These functions are available for future use in the dashboard
  // const handleToggleFavorite = (submissionId: string, isFavorite: boolean) => {
  //   updateSubmission(submissionId, { isFavorite: !isFavorite });
  // };

  // const handleCategoryChange = (
  //   submissionId: string,
  //   newCategory: Submission["category"]
  // ) => {
  //   updateSubmission(submissionId, { category: newCategory });
  // };

  if (!currentReview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Review Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The hackathon review you're looking for doesn't exist.
          </p>
          <Link to="/upload" className="btn-primary">
            Start New Review
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-glass-gradient backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold text-white">
                {currentReview.name}
              </h1>
              <p className="text-gray-300">
                {currentReview.submissions.length} total submissions
              </p>
            </div>
            <div className="flex items-center space-x-4 animate-scale-in">
              <Link to="/upload" className="btn-secondary">
                New Review
              </Link>
              <button className="btn-primary">Export Results</button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative z-10 bg-glass-gradient backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 bg-glass-gradient backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search submissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10 w-64"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-300">
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "score" | "name")}
                className="input-field w-32"
              >
                <option value="score">Score</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentSubmissions.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-6xl mb-4">
              {activeTab === "promising" && "✅"}
              {activeTab === "filtered" && "⚠️"}
              {activeTab === "ineligible" && "🚫"}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No {tabs.find((t) => t.id === activeTab)?.label} submissions
            </h3>
            <p className="text-gray-300">
              {searchTerm
                ? "No submissions match your search criteria."
                : "All submissions have been processed and categorized."}
            </p>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="mb-6 animate-slide-up">
              <p className="text-gray-300">
                Showing {currentSubmissions.length} of{" "}
                {
                  submissionsByCategory[
                    activeTab as keyof typeof submissionsByCategory
                  ].length
                }{" "}
                submissions
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>

            {/* Submissions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentSubmissions.map((submission, index) => (
                <div
                  key={submission.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <SubmissionCard
                    submission={submission}
                    hackathonId={hackathonId!}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewDashboard;
