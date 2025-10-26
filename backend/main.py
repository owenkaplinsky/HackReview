from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
import requests
import time
import os
import asyncio
import json
import random
from datetime import datetime
from dotenv import load_dotenv
import uvicorn
from contextlib import asynccontextmanager

load_dotenv()

app = FastAPI(title="CrewAI Hackathon Backend", version="1.0.0")

# In-memory storage for kickoff IDs (in production, use a database)
kickoff_storage = {}
KICKOFF_STORAGE_FILE = "kickoff_storage.json"

def load_kickoff_storage():
    """Load kickoff storage from file"""
    global kickoff_storage
    try:
        if os.path.exists(KICKOFF_STORAGE_FILE):
            with open(KICKOFF_STORAGE_FILE, 'r') as f:
                kickoff_storage = json.load(f)
                print(f"📁 Loaded {len(kickoff_storage)} kickoff IDs from storage")
    except Exception as e:
        print(f"⚠️ Error loading kickoff storage: {e}")
        kickoff_storage = {}

def save_kickoff_storage():
    """Save kickoff storage to file"""
    try:
        with open(KICKOFF_STORAGE_FILE, 'w') as f:
            json.dump(kickoff_storage, f, indent=2)
    except Exception as e:
        print(f"⚠️ Error saving kickoff storage: {e}")

def clear_kickoff_storage():
    """Clear all kickoff storage"""
    global kickoff_storage
    kickoff_storage.clear()
    try:
        if os.path.exists(KICKOFF_STORAGE_FILE):
            os.remove(KICKOFF_STORAGE_FILE)
        print("✅ Cleared all kickoff storage")
    except Exception as e:
        print(f"⚠️ Error clearing kickoff storage: {e}")

load_kickoff_storage()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000", 
        "http://localhost:3001", 
        "http://127.0.0.1:3001",
        "https://crew-judge.vercel.app",
        "https://crew-judge.vercel.app/",
        "https://www.crew-judge.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# API Configuration
API_CONFIG = {
    "schema": {
        "base_url": os.getenv("SCHEMA_API_URL"),
        "token": os.getenv("SCHEMA_API_TOKEN"),
    },
    "eligibility": {
        "base_url": os.getenv("ELIGIBILITY_API_URL"),
        "token": os.getenv("ELIGIBILITY_API_TOKEN"),
    },
    "grader": {
        "base_url": os.getenv("GRADER_API_URL"),
        "token": os.getenv("GRADER_API_TOKEN"),
    },
}

# Pydantic models
class SchemaRequest(BaseModel):
    hackathon_rubric: str

class EligibilityRequest(BaseModel):
    project_writeup: str
    hackathon_requirements: str
    team_members: Optional[List[str]] = []
    demo_link: Optional[str] = ""
    project_name: Optional[str] = ""

class GraderRequest(BaseModel):
    inputs: Dict[str, Any]
    taskWebhookUrl: Optional[str] = ""
    stepWebhookUrl: Optional[str] = ""
    crewWebhookUrl: Optional[str] = ""
    trainingFilename: Optional[str] = ""
    generateArtifact: Optional[bool] = False
    
    model_config = {"extra": "allow"}

class ApiResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    error: Optional[str] = None

class KickoffStatus(BaseModel):
    kickoff_id: str
    status: str  # PENDING, SUCCESS, FAILED, TIMEOUT
    created_at: str
    api_type: str
    submission_id: Optional[str] = None
    result: Optional[Any] = None
    error: Optional[str] = None

class ResumeRequest(BaseModel):
    kickoff_ids: List[str]


