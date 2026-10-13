# CampusIQ — Academic Intelligence & Student Success System
**Official University Faculty Senate & Student Advising Platform**

CampusIQ is an enterprise-grade academic intelligence system designed for universities and higher education institutions. It pairs continuous academic evaluation (CGPA, marks, statutory attendance, curriculum arrears, and LMS engagement) with career placement readiness metrics (coding proficiency, quantitative aptitude, technical viva ratings, and mock interview frequency) into a unified institutional intelligence portal.

---

## What's New in this Classic Academic Edition

### 1. 🎓 Faculty AI Student Progress Report Analysis & Solution Studio
A dedicated diagnostic studio where faculties can:
- **Inspect Full Official Progress Dossiers**: Select any matriculated undergraduate from a searchable academic roll to view their complete academic transcript, subject-by-subject internal marks, statutory lecture attendance compliance, curriculum arrears, coding scores, and longitudinal score trajectories.
- **Select Diagnostic Foci**:
  - *Comprehensive 360° Academic & Career Diagnostic* (Root-cause analysis and personalized multi-week roadmap)
  - *Subject Remediation & Tutoring* (Targeted study milestones for deficient coursework)
  - *Placement & Coding Accelerator* (Bridging practical gaps without overloading courses)
  - *Attendance & Engagement Recovery* (Statutory compliance contract and mentor cadence)
  - *Faculty-Parent Advisory Draft* (Formal academic letter with constructive remedies)
- **Real-Time Pedagogical Diagnosis & Solutions**: The AI analyzes the candidate's exact performance metrics in real time and synthesizes:
  - *Executive Pedagogical Diagnostic* (Identifies primary root cause of performance deficits)
  - *Disaggregated Factor Assessment* (Coursework, attendance, placement skills, and arrears)
  - *Prescribed Evidence-Based Interventions* (Specific tutoring, coding drills, and viva rehearsals)
  - *Six-Week Implementation & Milestone Roadmap* (Concrete goals for Weeks 1–2, 3–4, and 5–6)
  - *Institutional Action Items* for assigned faculty mentors.
- **One-Click Faculty Workflow Actions**:
  - **➕ Add to Active Interventions Board**: Directly creates an official intervention in the university's Kanban registry.
  - **🖨️ Export / Print Official Academic Dossier**: Formats a print-ready academic transcript report with university letterhead, seals, and faculty signature line.
  - **💬 Real-Time Faculty Follow-Up**: Ask follow-up questions to the AI regarding this student (e.g., generate a 14-day study plan, 5 custom viva questions, or parent advisory notices).

### 2. ⚡ Real-Time AI Engine (No Built-In or Canned Answers)
CampusIQ AI no longer relies on hardcoded keyword rules or canned answers. Instead, it provides true real-time intelligence:
- **Multi-Provider Support**:
  - **Google Gemini** (`gemini-1.5-flash`, `gemini-2.0-flash`): Ultra-fast, high-capacity pedagogical reasoning (free API keys available via [Google AI Studio](https://aistudio.google.com/)).
  - **OpenAI / Compatible** (`gpt-4o`, `gpt-4o-mini`, Groq, OpenRouter).
  - **Anthropic Claude** (`claude-3-5-sonnet-20241022`).
  - **CampusIQ Local Node Proxy** (`/api/chat`).
  - **Real-Time Client-Side Pedagogical Engine**: Dynamically analyzes the student's exact numerical metrics, computes variances, identifies score drags, and generates structured academic reports on the fly.
- **In-Browser AI Settings Modal**:
  - Accessible from the header (`⚙ AI Settings` or clicking the real-time status pill).
  - Configure or switch API providers and keys anytime with instant connectivity verification.
- **Rich Academic Markdown Rendering**: Responses are rendered with formal academic formatting (headings, blockquotes, bullet points, numbered timelines, and tables).

### 3. 🏛️ Classic Academic Website Aesthetic
Redesigned to reflect the prestige of world-class academic institutions (Oxford, Cambridge, Harvard):
- **Scholarly Color Palette**: Deep Collegiate Oxford Navy (`#0c1e36`, `#132a4b`), Heraldic Academic Gold (`#c59b27`, `#e6ca65`), and Scholarly Crimson accents (`#800020`).
- **Prestigious Institutional Typography**: Classic academic serif headings (*Playfair Display*, *Cinzel*) combined with legible tabular data fonts (*Inter*, *JetBrains Mono*).
- **Heraldic University Insignia**: Official academic crest with the Latin motto: *"Veritas • Sapientia • Virtus"* (Truth, Wisdom, Excellence).
- **Formal Academic Nomenclature**: Refined with collegiate terminology ("Continuous Internal Assessment", "Dean's Honor Roll", "Statutory Attendance Threshold", "Faculty Senate Roll", "Curricular Arrears").
- **Consistent University Gateway**: Unified Single Sign-On (SSO) authentication interface across all entry points.

---

## System Navigation

1. **`index.html`** (or **`login.html`**): University Single Sign-On (SSO) gateway. Opens automatically as the homepage on Netlify/browsers. Choose between Faculty Senate Portal and Student Portal.
2. **`faculty-portal.html`**: Official Faculty Senate & Academic Advising Portal:
   - **Tab 0: Institutional Overview** — Key indicators, Success Compass scatter plot, and departmental benchmarks.
   - **Tab 1: Progress & AI Diagnostics (NEW)** — Select any student, inspect full progress dossier, and run real-time AI pedagogical diagnostic & solution generator.
   - **Tab 2: Student Directory** — Searchable cohort roll with CGPA, attendance, and quick diagnostic triggers.
   - **Tab 3: Risk Engine** — Policy weight tuning and what-if predictive simulations.
   - **Tab 4: Performance Segments** — Five specialized cohort intervention pathways.
   - **Tab 5: Interventions Registry** — 4-stage Kanban tracking faculty mentoring directives.
   - **Tab 6: Institutional Intelligence** — Skill gap heatmaps and course attrition analysis.
   - **Tab 7: AI Academic Advisor** — Real-time advisory copilot for cohort inquiries.
   - **Tab 8: Faculty Directory** — Academic appointments, cabins, and office hours.
   - **Tab 9: Facility Allocation** — Laboratory suites, viva chambers, and cleaning status.
3. **`student-portal.html`**: Undergraduate Student Academic & Advising Portal featuring personal transcript, weekly timetable grid, course attendance, and live AI academic advisor.

---

## Real-Time AI Configuration

### Direct In-Browser Setup (Easiest)
1. Open `index.html` or `student-portal.html` in any web browser.
2. Click **`⚙ AI Settings`** in the top navigation bar.
3. Select your provider (e.g. **Google Gemini**).
4. Enter your API key (get a free key at [aistudio.google.com](https://aistudio.google.com/)).
5. Click **Test Connection** and **Save & Apply**. CampusIQ is now running in real-time mode with live external LLM inference!

### Optional Node.js Server Proxy Setup
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Add your `GEMINI_API_KEY`, `OPENAI_API_KEY`, or `ANTHROPIC_API_KEY`.
3. Run:
   ```bash
   node server.js
   ```
4. Access the portal at `http://localhost:3000`.
