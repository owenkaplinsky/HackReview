# HackReview

HackReview is a comprehensive AI-powered review system for hackathon organizers to automatically filter and evaluate submissions using multi-agent AI technology.

## Features

- **AI-Powered Filtering**: Automatically filter out ineligible submissions based on requirements
- **Intelligent Scoring**: Grade submissions using AI based on custom rubrics
- **Debate Analysis**: Use Devil's Advocate vs Praise agents to evaluate promising submissions
- **Organized Dashboard**: View submissions categorized by AI recommendations
- **Detailed Reviews**: Deep dive into individual submissions with comprehensive analysis
- **Export Functionality**: Export results and generate reports

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **File Upload**: react-dropzone
- **Icons**: Emoji-based icons for simplicity

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Backend API server (see API Integration section)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd hackathon-review-system
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
# Create .env file
REACT_APP_API_URL=http://localhost:3001
```

4. Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

## API Integration

This application integrates with three backend APIs:

### 1. JSON Schema Generator API

- **Endpoint**: `POST /api/generate-schema`
- **Purpose**: Generate evaluation schema from rubric text
- **Input**: `{ "rubric": "string" }`
- **Output**: `{ "schema": {} }`

### 2. Minimum Eligibility Check API

- **Endpoint**: `POST /api/check-eligibility`
- **Purpose**: Check if submission meets basic requirements
- **Input**: `{ "requirements": "string", "submission": {} }`
- **Output**: `{ "eligible": boolean, "reason": "string" }`

### 3. Project Grader API

- **Endpoint**: `POST /api/grade-project`
- **Purpose**: Grade submission and run debate agents
- **Input**: `{ "rubric": "string", "schema": {}, "submission": {} }`
- **Output**: `{ "scores": {}, "overallScore": number, "devilsAdvocate": "string", "praiseAgent": "string", "recommendation": "promising" | "filtered" | "ineligible" }`

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
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── services/           # API service layer
├── store/              # State management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── constants/          # Application constants
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

## Responsive Design

The application is fully responsive and works on:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the repository.
