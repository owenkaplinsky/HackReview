# HackReview

HackReview is a comprehensive AI-powered review system for hackathon organizers to automatically filter and evaluate submissions using multi-agent AI technology powered by CrewAI.

## Features

- **AI-Powered Filtering**: Automatically filter out ineligible submissions based on requirements
- **Intelligent Scoring**: Grade submissions using AI based on custom rubrics
- **Debate Analysis**: Use Devil's Advocate vs Praise agents to evaluate promising submissions
- **Organized Dashboard**: View submissions categorized by AI recommendations
- **Detailed Reviews**: Deep dive into individual submissions with comprehensive analysis
- **Persistent Processing**: Resume interrupted processing with kickoff ID tracking
- **Real-time Status**: Monitor processing status with detailed progress indicators

## Tech Stack

### Frontend

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Router v6** for routing
- **react-dropzone** for file uploads
- **Emoji-based icons** for simplicity

### Backend

- **FastAPI** with Python 3.11.7
- **Pydantic** for data validation
- **CrewAI Integration** for AI processing
- **Persistent Storage** with JSON file-based kickoff tracking
- **CORS-enabled** for cross-origin requests
- **Deployed on Render** with automatic scaling

## Getting Started

### Prerequisites

- **Node.js 16+** and npm/yarn
- **Python 3.11.7+** and pip
- **CrewAI API access** with valid tokens for:
  - Schema generation API
  - Eligibility checking API
  - Project grading API

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd hackreview
```

2. **Frontend Setup**:

```bash
# Install frontend dependencies
npm install

# Set up environment variables
echo "REACT_APP_BACKEND_URL=https://crewjudge-server.onrender.com" > .env
```

3. **Backend Setup**:

````bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

4. **Start the application**:

```bash
# Terminal 1: Start backend (from backend directory)
python main.py

# Terminal 2: Start frontend (from root directory)
npm start
````

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8001`

## API Integration

The application uses a FastAPI backend that integrates with three CrewAI APIs using a kickoff/status pattern for asynchronous processing:

### Backend Architecture

The backend implements a **kickoff/status pattern** for handling long-running AI tasks:

1. **Kickoff**: Initiate processing and receive a `kickoff_id`
2. **Status Polling**: Check processing status using the `kickoff_id`
3. **Persistence**: Store kickoff IDs for resuming interrupted processes
4. **Circuit Breaker**: Automatic retry with exponential backoff for service overload

### API Endpoints

#### 1. Schema Generation API

- **Endpoint**: `POST /api/schema`
- **Purpose**: Generate JSON evaluation schema from hackathon rubric
- **Input**:
  ```json
  {
    "hackathon_rubric": string
  }
  ```
- **Output**:
  ```json
  {
    "result": string
  }
  ```

#### 2. Eligibility Check API

- **Endpoint**: `POST /api/eligibility`
- **Purpose**: Check if submission meets basic hackathon requirements
- **Input**:
  ```json
  {
    "project_writeup": string,
    "hackathon_requirements": string
  }
  ```
- **Output**:
  ```json
  {
    "eligible": boolean,
    "reason": string
  }
  ```

#### 3. Project Grading API

- **Endpoint**: `POST /api/grade`
- **Purpose**: Grade submission using rubric and run debate agents
- **Input**:
  ```json
  {
    "hackathon_rubric": string,
    "json_rubric": string,
    "project_writeup": string
  }
  ```
- **Output**:
  ```json
  {
    "result": string
  }
  ```

#### 4. Kickoff Management APIs

- **Get Status**: `GET /api/kickoff-status/{kickoff_id}`
- **Get All Status**: `GET /api/kickoff-status`
- **Resume Processing**: `POST /api/resume-kickoffs`
- **Clear Storage**: `POST /api/clear-kickoff-storage`
- **Health Check**: `GET /api/health`

## Usage

### 1. Upload Hackathon Data

- Navigate to `/upload`
- Enter hackathon name
- Upload or paste rubric text
- Define eligibility requirements
- Upload submissions (CSV or JSON format)
- Click "Process Submissions"

### 2. Review Dashboard

- View submissions organized by AI categories:
  - **Promising**: High-scoring submissions needing human review
  - **Filtered Out**: Low-scoring submissions
  - **Ineligible**: Submissions that don't meet basic requirements
- Search and sort submissions
- Navigate to detailed views

### 3. Detailed Review

- View comprehensive AI analysis
- See rubric breakdown with scores
- Read Devil's Advocate vs Praise agent debates
- Add organizer notes
- Move submissions between categories
- Export individual evaluations

## File Formats

### Submissions CSV Format

```csv
project_name,description,demo_link,team_members
"Project Alpha","AI-powered solution for...","https://demo.com","John Doe, Jane Smith"
```

### Submissions JSON Format

```json
[
  {
    "project_name": "Project Alpha",
    "description": "AI-powered solution for...",
    "demo_link": "https://demo.com",
    "team_members": ["John Doe", "Jane Smith"]
  }
]
```

## Project Structure

```
hackreview/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   │   ├── DebateView.tsx  # AI debate analysis display
│   │   ├── FileUploader.tsx # Drag-and-drop file upload
│   │   ├── LoadingSpinner.tsx # Multi-stage progress indicator
│   │   ├── RubricBreakdown.tsx # Visual score breakdown
│   │   ├── ScoreDisplay.tsx # Score visualization
│   │   ├── SubmissionCard.tsx # Submission list item
│   │   └── TabNavigation.tsx # Category navigation
│   ├── pages/              # Main application pages
│   │   ├── LandingPage.tsx # Welcome page
│   │   ├── ReviewDashboard.tsx # Main review interface
│   │   ├── SubmissionDetail.tsx # Individual submission view
│   │   └── UploadPage.tsx  # Data upload interface
│   ├── services/           # API service layer
│   │   └── api.ts         # Backend API integration
│   ├── store/              # State management
│   │   └── useStore.ts    # Zustand store with persistence
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts       # API and data type definitions
│   ├── utils/              # Utility functions
│   │   └── helpers.ts     # Helper functions
│   └── constants/          # Application constants
│       └── index.ts       # App-wide constants
├── backend/                # FastAPI backend server
│   ├── main.py            # Main FastAPI application
│   ├── requirements.txt   # Python dependencies
│   ├── Procfile          # Render deployment config
│   ├── runtime.txt       # Python version specification
│   └── kickoff_storage.json # Persistent kickoff ID storage
├── sample-data/           # Example data files
│   ├── eligibility-requirements.txt
│   ├── hackathon-rubric.txt
│   └── submissions.json
└── public/                # Static assets
    ├── index.html
    └── manifest.json
```

## Key Components

- **FileUploader**: Drag-and-drop file upload with validation
- **LoadingSpinner**: Multi-stage progress indicator
- **ScoreDisplay**: Visual score indicators with progress rings
- **SubmissionCard**: Card component for submission lists
- **DebateView**: Two-column layout for AI debate analysis
- **TabNavigation**: Tab navigation for categories
- **RubricBreakdown**: Visual breakdown of rubric scores

## State Management

The application uses Zustand for state management with persistence:

- **Current Review**: Active hackathon review being viewed
- **Reviews**: All saved reviews
- **Processing Status**: Current processing stage and progress
- **Submission Updates**: Real-time updates to submission data
