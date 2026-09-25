# DecisionMind AI — Standalone Backend API

Autonomous Scenario-Based Decision Intelligence Backend powered by Express.js and Multi-Model Consensus Architecture.

---

## 🚀 Quick Start (Standalone)

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Configure environment (optional: add GEMINI_API_KEY)
cp .env.example .env

# Start server
npm start

# Or start in watch mode for development
npm run dev
```

Server runs on: `http://localhost:5001`

---

## 🌐 API Endpoints Reference

### 1. Health & Status
- **`GET /api/health`**  
  Returns engine status, active decisions count, and Gemini connectivity.

### 2. Decision Scenarios
- **`GET /api/decisions`**  
  Returns all saved decision frameworks.
- **`GET /api/decisions/:id`**  
  Returns complete structured report for a single scenario.
- **`POST /api/decisions/evaluate`**  
  Runs the multi-model consensus engine on the scenario and returns:
  - Consensus Confidence Score (0-100)
  - Primary Recommendation & Executive Rationale
  - 4 Model Evaluations (`FinRisk-Alpha`, `OpsVelocity-V2`, `StratAlign-Pro`, `Governance-Shield`)
  - 5-Axis Metric Comparison
  - Side-by-side Trade-off Matrix
  - Monte Carlo Tail-Risk Scenarios
  - 4-Phase Phased Action Roadmap
- **`POST /api/decisions/save`**  
  Persists an evaluated scenario into the database (`data/decisions.json`).
- **`DELETE /api/decisions/:id`**  
  Deletes a decision scenario.

### 3. Analytics & Metrics
- **`GET /api/metrics`**  
  Returns aggregated decision velocity, capital preserved estimates, and risk distributions.

### 4. Authentication (Mock & Demo)
- **`POST /api/auth/login`**  
  Generates session token for executive personas (CEO, VP Strategy, Principal Architect, Guest).

---

## ☁️ Deployment (Replit / Render / Railway)

- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Port**: `5001` (or use `process.env.PORT`)