# CrewAI API calls with kickoff persistence
async def crew_ai_request(base_url: str, token: str, payload: Dict[str, Any], timeout: int = 30, api_type: str = "unknown", submission_id: str = None) -> Dict[str, Any]:
    """Make a CrewAI API request using kickoff/status pattern with persistence"""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        # Kickoff request
        print(f"🚀 [CrewAI] Sending kickoff request to {base_url}/kickoff")
        print(f"🚀 [CrewAI] Payload: {payload}")
        
        # Retry logic with circuit breaker
        max_retries = 8
        consecutive_503_errors = 0
        
        for attempt in range(max_retries):
            try:
                print(f"🚀 [CrewAI] Kickoff attempt {attempt + 1}/{max_retries}")
                
                # Random jitter
                if attempt > 0:
                    jitter = random.uniform(1, 3)
                    time.sleep(jitter)
                
                kickoff_response = requests.post(f"{base_url}/kickoff", headers=headers, json=payload, timeout=timeout)
                kickoff_response.raise_for_status()
                kickoff_data = kickoff_response.json()
                kickoff_id = kickoff_data["kickoff_id"]
                consecutive_503_errors = 0
                break
                
            except requests.exceptions.Timeout:
                print(f"⏰ [CrewAI] Kickoff timeout on attempt {attempt + 1}")
                if attempt == max_retries - 1:
                    raise
                time.sleep(8 * (attempt + 1))
                
            except requests.exceptions.HTTPError as e:
                if e.response.status_code in [504, 503]:
                    consecutive_503_errors += 1
                    error_type = "Gateway timeout" if e.response.status_code == 504 else "Service unavailable"
                    print(f"🔄 [CrewAI] {error_type} on attempt {attempt + 1} (consecutive 503s: {consecutive_503_errors})")
                    
                    # Circuit breaker
                    if consecutive_503_errors >= 3:
                        print(f"⚠️ [CrewAI] Circuit breaker: Too many 503 errors, waiting longer...")
                        wait_time = 60 + (20 * consecutive_503_errors)
                    else:
                        wait_time = 30 * (attempt + 1)
                    
                    if attempt == max_retries - 1:
                        print(f"❌ [CrewAI] All retry attempts failed. Service overloaded.")
                        raise
                    
                    print(f"⏳ [CrewAI] Waiting {wait_time} seconds before retry...")
                    time.sleep(wait_time)
                else:
                    raise
        
        print(f"🎯 [CrewAI] Got kickoff_id: {kickoff_id}")
        
        # Store kickoff ID
        kickoff_storage[kickoff_id] = {
            "status": "PENDING",
            "created_at": datetime.now().isoformat(),
            "api_type": api_type,
            "submission_id": submission_id,
            "base_url": base_url,
            "token": token,
            "result": None,
            "error": None
        }
        save_kickoff_storage()
        
        # Poll for status
        max_attempts = 20
        for attempt in range(max_attempts):
            print(f"⏳ [CrewAI] Polling attempt {attempt + 1}/{max_attempts}")
            time.sleep(10)
            
            # Retry logic for status requests
            status_retries = 2
            for status_attempt in range(status_retries):
                try:
                    status_response = requests.get(f"{base_url}/status/{kickoff_id}", headers=headers, timeout=timeout)
                    status_response.raise_for_status()
                    status_data = status_response.json()
                    break
                except requests.exceptions.Timeout:
                    print(f"⏰ [CrewAI] Status timeout on attempt {status_attempt + 1}")
                    if status_attempt == status_retries - 1:
                        raise
                    time.sleep(2)
                except requests.exceptions.HTTPError as e:
                    if e.response.status_code in [504, 503]:
                        error_type = "Gateway timeout" if e.response.status_code == 504 else "Service unavailable"
                        print(f"🔄 [CrewAI] Status {error_type} on attempt {status_attempt + 1}, retrying...")
                        if status_attempt == status_retries - 1:
                            raise
                        wait_time = 8 if e.response.status_code == 503 else 5
                        time.sleep(wait_time)
                    else:
                        raise
            
            print(f"📊 [CrewAI] Status: {status_data.get('state')}")
            
            if status_data.get("state") in ("SUCCESS", "FAILED", "COMPLETED"):
                print(f"✅ [CrewAI] Final state: {status_data.get('state')}")
                
                if status_data.get("state") == "FAILED":
                    error_msg = f"CrewAI task failed: {status_data.get('status', 'Unknown error')}"
                    kickoff_storage[kickoff_id]["status"] = "FAILED"
                    kickoff_storage[kickoff_id]["error"] = error_msg
                    save_kickoff_storage()
                    return {"success": False, "error": error_msg}
                
                # Handle API response formats
                result_data = None
                if status_data.get("result_json"):
                    result_data = status_data["result_json"]
                elif status_data.get("result"):
                    try:
                        # Parse JSON if string
                        parsed_result = status_data["result"]
                        if isinstance(parsed_result, str):
                            import json
                            parsed_result = json.loads(parsed_result)
                        result_data = parsed_result
                    except:
                        result_data = status_data["result"]
                else:
                    result_data = status_data
                
                # Update storage
                kickoff_storage[kickoff_id]["status"] = "SUCCESS"
                kickoff_storage[kickoff_id]["result"] = result_data
                save_kickoff_storage()
                
                return {"success": True, "data": result_data}
        
        # Timeout - mark for later resume
        print(f"⏰ [CrewAI] Request timed out, storing kickoff_id for later resume: {kickoff_id}")
        kickoff_storage[kickoff_id]["status"] = "TIMEOUT"
        save_kickoff_storage()
        return {"success": False, "error": "Request timed out after 200 seconds", "kickoff_id": kickoff_id}
        
    except requests.exceptions.RequestException as e:
        print(f"❌ [CrewAI] Request failed: {str(e)}")
        if 'kickoff_id' in locals():
            kickoff_storage[kickoff_id]["status"] = "FAILED"
            kickoff_storage[kickoff_id]["error"] = str(e)
            save_kickoff_storage()
        return {"success": False, "error": f"API request failed: {str(e)}"}
    except Exception as e:
        print(f"❌ [CrewAI] Unexpected error: {str(e)}")
        if 'kickoff_id' in locals():
            kickoff_storage[kickoff_id]["status"] = "FAILED"
            kickoff_storage[kickoff_id]["error"] = str(e)
            save_kickoff_storage()
        error_msg = str(e)
        if "503" in error_msg or "Service Unavailable" in error_msg:
            error_msg = "CrewAI services are currently overloaded. The system will automatically retry with exponential backoff. You can also use the 'Retrieve Completed Results' button to get previously processed submissions."
        elif "timeout" in error_msg.lower():
            error_msg = "Request timed out due to service overload. The system will retry automatically."
        
        return {"success": False, "error": f"API request failed: {error_msg}"}


