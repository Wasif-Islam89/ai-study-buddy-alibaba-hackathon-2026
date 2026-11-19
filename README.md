# ai-study-buddy-alibaba-hackathon-2026
AI-powered learning companion built for Alibaba Cloud AI Hackathon Pakistan 2026 🚀


## 1. Project Overview

**AI Study Buddy** is an offline-first, client-side educational software platform engineered to reduce cognitive fatigue and maximize retention for students and lifelong learners. Built around proven pedagogical frameworks—active recall, spaced repetition, timetable load balancing, and structured concept decomposition—it unifies daily planning, dense material ingestion, interactive assessment, and conversational tutoring into a distraction-free learning ecosystem.

The interface adheres to a restrained, professional **Navy (`#244A67`) and Teal (`#138883`)** visual identity designed for long study sessions in both light and dark ambient conditions.

---

## 2. Why AI Study Buddy?

Modern students often switch between fragmented tools: calendar apps for timetables, flashcard apps for active recall, separate note-taking apps, and generic AI chatbots that lack academic structure.

AI Study Buddy solves this fragmentation by providing an integrated pipeline:
1. **Calm Technology:** Neutral, glare-free surfaces prevent screen fatigue without overwhelming neon accents or AI-generated card bloat.
2. **Active Recall & Spaced Repetition:** Auto-grades practice questions with instant step-by-step rationales and tracks 3D flashcard mastery percentages.
3. **Adaptive Timetable Balancing:** Schedules sessions around upcoming examination countdowns and automatically redistributes overloaded days.
4. **Offline-First Resilience:** Operates completely in-browser without requiring cloud account lock-in, database dependencies, or remote server latency.

---

## 3. Key Features & Modules

### 3.1 Dashboard (`/dashboard`)
- **Daily Continuity Hub:** Greets the user, highlights daily focus tasks, and tracks current study habit streaks.
- **Weekly Progress Ring:** Custom SVG circular progress meter displaying completed study minutes against weekly targets.
- **Nearest Exam Alert:** Surfaces the closest impending exam with live countdown days and a direct link to the revision checklist.
- **Quick Action Hub:** One-click shortcuts to upload materials, launch flashcard decks, configure quizzes, and trigger focus sessions.
- **Built-in Pomodoro Focus Timer:** 25-minute study countdown modal with pause, reset, audio alerts, and session tracking.

### 3.2 Study Planner & AI Plan Optimization (`/study-planner`, `/plan-ai-optimization`)
- **Interactive Timetable:** 7-day horizontal selector with week offset navigation (`Previous Week` / `Next Week`).
- **Session Completion:** Circular checkboxes mark sessions complete, calculate daily minutes, and maintain habit streaks.
- **Color-Coded Subject Blocks:** Computer Science (Navy), Mathematics (Teal), Physics (Amber), Biology (Green).
- **AI Plan Optimization Engine:** Analyzes scheduled study hours against upcoming exam deadlines and low quiz scores. Surfaces recommendations to redistribute overloaded days (>4 hrs) and inject urgent revision blocks, complete with an interactive before/after calendar preview.

### 3.3 Progress & Learning Analytics (`/progress`)
- **Cross-Module Telemetry:** Consolidates data from completed planner sessions, quiz scores, and flashcard ratings.
- **Time Window Filters:** Toggle views across *This Week*, *This Month*, and *All Time*.
- **Native SVG Dual-Activity Chart:** High-performance, zero-dependency bar chart comparing Study Time (Navy) vs Quiz Performance (Teal) with interactive hover tooltips.
- **Subject Mastery Matrix:** Visual breakdown of mastery percentages, quizzes completed, and study hours per subject.
- **Recent Milestone Feed:** Chronological log of recent assessment submissions and timetable achievements.

### 3.4 Exam Preparation & Deadlines (`/exams`)
- **Live Day Countdown:** Dynamic countdown timers for university exams, midterms, and finals.
- **Urgency Priority System:** Stratifies exams into *High*, *Medium*, and *Normal* priority tiers.
- **Interactive Revision Checklists:** Expandable topic checklists that update a real-time syllabus readiness score.
- **Direct Scheduling:** One-click trigger to generate a dedicated revision session directly in the Study Planner.

