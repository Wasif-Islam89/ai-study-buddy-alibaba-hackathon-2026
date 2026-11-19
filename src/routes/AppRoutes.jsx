import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import MaterialsPage from '../pages/materials/MaterialsPage';
import StructurePage from '../pages/structure/StructurePage';
import NotesPage from '../pages/notes/NotesPage';
import AIAssistantPage from '../pages/ai-assistant/AIAssistantPage';
import SummariesPage from '../pages/summaries/SummariesPage';
import QuizGeneratorPage from '../pages/quiz/QuizGeneratorPage';
import FlashcardsPage from '../pages/flashcards/FlashcardsPage';
import StudyPlannerPage from '../pages/study-planner/StudyPlannerPage';
import PlanOptimizationPage from '../pages/plan-optimization/PlanOptimizationPage';
import ProgressPage from '../pages/progress/ProgressPage';
import ExamPage from '../pages/exam/ExamPage';
import ProfilePage from '../pages/profile/ProfilePage';
import SettingsPage from '../pages/settings/SettingsPage';
import HelpPage from '../pages/help/HelpPage';
import LandingPage from '../pages/landing/LandingPage';

// Redirects already-authenticated users away from public auth pages
function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Landing Page for unauthenticated visitors / Dashboard redirect for authenticated */}
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />}
      />

      {/* Public Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <SignupPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicOnlyRoute>
            <ForgotPasswordPage />
          </PublicOnlyRoute>
        }
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/materials" element={<MaterialsPage />} />
        <Route path="/structure" element={<StructurePage />} />
        <Route path="/materials/structure" element={<StructurePage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/materials/notes" element={<NotesPage />} />
        <Route path="/assistant" element={<AIAssistantPage />} />
        <Route path="/ai-assistant" element={<AIAssistantPage />} />
        <Route path="/summaries" element={<SummariesPage />} />
        <Route path="/summary" element={<SummariesPage />} />
        <Route path="/quiz-generator" element={<QuizGeneratorPage />} />
        <Route path="/quizzes" element={<QuizGeneratorPage />} />
        <Route path="/flashcards" element={<FlashcardsPage />} />
        <Route path="/flashcard" element={<FlashcardsPage />} />
        <Route path="/study-planner" element={<StudyPlannerPage />} />
        <Route path="/planner" element={<StudyPlannerPage />} />
        <Route path="/plan-ai-optimization" element={<PlanOptimizationPage />} />
        <Route path="/planner/optimization" element={<PlanOptimizationPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/exam" element={<ExamPage />} />
        <Route path="/exams" element={<ExamPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/help" element={<HelpPage />} />
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />}
      />
    </Routes>
  );
}