# API Endpoints
@app.get("/")
async def root():
    return {"message": "CrewAI Hackathon Backend API", "version": "1.0.0"}

@app.get("/api/test")
async def test_endpoint():
    """Test endpoint to verify CORS and backend connectivity"""
    return {
        "status": "success",
        "message": "Backend is working!",
        "cors_configured": True,
        "timestamp": datetime.now().isoformat()
    }

@app.options("/api/{path:path}")
async def options_handler(path: str):
    """Handle CORS preflight requests"""
    return {"message": "CORS preflight handled"}

@app.post("/api/schema", response_model=ApiResponse)
async def generate_schema(request: SchemaRequest):
    """Generate JSON schema from hackathon rubric"""
    
    if not API_CONFIG["schema"]["base_url"] or not API_CONFIG["schema"]["token"]:
        return ApiResponse(success=False, error="Schema API configuration missing")
    
    payload = {"inputs": {"hackathon_rubric": request.hackathon_rubric}}
    result = await crew_ai_request(
        API_CONFIG["schema"]["base_url"],
        API_CONFIG["schema"]["token"],
        payload,
        timeout=120,
        api_type="schema"
    )
    
    return ApiResponse(**result)

@app.post("/api/eligibility", response_model=ApiResponse)
async def check_eligibility(request: EligibilityRequest):
    """Check if a project is eligible for the hackathon"""
    
    if not API_CONFIG["eligibility"]["base_url"] or not API_CONFIG["eligibility"]["token"]:
        return ApiResponse(success=False, error="Eligibility API configuration missing")
    
    # Eligibility API payload
    payload = {
        "inputs": {
            "project_writeup": request.project_writeup,
            "hackathon_requirements": request.hackathon_requirements
        }
    }
    
    result = await crew_ai_request(
        API_CONFIG["eligibility"]["base_url"],
        API_CONFIG["eligibility"]["token"],
        payload,
        timeout=120,
        api_type="eligibility"
    )
    
    # Transform the response to match frontend expectations
    if result["success"] and result.get("data"):
        # Convert response format
        crew_data = result["data"]
        if "valid" in crew_data and "explanation" in crew_data:
            transformed_data = {
                "eligible": crew_data["valid"],
                "reason": crew_data["explanation"]
            }
            result["data"] = transformed_data
    
    return ApiResponse(**result)

@app.post("/api/grade", response_model=ApiResponse)
async def grade_project(request: GraderRequest):
    """Grade a project using the rubric and schema"""
    
    print(f"🔍 [Grade API] Received request: {request}")
    print(f"🔍 [Grade API] Inputs: {request.inputs}")
    print(f"🔍 [Grade API] API Config: {API_CONFIG}")
    
    if not API_CONFIG["grader"]["base_url"] or not API_CONFIG["grader"]["token"]:
        print("⚠️ [Grade API] No grader API configuration")
        print(f"⚠️ [Grade API] Base URL: {API_CONFIG['grader']['base_url']}")
        print(f"⚠️ [Grade API] Token: {API_CONFIG['grader']['token']}")
        return ApiResponse(success=False, error="Grader API configuration missing")
    
    # Grader API payload
    payload = {
        "inputs": {
            "hackathon_rubric": request.inputs.get("hackathon_rubric", ""),
            "json_rubric": request.inputs.get("json_rubric", {}),
            "project_writeup": request.inputs.get("project_writeup", "")
        },
        "taskWebhookUrl": "", 
        "stepWebhookUrl": "",
        "crewWebhookUrl": "",
        "trainingFilename": "",
        "generateArtifact": False
    }
    
    print(f"🚀 [Grade API] Sending payload to CrewAI: {payload}")
    
    result = await crew_ai_request(
        API_CONFIG["grader"]["base_url"],
        API_CONFIG["grader"]["token"],
        payload,
        timeout=120,
        api_type="grader"
    )
    
    print(f"📊 [Grade API] CrewAI response: {result}")
    
    
    return ApiResponse(**result)