### 3.5 AI Conversational Study Assistant (`/assistant`)
- **Two-Column Study Workspace:** Persistent thread sidebar with search, rename, and deletion capabilities.
- **Quick Study Action Chips:** One-click prompt templates: *Explain Topic*, *Summarize*, *Generate Quiz*, *Create Flashcards*, *Exam Revision*.
- **Document Context Attachment:** Anchor conversation threads to uploaded textbooks or lecture slides.
- **Voice Dictation:** Built-in speech-to-text input powered by the Web Speech API.
- **Rich Message Formatting:** Markdown support for equations, bold key concepts, bulleted takeaways, and code snippets with single-click copying and feedback rating.

### 3.6 Course Materials & Ingestion Pipeline (`/materials`, `/structure`)
- **Multi-Format Ingestion:** Accepts PDF, DOCX, PPTX, and TXT files (up to 25MB).
- **Visual 3-Stage Parsing Pipeline:** Simulates document structure analysis, core concept extraction, and note synthesis.
- **Chapter Outline Tree (`/structure`):** Interactive nested outline displaying extracted chapters, sections, and concept points.

### 3.7 Study Notes & Formula Blocks (`/notes`)
- **Structured Digital Notebook:** Clean chapter breakdowns with subject tags and search filtering.
- **High-Yield Formula Callouts:** Formatted equation blocks with one-click copy to clipboard.
- **Active Recall Actions:** Direct triggers to launch a tailored Practice Quiz or Flashcard Deck based on current notes.

### 3.8 AI Summaries (`/summaries`)
- **Executive Study Briefs:** Bulleted takeaways, core definitions, and reading time estimates (e.g., "3 min read").
- **Modal Reader & Printable Cheat-Sheets:** Fullscreen reading mode (`SummaryDetailView.jsx`) optimized for clean printing.
- **Interactive Text Synthesizer:** Paste custom lecture text to generate instant structured summaries with adjustable tones (*Concise*, *Detailed*, *Exam-Ready*).

### 3.9 Adaptive Quiz Generator & Test Player (`/quiz-generator`)
- **Flexible Test Configuration:** Configure Subject, Topic, Difficulty (*Easy*, *Medium*, *Hard*), Format (*MCQ*, *True/False*, *Mixed*), and Question Counts (5, 10, 15, 20, Custom).
- **Timed Test Player (`QuizPlayerModal.jsx`):** Focused test interface with instant answer validation, color-coded question pills, and elapsed timer.
- **Performance Review & Gauge (`QuizResultsModal.jsx`):** Dynamic SVG circular score gauge, correct/incorrect/unanswered breakdowns, and step-by-step explanations.
- **Assessment Archive (`AllQuizzesModal.jsx`):** Historical record of all attempts with search and retake functionality.

### 3.10 Flashcards & Spaced Repetition (`/flashcards`)
- **Active Recall Decks:** Organized by subject with card counts and calculated mastery percentage meters.
- **Fullscreen Study Mode (`StudyModeView.jsx`):** 3D card flip animation between front prompt and back answer.
- **Confidence Rating:** Mark cards as *Mastered* ("I Know This") or *Needs Practice* to adjust mastery metrics.
- **Bookmarking & Session Filtering:** Star difficult cards and filter sessions by *All*, *Bookmarked*, *Practice*, or *Mastered*.

### 3.11 Workspace Roles & Customization (`/profile`, `/settings`)
- **Dual Workspace Modes:** Switch between **Student Workspace** and **Tutor Workspace** with independent profile data.
- **Interface Appearance:** Toggle between Light Theme and Dark Theme with instant token persistence.
- **Data Portability:** Export complete study history as structured JSON or perform a clean state reset.

---

## 4. Implementation Status & Technical Transparency

To ensure complete technical clarity, the application's capabilities are classified as follows:

