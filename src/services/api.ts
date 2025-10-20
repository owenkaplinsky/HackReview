import {
  SchemaResponse,
  EligibilityResponse,
  GradeResponse,
  ApiResponse,
} from "../types";

// API Configuration
const API_CONFIG = {
  schema: {
    url: "https://json-schema-generator-v1-b736a10b-587d-4293-e28d5341.crewai.com/process",
    token: "4d532d9f9334",
  },
  eligibility: {
    url: "https://eligibility-checker-v1-2b496156-9577-437e-b-85b4383a.crewai.com/process",
    token: "3a31beee5630",
  },
  grader: {
    url: "https://project-grader-v1-3c796d0f-e52d-4694-925e-1-90a2be90.crewai.com/process",
    token: "524b37e696d5",
  },
};

// Demo mode flag - set to true to use demo data instead of real APIs
const DEMO_MODE = true;

class ApiService {
  private async request<T>(
    url: string,
    token: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("API request failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async generateSchema(rubric: string): Promise<ApiResponse<SchemaResponse>> {
    if (DEMO_MODE) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        success: true,
        data: {
          schema: {
            innovation: 20,
            technicalImplementation: 25,
            userExperience: 20,
            problemSolving: 20,
            presentation: 15,
          },
        },
      };
    }

    return this.request<SchemaResponse>(
      API_CONFIG.schema.url,
      API_CONFIG.schema.token,
      {
        method: "POST",
        body: JSON.stringify({ rubric }),
      }
    );
  }

  async checkEligibility(
    requirements: string,
    submission: any
  ): Promise<ApiResponse<EligibilityResponse>> {
    if (DEMO_MODE) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Demo eligibility logic
      const isEligible = this.checkDemoEligibility(submission);

      return {
        success: true,
        data: {
          eligible: isEligible,
          reason: isEligible
            ? "Submission meets all eligibility requirements"
            : this.getDemoEligibilityReason(submission),
        },
      };
    }

    return this.request<EligibilityResponse>(
      API_CONFIG.eligibility.url,
      API_CONFIG.eligibility.token,
      {
        method: "POST",
        body: JSON.stringify({ requirements, submission }),
      }
    );
  }

  async gradeProject(
    rubric: string,
    schema: any,
    submission: any
  ): Promise<ApiResponse<GradeResponse>> {
    if (DEMO_MODE) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Demo grading logic
      const scores = this.generateDemoScores(submission);
      const overallScore = Object.values(scores).reduce(
        (sum, score) => sum + score,
        0
      );
      const recommendation = this.getDemoRecommendation(overallScore);

      return {
        success: true,
        data: {
          scores,
          overallScore,
          devilsAdvocate: this.generateDevilsAdvocate(submission),
          praiseAgent: this.generatePraiseAgent(submission),
          recommendation,
        },
      };
    }

    return this.request<GradeResponse>(
      API_CONFIG.grader.url,
      API_CONFIG.grader.token,
      {
        method: "POST",
        body: JSON.stringify({ rubric, schema, submission }),
      }
    );
  }

  // Demo helper methods
  private checkDemoEligibility(submission: any): boolean {
    const description = submission.description || "";
    const teamMembers = submission.team_members || submission.teamMembers || [];
    const demoLink = submission.demo_link || submission.demoLink || "";

    return (
      description.length >= 500 &&
      teamMembers.length >= 2 &&
      teamMembers.length <= 4 &&
      demoLink.length > 0
    );
  }

  private getDemoEligibilityReason(submission: any): string {
    const reasons = [];
    const description = submission.description || "";
    const teamMembers = submission.team_members || submission.teamMembers || [];
    const demoLink = submission.demo_link || submission.demoLink || "";

    if (description.length < 500) {
      reasons.push(
        "Project description is too brief (less than 500 words required)"
      );
    }
    if (teamMembers.length < 2) {
      reasons.push("Team size is too small (minimum 2 members required)");
    }
    if (teamMembers.length > 4) {
      reasons.push("Team size exceeds maximum of 4 members");
    }
    if (demoLink.length === 0) {
      reasons.push("Missing demo link or video");
    }

    return reasons.join(". ");
  }

  private generateDemoScores(submission: any): Record<string, number> {
    const projectName = (
      submission.project_name ||
      submission.name ||
      ""
    ).toLowerCase();
    const description = (submission.description || "").toLowerCase();

    // Base scores with some variation
    let innovation = 15 + Math.floor(Math.random() * 6);
    let technical = 18 + Math.floor(Math.random() * 8);
    let ux = 15 + Math.floor(Math.random() * 6);
    let problemSolving = 16 + Math.floor(Math.random() * 5);
    let presentation = 12 + Math.floor(Math.random() * 4);

    // Adjust based on project characteristics
    if (projectName.includes("ai") || projectName.includes("ml")) {
      innovation += 3;
      technical += 2;
    }
    if (description.includes("mobile") || description.includes("app")) {
      ux += 2;
    }
    if (description.includes("blockchain") || description.includes("vr")) {
      technical += 3;
      innovation += 2;
    }

    return {
      innovation: Math.min(20, innovation),
      technicalImplementation: Math.min(25, technical),
      userExperience: Math.min(20, ux),
      problemSolving: Math.min(20, problemSolving),
      presentation: Math.min(15, presentation),
    };
  }

  private getDemoRecommendation(
    overallScore: number
  ): "promising" | "filtered" | "ineligible" {
    if (overallScore >= 75) return "promising";
    if (overallScore >= 50) return "filtered";
    return "ineligible";
  }

  private generateDevilsAdvocate(submission: any): string {
    const projectName =
      submission.project_name || submission.name || "this project";
    const critiques = [
      `While ${projectName} shows promise, the technical implementation appears to rely heavily on existing libraries without much innovation.`,
      `The user interface seems basic and may not scale well for enterprise use.`,
      `The team's presentation lacked depth in discussing potential security concerns.`,
      `The concept, while interesting, doesn't address a unique problem that hasn't been solved before.`,
      `The technical architecture seems overly complex for the problem being solved.`,
      `There are concerns about the scalability and performance of the proposed solution.`,
      `The team didn't adequately address potential privacy and data security issues.`,
      `The market research and user validation appear to be insufficient.`,
    ];

    return (
      critiques[Math.floor(Math.random() * critiques.length)] +
      " " +
      critiques[Math.floor(Math.random() * critiques.length)]
    );
  }

  private generatePraiseAgent(submission: any): string {
    const projectName =
      submission.project_name || submission.name || "this project";
    const praises = [
      `${projectName} demonstrates excellent understanding of real-world developer pain points.`,
      `The AI integration is well-thought-out and the features are innovative.`,
      `The team shows strong technical skills and the demo was polished and functional.`,
      `The problem-solving approach is comprehensive and addresses a genuine need.`,
      `Excellent focus on user experience and inclusive design principles.`,
      `The technical implementation is solid and shows good understanding of best practices.`,
      `The project has strong potential for positive social impact.`,
      `The team clearly understands the target user base and their needs.`,
    ];

    return (
      praises[Math.floor(Math.random() * praises.length)] +
      " " +
      praises[Math.floor(Math.random() * praises.length)]
    );
  }
}

export const apiService = new ApiService();
