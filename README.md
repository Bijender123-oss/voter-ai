# VoteSmart AI – Smart Election Guide 🇮🇳

## Problem Statement
The lack of accessible, engaging, and user-friendly election education tools leads to misinformation, low voter turnout, and weak democratic participation in India. Complex processes and missing documentation deter many, especially first-time voters, from exercising their democratic right.

## Solution
**VoteSmart AI** is a highly interactive, human-like AI assistant and election education platform. It simplifies the democratic process by offering personalized guidance, realistic simulations, and gamified awareness checks, wrapped in a modern, premium UI.

## Features
1. **Human-like AI Assistant**: Powered by Google Gemini, featuring a friendly tone, typing animations, WhatsApp-style chat interface, and a built-in Voice Assistant (Speech-to-Text & Text-to-Speech) for high accessibility.
2. **Interactive Learning**: A 5-phase animated timeline using Framer Motion that explains the Indian election process (Announcement to Counting).
3. **Polling Booth Locator**: An interactive map powered by Google Maps Platform to help voters find their designated polling booth.
4. **Personalized Smart Guide**: A guided onboarding flow that captures user demographics and first-time voter status to tailor the dashboard and recommendations.
5. **Voter Awareness Score**: A gamified 5-question quiz with an animated scoring system (Beginner / Intermediate / Advanced) to test and improve civic knowledge.
6. **Mock Voting Simulation**: A gamified, interactive EVM & VVPAT simulation that lets users experience the exact process of casting a vote securely.
7. **Comprehensive Voter Guide**: A complete list of required documents, do's & don'ts, and step-by-step voting day instructions.

## Tech Stack
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS (v3) + Glassmorphism UI
- **Animations**: Framer Motion
- **AI**: Google Gemini API (`@google/generative-ai`)
- **Maps**: Google Maps Platform API (`@react-google-maps/api`)
- **Icons**: Lucide React
- **Backend/Auth**: Firebase (Auth + Firestore) - *Ready for backend integration*

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- API Keys for Google Gemini, Google Maps, and Firebase

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/votesmart-ai.git
   cd votesmart-ai/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Variables setup:
   Create a `.env` file in the `frontend` directory based on `.env.example`:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```
   *(Note: The app runs in 'Demo Mode' out of the box if API keys are missing)*

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Assumptions & Constraints
- **Single Branch**: Code is designed to be committed entirely to the `main` branch.
- **Storage**: No sensitive personal data (like Aadhaar numbers or actual voter IDs) is stored in the database. 
- **Voice Support**: Text-to-Speech relies on the browser's native `window.speechSynthesis` API.
- **Maps API**: Uses a fallback demo UI if the Google Maps API key is not provided.
- **Size**: Project size is optimized and kept under 10 MB (excluding `node_modules`).
