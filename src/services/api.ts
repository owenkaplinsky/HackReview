import {
  SchemaResponse,
  EligibilityResponse,
  GradeResponse,
  ApiResponse,
} from "../types";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
    return this.request<SchemaResponse>("/api/generate-schema", {
      method: "POST",
      body: JSON.stringify({ rubric }),
    });
  }

  async checkEligibility(
    requirements: string,
    submission: any
  ): Promise<ApiResponse<EligibilityResponse>> {
    return this.request<EligibilityResponse>("/api/check-eligibility", {
      method: "POST",
      body: JSON.stringify({ requirements, submission }),
    });
  }

  async gradeProject(
    rubric: string,
    schema: any,
    submission: any
  ): Promise<ApiResponse<GradeResponse>> {
    return this.request<GradeResponse>("/api/grade-project", {
      method: "POST",
      body: JSON.stringify({ rubric, schema, submission }),
    });
  }
}

export const apiService = new ApiService();