@app.get("/api/kickoff-status/{kickoff_id}")
async def get_kickoff_status(kickoff_id: str):
    """Get the status of a specific kickoff ID"""
    if kickoff_id not in kickoff_storage:
        return ApiResponse(success=False, error="Kickoff ID not found")
    
    status_info = kickoff_storage[kickoff_id]
    return ApiResponse(success=True, data=status_info)

@app.get("/api/kickoff-status")
async def get_all_kickoff_status():
    """Get status of all stored kickoff IDs"""
    return ApiResponse(success=True, data=kickoff_storage)

@app.post("/api/resume-kickoffs")
async def resume_kickoffs(request: ResumeRequest):
    """Resume processing for specific kickoff IDs"""
    results = {}
    
    for kickoff_id in request.kickoff_ids:
        if kickoff_id not in kickoff_storage:
            results[kickoff_id] = {"success": False, "error": "Kickoff ID not found"}
            continue
        
        status_info = kickoff_storage[kickoff_id]
        
        # Resume if pending or timeout
        if status_info["status"] not in ["PENDING", "TIMEOUT"]:
            results[kickoff_id] = {
                "success": True, 
                "data": status_info["result"],
                "status": status_info["status"]
            }
            continue
        
        try:
            # Resume polling
            headers = {
                "Authorization": f"Bearer {status_info['token']}",
                "Content-Type": "application/json"
            }
            
            # Poll status
            max_attempts = 20
            for attempt in range(max_attempts):
                print(f"🔄 [Resume] Polling {kickoff_id} attempt {attempt + 1}/{max_attempts}")
                time.sleep(10)
                
                status_response = requests.get(
                    f"{status_info['base_url']}/status/{kickoff_id}", 
                    headers=headers, 
                    timeout=120
                )
                status_response.raise_for_status()
                status_data = status_response.json()
                
                print(f"📊 [Resume] {kickoff_id} Status: {status_data.get('state')}")
                
                if status_data.get("state") in ("SUCCESS", "FAILED", "COMPLETED"):
                    print(f"✅ [Resume] {kickoff_id} Final state: {status_data.get('state')}")
                    
                    if status_data.get("state") == "FAILED":
                        error_msg = f"CrewAI task failed: {status_data.get('status', 'Unknown error')}"
                        kickoff_storage[kickoff_id]["status"] = "FAILED"
                        kickoff_storage[kickoff_id]["error"] = error_msg
                        save_kickoff_storage()
                        results[kickoff_id] = {"success": False, "error": error_msg}
                        break
                    
                    # Handle API response formats
                    result_data = None
                    if status_data.get("result_json"):
                        result_data = status_data["result_json"]
                    elif status_data.get("result"):
                        try:
                            parsed_result = status_data["result"]
                            if isinstance(parsed_result, str):
                                import json
                                parsed_result = json.loads(parsed_result)
                            result_data = parsed_result
                        except:
                            result_data = status_data["result"]
                    else:
                        result_data = status_data
                    
                    # Update storage
                    kickoff_storage[kickoff_id]["status"] = "SUCCESS"
                    kickoff_storage[kickoff_id]["result"] = result_data
                    save_kickoff_storage()
                    
                    results[kickoff_id] = {"success": True, "data": result_data}
                    break
            
            else:
                # Still pending
                results[kickoff_id] = {"success": False, "error": "Still processing after max attempts"}
                
        except Exception as e:
            print(f"❌ [Resume] Error resuming {kickoff_id}: {str(e)}")
            results[kickoff_id] = {"success": False, "error": str(e)}
    
    return ApiResponse(success=True, data=results)

@app.post("/api/clear-kickoff-storage")
async def clear_kickoff_storage_endpoint():
    """Clear all kickoff storage"""
    try:
        clear_kickoff_storage()
        return ApiResponse(success=True, message="All kickoff storage cleared")
    except Exception as e:
        return ApiResponse(success=False, error=f"Failed to clear storage: {str(e)}")


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "deployment": "production",
        "apis_configured": {
            "schema": bool(API_CONFIG["schema"]["base_url"] and API_CONFIG["schema"]["token"]),
            "eligibility": bool(API_CONFIG["eligibility"]["base_url"] and API_CONFIG["eligibility"]["token"]),
            "grader": bool(API_CONFIG["grader"]["base_url"] and API_CONFIG["grader"]["token"])
        },
        "cors_origins": [
            "https://crew-judge.vercel.app",
            "http://localhost:3000",
            "http://localhost:3001"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    # Use PORT environment variable for Render deployment, fallback to 8001 for local development
    port = int(os.getenv("PORT", 8001))
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=port,
        workers=1,
        loop="asyncio",
        timeout_keep_alive=300,
        timeout_graceful_shutdown=60
    )
