import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
// import { apiService } from "../services/api"; // Available for future use
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

    // For demo purposes, only require hackathon name
    if (!formData.hackathonName.trim()) {
      newErrors.hackathonName = "Hackathon name is required";
    }

    // Make other fields optional for demo
    // if (!formData.rubric.trim()) {
    //   newErrors.rubric = "Rubric is required";
    // }

    // if (!formData.requirements.trim()) {
    //   newErrors.requirements = "Eligibility requirements are required";
    // }

    // if (formData.submissions.length === 0) {
    //   newErrors.submissions = "At least one submission is required";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const processSubmissions = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Demo mode - create sample data instead of calling APIs
      setProcessingStatus({
        stage: "generating-schema",
        progress: 20,
        message: "Generating evaluation schema from rubric...",
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProcessingStatus({
        stage: "checking-eligibility",
        progress: 50,
        message: "Checking submission eligibility...",
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProcessingStatus({
        stage: "grading-projects",
        progress: 80,
        message: "Grading projects with AI...",
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProcessingStatus({
        stage: "running-debate",
        progress: 95,
        message: "Running debate agents for analysis...",
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create demo submissions
      const demoSubmissions: Submission[] = [
        {
          id: "submission-1",
          projectName: "AI-Powered Code Review Assistant",
          description:
            "An intelligent code review system that uses machine learning to automatically detect bugs, suggest improvements, and ensure code quality.",
          demoLink: "https://demo.codeassistant.com",
          teamMembers: ["Alice Johnson", "Bob Smith", "Carol Davis"],
          category: "promising",
          overallScore: 87,
          rubricScores: {
            innovation: 9,
            technicalImplementation: 8,
            userExperience: 9,
            problemSolving: 8,
            presentation: 7,
          },
          devilsAdvocate:
            "While the concept is solid, the technical implementation seems to rely heavily on existing ML libraries without much innovation. The user interface appears basic and may not scale well for enterprise use. The team's presentation lacked depth in discussing potential security concerns with AI-powered code analysis.",
          praiseAgent:
            "This project demonstrates excellent understanding of real-world developer pain points. The AI integration is well-thought-out and the code quality detection features are innovative. The team shows strong technical skills and the demo was polished and functional. The problem-solving approach is comprehensive and addresses a genuine need in the development community.",
          isFavorite: false,
        },
        {
          id: "submission-2",
          projectName: "Smart Campus Navigation",
          description:
            "A mobile app that helps students navigate university campuses using AR technology with real-time directions and accessibility support.",
          demoLink: "https://campusnav.app/demo",
          teamMembers: ["David Wilson", "Emma Brown"],
          category: "promising",
          overallScore: 82,
          rubricScores: {
            innovation: 8,
            technicalImplementation: 7,
            userExperience: 9,
            problemSolving: 8,
            presentation: 8,
          },
          devilsAdvocate:
            "The AR implementation appears to be basic and may not work reliably in all lighting conditions. The accessibility features, while mentioned, weren't demonstrated in the demo. The team size is small which might limit the scope and quality of implementation.",
          praiseAgent:
            "Excellent focus on accessibility and inclusive design. The AR navigation concept is innovative and addresses a real need for students. The user interface is intuitive and the demo showed good technical execution. The team clearly understands the target user base and their needs.",
          isFavorite: false,
        },
        {
          id: "submission-3",
          projectName: "EcoTrack - Carbon Footprint Tracker",
          description:
            "A comprehensive platform for tracking and reducing carbon footprints with personalized recommendations and community challenges.",
          demoLink: "https://ecotrack.green",
          teamMembers: [
            "Frank Miller",
            "Grace Lee",
            "Henry Taylor",
            "Ivy Chen",
          ],
          category: "filtered",
          overallScore: 65,
          rubricScores: {
            innovation: 6,
            technicalImplementation: 7,
            userExperience: 6,
            problemSolving: 7,
            presentation: 6,
          },
          devilsAdvocate:
            "The concept is not particularly novel - there are many existing carbon tracking apps. The implementation seems basic and the user interface needs significant improvement. The data accuracy and methodology for carbon calculations wasn't clearly explained.",
          praiseAgent:
            "Good social impact focus and the community features are engaging. The team shows understanding of environmental issues and the platform has potential for positive impact. The technical implementation is solid, though could use more polish.",
          isFavorite: false,
        },
        {
          id: "submission-4",
          projectName: "Blockchain Voting System",
          description:
            "A secure, transparent voting system built on blockchain technology ensuring voter anonymity while providing verifiable results.",
          demoLink: "https://securevote.blockchain",
          teamMembers: ["Liam O'Connor", "Maya Patel", "Noah Kim"],
          category: "ineligible",
          eligibilityReason:
            "Project description is too brief (less than 500 words required). Missing demo video link. Team size exceeds maximum of 4 members.",
          overallScore: 0,
          rubricScores: {},
          devilsAdvocate: "",
          praiseAgent: "",
          isFavorite: false,
        },
      ];

      setProcessingStatus({
        stage: "complete",
        progress: 100,
        message: "Processing complete!",
      });

      // Create review and navigate
      const review: HackathonReview = {
        id: `hackathon-${Date.now()}`,
        name: formData.hackathonName || "Demo Hackathon",
        rubric: formData.rubric || "Demo rubric for evaluation",
        requirements: formData.requirements || "Demo requirements",
        schema: {
          innovation: 10,
          technicalImplementation: 10,
          userExperience: 10,
          problemSolving: 10,
          presentation: 10,
        },
        submissions: demoSubmissions,
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
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
