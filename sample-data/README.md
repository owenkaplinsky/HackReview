# HackReview Sample Data

This directory contains sample data files for testing the HackReview application.

## Files Included:

### 1. `hackathon-submissions.json`

A comprehensive JSON file containing 10 sample hackathon submissions with varying quality levels:

**High Quality Submissions:**

- AI-Powered Code Review Assistant (87 points)
- Smart Campus Navigation (82 points)
- MediConnect - Telemedicine Platform (85 points)
- EduLearn - AI Tutoring System (80 points)

**Medium Quality Submissions:**

- EcoTrack - Carbon Footprint Tracker (65 points)
- FoodWaste Tracker (70 points)
- VR Fitness Trainer (75 points)

**Low Quality/Ineligible Submissions:**

- Quick App (incomplete, missing requirements)
- Incomplete Project (missing demo, oversized team)
- Blockchain Voting System (brief description, missing demo)

### 2. `hackathon-rubric.txt`

A detailed evaluation rubric with:

- 5 main scoring categories (100 points total)
- Detailed point breakdowns
- Eligibility requirements
- Bonus point criteria
- Disqualification criteria

### 3. `eligibility-requirements.txt`

Comprehensive eligibility requirements including:

- Mandatory requirements
- Technical requirements
- Content requirements
- Disqualification criteria
- Evaluation process

## How to Use:

1. **Upload the rubric**: Copy the content from `hackathon-rubric.txt` and paste it into the rubric field
2. **Upload requirements**: Copy the content from `eligibility-requirements.txt` and paste it into the requirements field
3. **Upload submissions**: Use the `hackathon-submissions.json` file for the submissions upload
4. **Process**: Click "Process Submissions" to see the AI agents evaluate the data

## Expected Results:

The sample data is designed to demonstrate the full range of the AI evaluation system:

- **Ineligible submissions** will be filtered out due to missing requirements
- **Filtered submissions** will receive low scores and be categorized as "filtered out"
- **Promising submissions** will receive high scores and detailed AI debate analysis

This will showcase the complete workflow from eligibility checking through AI grading and debate analysis.
