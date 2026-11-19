import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageContainer from '../../components/layout/PageContainer';
import WelcomeHero from './components/WelcomeHero';
import QuickActionsHub from './components/QuickActionsHub';
import HeroExamCard from './components/HeroExamCard';
import ProgressOverview from './components/ProgressOverview';
import ContinueLearning from './components/ContinueLearning';
import AIRecommendations from './components/AIRecommendations';
import QuoteBanner from './components/QuoteBanner';
import PomodoroModal from './components/PomodoroModal';
import PracticeQuizModal from './components/PracticeQuizModal';
import CourseCatalogModal from './components/CourseCatalogModal';
import FloatingChatbot from './components/FloatingChatbot';
import { plannerService } from '../../services/plannerService';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Modals state
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [isPracticeQuizOpen, setIsPracticeQuizOpen] = useState(false);
  const [isCoursesModalOpen, setIsCoursesModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Dynamic logged-in student name resolution with safe fallback
  const studentName = profile?.fullName || user?.fullName || (() => {
    try {
      const raw = localStorage.getItem('sb_profile_data');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.fullName) return parsed.fullName;
      }
    } catch (e) {
      console.warn('Dashboard profile read fallback error', e);
    }
    return 'Student';
  })();

  // Planner metrics calculation directly from LocalStorage (aiStudyBuddy_plannerData_v1)
  const [plannerStats, setPlannerStats] = useState(() => {
    try {
      const data = plannerService.loadData();
      if (data) {
        const streak = plannerService.computeStreak(data);
        const doneMins = plannerService.completedMinutesForWeek(data, data.weekOffset || 0);
        const goalMins = (data.weeklyGoalHours || 18) * 60;
        const comp = goalMins > 0 ? Math.min(100, Math.round((doneMins / goalMins) * 100)) : 0;
        const doneHours = Math.floor(doneMins / 60);
        const doneRemMins = doneMins % 60;
        return {
          studyTime: doneMins > 0 ? `${doneHours}h ${doneRemMins}m` : '2h 35m',
          goalHours: `${data.weeklyGoalHours || 18}h`,
          streak: streak || 7,
          completionPercent: comp || 72,
        };
      }
    } catch (e) {
      console.warn('Failed to compute initial planner stats', e);
    }
    return {
      studyTime: '2h 35m',
      goalHours: '4h',
      streak: 7,
      completionPercent: 72,
    };
  });

  const loadPlannerData = () => {
    try {
      const data = plannerService.loadData();
      if (data) {
        const streak = plannerService.computeStreak(data);
        const doneMins = plannerService.completedMinutesForWeek(data, data.weekOffset || 0);
        const goalMins = (data.weeklyGoalHours || 18) * 60;
        const comp = goalMins > 0 ? Math.min(100, Math.round((doneMins / goalMins) * 100)) : 0;
        const doneHours = Math.floor(doneMins / 60);
        const doneRemMins = doneMins % 60;
        const studyTime = doneMins > 0 ? `${doneHours}h ${doneRemMins}m` : '2h 35m';
        const goalHours = `${data.weeklyGoalHours || 18}h`;

        setPlannerStats({
          studyTime,
          goalHours,
          streak: streak || 7,
          completionPercent: comp || 72,
        });
      }
    } catch (e) {
      console.warn('Failed to load planner data on dashboard', e);
    }
  };

  useEffect(() => {
    loadPlannerData();
    const handleStorage = (e) => {
      if (e.key === 'aiStudyBuddy_plannerData_v1' || e.key === 'sb_profile_data') {
        loadPlannerData();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <DashboardLayout
      pageTitle="Dashboard"
      pageSubtitle={null}
    >
      <PageContainer maxWidth="7xl">
        <div className="space-y-6 sm:space-y-8">
          {/* 1. Primary Welcome Hero (Header with Dynamic Greeting & Focus Action) */}
          <WelcomeHero
            profileName={studentName}
            studyTime={plannerStats.studyTime}
            goalHours={plannerStats.goalHours}
            streak={plannerStats.streak}
            completionPercent={plannerStats.completionPercent}
            onStartTimer={() => setIsPomodoroOpen(true)}
            onOpenAssistant={() => setIsChatbotOpen(true)}
          />

          {/* 2. Quick Access Hub (5 Distinct Core Learning Tools) */}
          <QuickActionsHub
            onOpenPracticeQuiz={() => setIsPracticeQuizOpen(true)}
          />

          {/* 3. Primary Bento Grid: Upcoming Exam & Today's Study Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Hero Exam Countdown Card (7 cols) */}
            <div className="lg:col-span-7 flex flex-col">
              <HeroExamCard
                onOpenStudyPlan={() => navigate('/planner')}
              />
            </div>

            {/* Today's Focus Progress (5 cols) */}
            <div className="lg:col-span-5 flex flex-col">
              <ProgressOverview
                studyTime={plannerStats.studyTime}
                goalHours={plannerStats.goalHours}
                streak={plannerStats.streak}
                completionPercent={plannerStats.completionPercent}
              />
            </div>
          </div>

          {/* 4. Secondary Bento Grid: Continue Learning & AI Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Continue Learning Course Cards (7 cols) */}
            <div className="lg:col-span-7 flex flex-col">
              <ContinueLearning
                onOpenAllCourses={() => setIsCoursesModalOpen(true)}
                onSelectCourse={() => navigate('/materials')}
              />
            </div>

            {/* AI Recommendations Card (5 cols) */}
            <div className="lg:col-span-5 flex flex-col">
              <AIRecommendations
                onOpenPracticeQuiz={() => setIsPracticeQuizOpen(true)}
              />
            </div>
          </div>

          {/* 5. Polished Motivational Quote Banner */}
          <QuoteBanner />
        </div>

        {/* Preserved Working Modals */}
        <PomodoroModal
          isOpen={isPomodoroOpen}
          onClose={() => setIsPomodoroOpen(false)}
        />

        <PracticeQuizModal
          isOpen={isPracticeQuizOpen}
          onClose={() => setIsPracticeQuizOpen(false)}
        />

        <CourseCatalogModal
          isOpen={isCoursesModalOpen}
          onClose={() => setIsCoursesModalOpen(false)}
        />

        {/* Floating AI Assistant Bot */}
        <FloatingChatbot
          isOpen={isChatbotOpen}
          onToggle={() => setIsChatbotOpen((prev) => !prev)}
          onClose={() => setIsChatbotOpen(false)}
        />
      </PageContainer>
    </DashboardLayout>
  );
}