| Feature / Layer | Implementation Status | Technical Mechanism |
|---|---|---|
| **User Interface & Styling** | **Fully Implemented** | React 19, Tailwind CSS 4, Lucide Icons, WCAG AA/AAA compliant |
| **Routing & Protected Views**| **Fully Implemented** | React Router v7 with unauthenticated landing redirects |
| **Timetable & Plan Balancing**| **Fully Implemented** | Algorithmic analysis in `plannerService.jsx` |
| **Quiz Engine & Grading** | **Fully Implemented** | Deterministic validation & scoring in `quizService.js` |
| **Flashcards & 3D Flip** | **Fully Implemented** | CSS 3D transforms & mastery calculations in `flashcardService.jsx` |
| **Theme System (Light/Dark)** | **Fully Implemented** | `ThemeContext.jsx` binding CSS custom properties |
| **Authentication & Profile** | **Client-Side Simulation** | Persisted in LocalStorage (`studyBuddyUsers`); no live auth server |
| **AI Assistant Responses** | **Client-Side Simulation** | Contextual heuristic generation; backend-ready for live API keys |
| **Document Ingestion / OCR** | **Client-Side Simulation** | Simulated multi-stage extraction pipeline without server-side OCR |
| **Data Persistence** | **Offline-First** | Browser LocalStorage; zero external database dependencies |

---

## 5. Technology Stack

### Core Dependencies (from `package.json`)

