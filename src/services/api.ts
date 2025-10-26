import {
  SchemaResponse,
  EligibilityResponse,
  GradeResponse,
  ApiResponse,
} from "../types";

// Backend Configuration
const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "https://crewjudge-server.onrender.com";

class ApiService {
  // Make HTTP request
  private async makeRequest<T>(
    endpoint: string,
    data: any
  ): Promise<ApiResponse<T>> {
    try {
      console.log(`🚀 [ApiService] Making request to ${endpoint}:`, data);

      // Create an AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000);

      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `❌ [ApiService] Request failed:`,
          response.status,
          errorText
        );
        throw new Error(`Request failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log(`✅ [ApiService] Request successful:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [ApiService] Request error:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Generate schema
  async generateSchema(rubric: string): Promise<SchemaResponse> {
    console.log(
      "🔧 [ApiService] Generating schema for rubric:",
      rubric.substring(0, 100) + "..."
    );

    return await this.makeRequest("/api/schema", { hackathon_rubric: rubric });
  }

  // Check eligibility
  async checkEligibility(
    requirements: string,
    submission: any
  ): Promise<EligibilityResponse> {
    console.log(
      "🔍 [ApiService] Checking eligibility for submission:",
      submission.name || submission.project_name
    );

    // Send required fields
    const requestData = {
      project_writeup: submission.description || "",
      hackathon_requirements: requirements,
    };

    return await this.makeRequest("/api/eligibility", requestData);
  }

  // Grade project
  async gradeProject(
    rubric: string,
    schema: any,
    submission: any
  ): Promise<GradeResponse> {
    console.log(
      "📊 [ApiService] Grading project:",
      submission.name || submission.project_name
    );

    // Ensure schema is JSON object
    let jsonRubric = schema;
    if (typeof schema === "string") {
      try {
        jsonRubric = JSON.parse(schema);
        console.log("🔧 [ApiService] Parsed schema string to JSON object");
      } catch (e) {
        console.error("❌ [ApiService] Failed to parse schema string:", e);
        jsonRubric = {
          type: "object",
          properties: {
            innovation: { type: "integer", minimum: 0, maximum: 25 },
            technicalImplementation: {
              type: "integer",
              minimum: 0,
              maximum: 30,
            },
            presentation: { type: "integer", minimum: 0, maximum: 20 },
            impact: { type: "integer", minimum: 0, maximum: 25 },
          },
        };
      }
    }

    // Send required fields
    const requestData = {
      inputs: {
        hackathon_rubric: rubric,
        json_rubric: jsonRubric,
        project_writeup: submission.description || "",
      },
      taskWebhookUrl: "",
      stepWebhookUrl: "",
      crewWebhookUrl: "",
      trainingFilename: "",
      generateArtifact: false,
    };

    return await this.makeRequest("/api/grade", requestData);
  }

  // Clear storage
  async clearKickoffStorage(): Promise<ApiResponse<any>> {
    console.log("🗑️ [ApiService] Clearing kickoff storage");

    try {
      const response = await fetch(`${BACKEND_URL}/api/clear-kickoff-storage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return await response.json();
    } catch (error) {
      console.error("❌ [ApiService] Error clearing kickoff storage:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Health check
  async healthCheck(): Promise<any> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/health`);
      return await response.json();
    } catch (error) {
      return {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

export const apiService = new ApiService();
