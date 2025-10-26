import { create } from "zustand";
import { persist } from "zustand/middleware";
import { HackathonReview, Submission, ProcessingStatus } from "../types";

interface AppState {
  // Current hackathon review
  currentReview: HackathonReview | null;

  // All reviews (for future features)
  reviews: HackathonReview[];

  // Processing status
  processingStatus: ProcessingStatus;

  // Actions
  setCurrentReview: (review: HackathonReview) => void;
  addReview: (review: HackathonReview) => void;
  updateSubmission: (
    submissionId: string,
    updates: Partial<Submission>
  ) => void;
  setProcessingStatus: (status: ProcessingStatus) => void;
  clearCurrentReview: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentReview: null,
      reviews: [],
      processingStatus: {
        stage: "idle",
        progress: 0,
        message: "",
      },

      setCurrentReview: (review) => set({ currentReview: review }),

      addReview: (review) =>
        set((state) => ({
          reviews: [...state.reviews, review],
          currentReview: review,
        })),

      updateSubmission: (submissionId, updates) =>
        set((state) => {
          if (!state.currentReview) return state;

          const updatedSubmissions = state.currentReview.submissions.map(
            (submission) =>
              submission.id === submissionId
                ? { ...submission, ...updates }
                : submission
          );

          return {
            currentReview: {
              ...state.currentReview,
              submissions: updatedSubmissions,
            },
          };
        }),

      setProcessingStatus: (status) => set({ processingStatus: status }),

      clearCurrentReview: () => set({ currentReview: null }),
    }),
    {
      name: "hackathon-review-storage",
      partialize: (state) => ({
        reviews: state.reviews,
        currentReview: state.currentReview,
      }),
    }
  )
);
