# DecisionMind AI — Autonomous Scenario-Based Decision Intelligence MVP

> **Hackathon MVP**: Built for high-stakes enterprise & strategic decision-making. Evaluate complex scenarios, compare structured options with multi-model consensus, mitigate tail-risk, and export boardroom-ready briefs.

---

## 🚀 Quick Start (Under 1 Minute)

The application includes both the backend API and the Vite React frontend:

```bash
# 1. Install dependencies (already pre-installed)
npm install

# 2. Run both Backend Server & Frontend Client concurrently:
npm run dev
```

- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5001/api/health`

*Note: Works 100% offline out-of-the-box with a high-fidelity local multi-model consensus engine. If an optional Google Gemini key is present (`GEMINI_API_KEY`), it automatically activates enhanced cloud LLM evaluation.*

---

## 🌟 3 Key Features to Highlight in the Hackathon Demo

1. **Autonomous Multi-Model Consensus Architecture**
   - Evaluates scenarios concurrently through 4 specialized perspective models:
     - **FinRisk-Alpha**: 3-Year TCO, capital efficiency, and ROI payback period.
     - **OpsVelocity-V2**: Tech debt, deployment friction, and operational reliability.
     - **StratAlign-Pro**: Competitive moat, speed-to-value, and market timing.
     - **Governance-Shield**: Regulatory compliance (GDPR/SOC2), data sovereignty, and vendor lock-in.
   - Synthesizes an unbiased **Decision Confidence Index (0-100%)** with explainable rationale.

2. **Interactive Live Sensitivity & Priority Simulator (`/report/:id`)**
   - Judges and executives can adjust real-time sliders for **Cost Weight**, **Speed to Value**, **Risk Aversion**, and **Strategic Moat**.
   - Watch the consensus scores and decision spreads dynamically recalculate live on screen!

3. **Full-Spectrum Explainability & Boardroom Export**
   - Multidimensional Radar Profile chart (`recharts`) mapping options across 5 axes.
   - Side-by-side trade-off comparison matrix with highlighted advantage markers.
   - Monte Carlo tail-risk probability scenarios and a phased 4-stage execution roadmap.
   - 1-Click "Print Boardroom PDF", "Copy Share Link", and "Export Markdown Summary".

---

## 🧭 Application Pages & User Workflow

1. **Login & Access Portal (`/login`)**
   - Instant 1-Click Persona Access (CEO Victoria Vance, VP Strategy Elena Rostova, Systems Architect Marcus Chen).
   - "Guest Evaluation Access" button to bypass any credential entry in 1 click.

2. **Executive Command Dashboard (`/dashboard`)**
   - KPI metric cards: Decision Confidence Index (91%), Decision Velocity (4.2 days vs 28 days industry avg), Risk Heatmap, and Preserved Capital.
   - Consensus Score distribution bar chart.
   - Filterable & searchable decision ledger with instant drill-down.

3. **AI Research & Decision Workspace (`/research`)**
   - Pre-loaded with 4 instant 1-click enterprise benchmark scenarios (Cloud Infrastructure TCO, Global Expansion APAC vs LATAM, AI GPU Compute Architecture, PLG vs Outbound Sales).
   - Dynamic option builder and customizable problem parameters.
   - Real-time animated multi-model consensus evaluation feed.

4. **Executive Decision Report (`/report/:id`)**
   - Boardroom-ready executive summary with classification badges.
   - Interactive Sensitivity Simulator sliders.
   - Print-optimized layout (`window.print()`).

---

## 🛠 Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React, Recharts
- **Backend**: Node.js, Express.js, CORS, Dotenv
- **Storage**: Persistent JSON database (`server/data/decisions.json`)
- **Intelligence**: Multi-Model Consensus Engine with Gemini API fallback
