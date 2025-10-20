import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { apiService } from "../services/api";
import { HackathonReview, Submission } from "../types";
import FileUploader from "../components/FileUploader";
import LoadingSpinner from "../components/LoadingSpinner";

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { addReview, setProcessingStatus, processingStatus } = useStore();

  const [formData, setFormData] = useState({
    hackathonName: "",
    rubric: "",
    requirements: "",
    submissions: [] as any[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleRubricFileUpload = useCallback((files: File[]) => {
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFormData((prev) => ({ ...prev, rubric: content }));
      };
      reader.readAsText(file);
    }
  }, []);

  const handleSubmissionsFileUpload = useCallback((files: File[]) => {
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          if (file.name.endsWith(".json")) {
            const submissions = JSON.parse(content);
            setFormData((prev) => ({ ...prev, submissions }));
          } else if (file.name.endsWith(".csv")) {
            // Simple CSV parsing (in a real app, you'd use a proper CSV parser)
            const lines = content.split("\n");
            const headers = lines[0].split(",");
            const submissions = lines.slice(1).map((line) => {
              const values = line.split(",");
              const submission: any = {};
              headers.forEach((header, index) => {
                submission[header.trim()] = values[index]?.trim() || "";
              });
              return submission;
            });
            setFormData((prev) => ({ ...prev, submissions }));
          }
        } catch (error) {
          setErrors((prev) => ({
            ...prev,
            submissions: "Invalid file format",
          }));
        }
      };
      reader.readAsText(file);
    }
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.hackathonName.trim()) {
      newErrors.hackathonName = "Hackathon name is required";
    }

    // For demo mode, make other fields optional
    if (!formData.rubric.trim()) {
      newErrors.rubric = "Rubric is required";
    }

    if (!formData.requirements.trim()) {
      newErrors.requirements = "Eligibility requirements are required";
    }

    if (formData.submissions.length === 0) {
      newErrors.submissions = "At least one submission is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const processSubmissions = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Step 1: Generate Schema from rubric
      setProcessingStatus({
        stage: "generating-schema",
        progress: 10,
        message: "Generating evaluation schema from rubric...",
      });

      const schemaResponse = await apiService.generateSchema(formData.rubric);
      if (!schemaResponse.success || !schemaResponse.data) {
        throw new Error(schemaResponse.error || "Failed to generate schema");
      }

      // Step 2: Process each submission
      const processedSubmissions: Submission[] = [];
      const totalSubmissions = formData.submissions.length;

      for (let i = 0; i < totalSubmissions; i++) {
        const submission = formData.submissions[i];

        // Update progress
        const baseProgress = 20 + (i / totalSubmissions) * 60;
        setProcessingStatus({
          stage: "checking-eligibility",
          progress: baseProgress,
          message: `Processing submission ${i + 1} of ${totalSubmissions}...`,
        });

        // Check eligibility
        const eligibilityResponse = await apiService.checkEligibility(
          formData.requirements,
          submission
        );

        if (!eligibilityResponse.success || !eligibilityResponse.data) {
          console.error("Eligibility check failed for submission:", submission);
          continue;
        }

        const { eligible, reason } = eligibilityResponse.data;

        if (!eligible) {
          processedSubmissions.push({
            id: `submission-${i}`,
            projectName:
              submission.project_name || submission.name || `Project ${i + 1}`,
            description: submission.description || "",
            demoLink: submission.demo_link || submission.demoLink,
            teamMembers: submission.team_members || submission.teamMembers,
            category: "ineligible",
            eligibilityReason: reason,
            overallScore: 0,
            rubricScores: {},
            devilsAdvocate: "",
            praiseAgent: "",
            isFavorite: false,
          });
          continue;
        }

        // Grade project
        setProcessingStatus({
          stage: "grading-projects",
          progress: baseProgress + 10,
          message: `Grading submission ${i + 1} of ${totalSubmissions}...`,
        });

        const gradeResponse = await apiService.gradeProject(
          formData.rubric,
          schemaResponse.data.schema,
          submission
        );

        if (!gradeResponse.success || !gradeResponse.data) {
          console.error("Grading failed for submission:", submission);
          continue;
        }

        const {
          scores,
          overallScore,
          devilsAdvocate,
          praiseAgent,
          recommendation,
        } = gradeResponse.data;

        processedSubmissions.push({
          id: `submission-${i}`,
          projectName:
            submission.project_name || submission.name || `Project ${i + 1}`,
          description: submission.description || "",
          demoLink: submission.demo_link || submission.demoLink,
          teamMembers: submission.team_members || submission.teamMembers,
          category: recommendation,
          overallScore,
          rubricScores: scores,
          devilsAdvocate,
          praiseAgent,
          isFavorite: false,
        });
      }

      // Step 3: Complete
      setProcessingStatus({
        stage: "complete",
        progress: 100,
        message: "Processing complete!",
      });

      // Create review and navigate
      const review: HackathonReview = {
        id: `hackathon-${Date.now()}`,
        name: formData.hackathonName,
        rubric: formData.rubric,
        requirements: formData.requirements,
        schema: schemaResponse.data.schema,
        submissions: processedSubmissions,
        createdAt: new Date(),
      };

      addReview(review);

      // Navigate to review dashboard
      setTimeout(() => {
        navigate(`/review/${review.id}`);
      }, 1000);
    } catch (error) {
      console.error("Processing failed:", error);
      setErrors({
        general: "Failed to process submissions. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
        <div className="max-w-md w-full relative z-10">
          <LoadingSpinner status={processingStatus} />
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
            <h1 className="text-2xl font-bold text-white animate-fade-in">
              Upload Hackathon Data
            </h1>
            <button
              onClick={() => navigate("/")}
              className="btn-secondary animate-scale-in"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* General Error */}
          {errors.general && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm animate-slide-down">
              <p className="text-red-300">{errors.general}</p>
            </div>
          )}

          {/* Hackathon Name */}
          <div className="card animate-slide-up">
            <h2 className="text-lg font-semibold text-white mb-4">
              Hackathon Information
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Hackathon Name *
              </label>
              <input
                type="text"
                value={formData.hackathonName}
                onChange={(e) =>
                  handleInputChange("hackathonName", e.target.value)
                }
                className={`input-field ${
                  errors.hackathonName ? "border-red-500" : ""
                }`}
                placeholder="Enter hackathon name"
              />
              {errors.hackathonName && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.hackathonName}
                </p>
              )}
            </div>
          </div>

          {/* Rubric Upload */}
          <div
            className="card animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <h2 className="text-lg font-semibold text-white mb-4">
              Rubric Upload
            </h2>
            <div className="space-y-4">
              <FileUploader
                onFilesAccepted={handleRubricFileUpload}
                accept={{ "text/plain": [".txt"], "application/pdf": [".pdf"] }}
                multiple={false}
                maxFiles={1}
              />
              <div className="text-center text-gray-400">or</div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Paste Rubric Text *
                </label>
                <textarea
                  value={formData.rubric}
                  onChange={(e) => handleInputChange("rubric", e.target.value)}
                  className={`input-field h-32 resize-none ${
                    errors.rubric ? "border-red-500" : ""
                  }`}
                  placeholder="Paste your hackathon rubric here..."
                />
                {errors.rubric && (
                  <p className="mt-1 text-sm text-red-400">{errors.rubric}</p>
                )}
              </div>
            </div>
          </div>

          {/* Eligibility Requirements */}
          <div
            className="card animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <h2 className="text-lg font-semibold text-white mb-4">
              Eligibility Requirements
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Requirements *
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) =>
                  handleInputChange("requirements", e.target.value)
                }
                className={`input-field h-24 resize-none ${
                  errors.requirements ? "border-red-500" : ""
                }`}
                placeholder="e.g., Minimum 500 words, must include demo video, team size 2-4 members..."
              />
              {errors.requirements && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.requirements}
                </p>
              )}
            </div>
          </div>

          {/* Submissions Upload */}
          <div
            className="card animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <h2 className="text-lg font-semibold text-white mb-4">
              Submissions Upload
            </h2>
            <div className="space-y-4">
              <FileUploader
                onFilesAccepted={handleSubmissionsFileUpload}
                accept={{
                  "text/csv": [".csv"],
                  "application/json": [".json"],
                }}
                multiple={false}
                maxFiles={1}
              />
              {formData.submissions.length > 0 && (
                <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 backdrop-blur-sm animate-slide-down">
                  <p className="text-purple-300">
                    ✅ {formData.submissions.length} submissions loaded
                    successfully
                  </p>
                </div>
              )}
              {errors.submissions && (
                <p className="text-sm text-red-400">{errors.submissions}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div
            className="flex justify-center animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <button
              onClick={processSubmissions}
              disabled={isProcessing}
              className="btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Process Submissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
