import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import LearnPage from './pages/LearnPage';
import BoothLocatorPage from './pages/BoothLocatorPage';
import VoterGuidePage from './pages/VoterGuidePage';
import QuizPage from './pages/QuizPage';
import MockVotingPage from './pages/MockVotingPage';
import RegistrationTrackerPage from './pages/RegistrationTrackerPage';
import Layout from './components/Layout';

function AppInner() {
  const { user, userProfile, loading } = useAuth();
  const [page, setPage] = useState('dashboard');
  const [onboardingDone, setOnboardingDone] = useState(false);

  // Check if onboarding was done (from localStorage fallback)
  useEffect(() => {
    const local = localStorage.getItem('vs_profile');
    if (local) {
      const profile = JSON.parse(local);
      if (profile.onboardingDone) setOnboardingDone(true);
    }
  }, []);

  useEffect(() => {
    if (userProfile?.onboardingDone) setOnboardingDone(true);
  }, [userProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 glow animate-pulse">
            <span className="text-3xl">🗳️</span>
          </div>
          <p className="text-teal-400 font-medium">Loading VoteSmart AI...</p>
        </div>
      </div>
    );
  }

  if (!onboardingDone) {
    return (
      <OnboardingPage
        onComplete={(profile) => {
          setOnboardingDone(true);
          if (profile.isFirstVoter) setPage('guide');
        }}
      />
    );
  }

  const renderPage = () => {
    const profile = userProfile || JSON.parse(localStorage.getItem('vs_profile') || '{}');
    switch (page) {
      case 'dashboard': return <DashboardPage onNavigate={setPage} userProfile={profile} />;
      case 'chat': return <ChatPage userProfile={profile} />;
      case 'learn': return <LearnPage />;
      case 'booth': return <BoothLocatorPage />;
      case 'guide': return <VoterGuidePage />;
      case 'quiz': return <QuizPage />;
      case 'mock-vote': return <MockVotingPage />;
      case 'register': return <RegistrationTrackerPage />;
      default: return <DashboardPage onNavigate={setPage} userProfile={profile} />;
    }
  };

  const profile = userProfile || JSON.parse(localStorage.getItem('vs_profile') || '{}');

  return (
    <Layout active={page} onNavigate={setPage} userProfile={profile}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}