| Package | Version | Purpose |
|---|---|---|
| [`react`](https://react.dev/) | `^19.3.1` | Core UI library |
| [`react-dom`](https://react.dev/) | `^19.3.1` | React DOM renderer |
| [`react-router-dom`](https://reactrouter.com/) | `^7.18.5` | Client-side routing and page navigation |
| [`lucide-react`](https://lucide.dev/) | `^1.66.0` | Accessible, consistent SVG iconography |
| [`tailwindcss`](https://tailwindcss.com/) | `^4.3.3` | Utility-first styling engine (v4 architecture) |
| [`@tailwindcss/vite`](https://tailwindcss.com/) | `^4.3.3` | Native Vite integration for Tailwind v4 |

### Development & Build Tooling

| Tool | Version | Purpose |
|---|---|---|
| [`vite`](https://vitejs.dev/) | `^8.3.5` | Lightning-fast development server & production bundler |
| [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react) | `^6.1.2` | Fast Refresh and JSX transformation |
| [`eslint`](https://eslint.org/) | `^10.13.0` | Code quality and syntax linting |

---

## 6. Project Directory Structure

```text
AI-Study-Buddy/
├── public/                           # Static assets
│   ├── favicon.png                   # Official 1:1 brand favicon
│   ├── favicon.svg                   # Vector brand favicon
│   └── icons.svg                     # Sprite definitions
├── src/
│   ├── main.jsx                      # Application entry point
│   ├── App.jsx                       # Root router & context provider wrapper
│   ├── index.css                     # Tailwind CSS 4 tokens & Navy/Teal CSS variables
│   ├── assets/
│   │   └── logos/                    # High-resolution official brand assets
│   │       ├── AI Study Buddy Inline Logo.png
│   │       ├── AI Study Buddy Square Logo.png
│   │       └── favicon.png
│   ├── components/
│   │   ├── common/                   # Global components (EmptyState, Loader, Logo)
│   │   ├── layout/                   # Shell layouts (Sidebar, Navbar, DashboardLayout, Footer)
│   │   └── ui/                       # Standard UI atoms (Button, Card, Modal, Input, etc.)
│   ├── context/                      # Global state (AuthContext.jsx, ThemeContext.jsx)
│   ├── hooks/                        # Custom hooks (useAuth.jsx, useTheme.jsx)
│   ├── pages/                        # 14 routed page views & subcomponents
│   │   ├── ai-assistant/             # Conversational tutor workspace
│   │   ├── auth/                     # Login, Signup, Forgot Password
│   │   ├── dashboard/                # Main dashboard & action hub
│   │   ├── exam/                     # Exam countdowns & revision checklists
│   │   ├── flashcards/               # Decks & 3D study mode
│   │   ├── help/                     # Searchable FAQ & guides
│   │   ├── landing/                  # Public marketing landing page
│   │   ├── materials/                # Upload dropzone & parsing pipeline
│   │   ├── notes/                    # Digital notebook with formula blocks
│   │   ├── plan-optimization/        # AI schedule rebalancing preview
│   │   ├── profile/                  # User profile & account roles
│   │   ├── progress/                 # Analytics & dual SVG charts
│   │   ├── quiz/                     # Assessment configuration & test player
│   │   ├── settings/                 # Appearance, notifications, data export
│   │   ├── structure/                # Document outline tree
│   │   └── summaries/                # Executive study briefs
│   ├── routes/                       # AppRoutes.jsx & ProtectedRoute.jsx
│   ├── services/                     # Domain business logic & LocalStorage operations
│   │   ├── __tests__/                # Automated test suites
│   │   │   └── quizValidation.test.jsx
│   │   ├── aiAssistantService.jsx
│   │   ├── analyticsService.jsx
│   │   ├── examService.jsx
│   │   ├── flashcardService.jsx
│   │   ├── plannerService.jsx
│   │   ├── progressService.jsx
│   │   ├── quizService.js
│   │   └── summaryService.jsx
│   └── utils/                        # Utility helpers (authUtils.jsx, materialUtils.jsx)
├── eslint.config.js                  # ESLint configuration
├── index.html                        # Single-page HTML template
├── package.json                      # Project dependencies and scripts
├── package-lock.json                 # Pinned dependency lockfile
├── vite.config.js                    # Vite bundler configuration
└── README.md                         # Public repository documentation
```

## 7. Data Storage & Schema Reference

AI Study Buddy operates completely **offline-first**. All application state is stored locally within browser `window.localStorage` under predictable keys:

| LocalStorage Key | Data Stored | Structure Description |
|---|---|---|
| `studyBuddyCurrentUser` | Current session | Active user email address string |
| `studyBuddyUsers` | User accounts | Array of `{ id, fullName, email, password, institution }` |
| `sb_active_account` | Active role | `'student'` or `'tutor'` |
| `sb_profile_data` | Student profile | `{ fullName, institution, educationLevel, grade, bio }` |
| `sb_profile_data_tutor` | Tutor profile | Independent profile record for tutor workspace |
| `sb_profile_photo` | Avatar | Base64-encoded image string |
| `sb_planner_data_v1` | Study schedule | `{ weekOffset, sessions: Array<Session>, history: Array<DayLog> }` |
| `sb_exams_data_v1` | Exam records | Array of `{ id, subject, title, dateISO, priority, checklist }` |
| `sb_quizzes` | Assessment history | Array of `{ id, topic, difficulty, score, timeSpent, questions }` |
| `sb_flashcard_decks_v1` | Flashcards | Array of `{ id, title, subject, cards: Array<Card> }` |
| `studyBuddyMaterials` | Uploaded assets | Array of `{ id, name, subject, fileType, sizeBytes, pageCount }` |
| `studyBuddyNotes` | Structured notes | Array of `{ id, subject, topic, formulas, keyPoints, codeSnippets }` |
| `sb_summaries_data_v1` | Briefs | Array of `{ id, title, subject, readingTimeMinutes, keyTakeaways }` |
| `sb_ai_chats_v1` | AI Chat threads | `{ activeChatId, chats: Array<{ id, title, messages, context }> }` |
| `theme` | UI appearance | `'light'` or `'dark'` |
| `sb_notification_settings_v1` | Preferences | `{ emailDigest, quizReminders, streakAlerts }` |

*Note: All data can be backed up or cleared at any time via `Settings > Data & Storage`.*

---

## 8. Future Roadmap

- [ ] **Live AI API Integration:** Optional toggle to connect live Google Gemini or OpenAI API keys in `aiAssistantService.jsx`.
- [ ] **Server-Side OCR & Embeddings:** Real-time PDF text extraction and semantic chunking for uploaded materials.
- [ ] **Cloud Synchronization:** Secure backend database integration (Supabase / Firebase) for multi-device cross-sync.
- [ ] **Calendar Synchronization:** Direct bidirectional export and sync with Google Calendar, Outlook, and Apple iCal.
- [ ] **Collaborative Study Rooms:** Peer-to-peer real-time study sessions with synchronized Pomodoro timers.

---

## 9. Contributing 

Contributions to improve accessibility, active recall features, or component performance are welcome!
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

  <p>Built with ❤️ for deep, focused, and autonomous learning.</p>
</div>
