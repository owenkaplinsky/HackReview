# Getting Started with HackReview

## 🎉 Project Status: READY TO USE!

HackReview is now fully built and ready to use. All TypeScript compilation errors have been resolved and the application builds successfully.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:3001

# Optional: Enable debug mode
REACT_APP_DEBUG=false
```

### 3. Start Development Server

```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── FileUploader.tsx
│   ├── LoadingSpinner.tsx
│   ├── ScoreDisplay.tsx
│   ├── SubmissionCard.tsx
│   ├── DebateView.tsx
│   ├── TabNavigation.tsx
│   └── RubricBreakdown.tsx
├── pages/              # Main application pages
│   ├── LandingPage.tsx
│   ├── UploadPage.tsx
│   ├── ReviewDashboard.tsx
│   └── SubmissionDetail.tsx
├── services/           # API service layer
│   └── api.ts
├── store/              # State management
│   └── useStore.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── helpers.ts
└── constants/          # Application constants
    └── index.ts
```

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (not recommended)

## 🌐 API Integration

The application is ready to integrate with your backend APIs:

### Required Endpoints:

1. **POST /api/generate-schema** - Generate evaluation schema from rubric
2. **POST /api/check-eligibility** - Check submission eligibility
3. **POST /api/grade-project** - Grade submission and run debate agents

### Sample Data:

- `sample-data/submissions.json` - 10 sample hackathon submissions
- `sample-data/rubric.txt` - Sample evaluation rubric
- `sample-data/requirements.txt` - Sample eligibility requirements

## 🎨 Features Implemented

✅ **Landing Page** - Hero section with benefits and CTA
✅ **Upload Page** - File upload with drag-and-drop support
✅ **Review Dashboard** - Tabbed interface with filtering and search
✅ **Submission Detail** - Comprehensive evaluation view with debate analysis
✅ **Responsive Design** - Works on desktop, tablet, and mobile
✅ **State Management** - Zustand with persistence
✅ **TypeScript** - Full type safety
✅ **Tailwind CSS** - Modern, responsive styling

## 🔄 Next Steps

1. **Set up your backend APIs** to match the expected endpoints
2. **Test the application** with your own data
3. **Customize the styling** if needed
4. **Deploy to production** when ready

## 🐛 Troubleshooting

### Common Issues:

1. **API Connection Errors**: Ensure your backend server is running on the configured port
2. **File Upload Issues**: Check that file formats match the accepted types
3. **Build Errors**: Run `npm install` to ensure all dependencies are installed

### Getting Help:

- Check the browser console for error messages
- Verify your `.env` file configuration
- Ensure all required dependencies are installed

## 🎯 Ready to Use!

Your hackathon review system is now ready to help you efficiently evaluate submissions using AI-powered automation. The system will save you significant time while maintaining quality assessment standards.

Happy reviewing! 🚀
