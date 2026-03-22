import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useStore from './store';
import AppShell from './components/AppShell';
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import OnboardingComplete from './pages/OnboardingComplete';
import Home from './pages/Home';
import Suggest from './pages/Suggest';
import RecipeDetail from './pages/RecipeDetail';
import CookingMode from './pages/CookingMode';
import CookingComplete from './pages/CookingComplete';
import MealPrep from './pages/MealPrep';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import ManualLog from './pages/ManualLog';
import './App.css';

function App() {
  const onboardingComplete = useStore(s => s.user.onboardingComplete);

  return (
    <BrowserRouter>
      <AppShell>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#1A1A1A',
              color: '#FFFFFF',
              backdropFilter: 'blur(20px)',
              borderRadius: '14px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
              fontFamily: "'Outfit', sans-serif",
              fontSize: '14px',
              padding: '12px 16px',
              border: '1px solid rgba(255,255,255,0.06)',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding/:step" element={<Onboarding />} />
          <Route path="/onboarding/ready" element={<OnboardingComplete />} />
          <Route path="/home" element={<Home />} />
          <Route path="/suggest" element={<Suggest />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/cooking/:id" element={<CookingMode />} />
          <Route path="/cooking/:id/complete" element={<CookingComplete />} />
          <Route path="/mealprep" element={<MealPrep />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/log" element={<ManualLog />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
