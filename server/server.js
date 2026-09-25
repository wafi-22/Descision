import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { evaluateScenario } from './aiEngine.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data', 'decisions.json');

// Helper to read decisions
function getDecisions() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading decisions file:', err);
    return [];
  }
}

// Helper to write decisions
function saveDecisions(decisions) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(decisions, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing decisions file:', err);
    return false;
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'DecisionMind AI Engine',
    geminiEnabled: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== ''),
    activeDecisionsCount: getDecisions().length,
    timestamp: new Date().toISOString()
  });
});

// Authentication endpoints (Mock + Guest demo)
app.post('/api/auth/login', (req, res) => {
  const { role, username, email } = req.body;
  
  const profiles = {
    executive: {
      id: 'usr_exec',
      name: 'Victoria Vance',
      role: 'Chief Executive Officer',
      email: email || 'v.vance@enterprise.io',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      department: 'Executive Board',
      clearanceLevel: 'L5 - Strategic Authorization'
    },
    strategist: {
      id: 'usr_strat',
      name: 'Elena Rostova',
      role: 'VP of Corporate Strategy',
      email: email || 'elena.r@enterprise.io',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      department: 'Global Operations & Growth',
      clearanceLevel: 'L4 - Strategic Advisory'
    },
    engineer: {
      id: 'usr_eng',
      name: 'Marcus Chen',
      role: 'Principal Systems Architect',
      email: email || 'marcus.c@enterprise.io',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      department: 'Platform Engineering',
      clearanceLevel: 'L4 - Technical Authorization'
    },
    demo: {
      id: 'usr_demo',
      name: 'Alex Mercer',
      role: 'Executive Decision Maker',
      email: email || 'alex.mercer@decisionmind.ai',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      department: 'Strategy & Capital Allocation',
      clearanceLevel: 'L5 - Master Evaluator'
    }
  };

  const selectedUser = profiles[role] || profiles.demo;
  res.json({
    token: `demo_token_${Date.now()}`,
    user: selectedUser
  });
});

// Get all evaluated decisions
app.get('/api/decisions', (req, res) => {
  const decisions = getDecisions();
  res.json(decisions);
});

// Get single decision by ID
app.get('/api/decisions/:id', (req, res) => {
  const decisions = getDecisions();
  const decision = decisions.find(d => d.id === req.params.id);
  if (!decision) {
    return res.status(404).json({ error: 'Decision scenario not found' });
  }
  res.json(decision);
});

// Run AI Multi-Model Evaluation
app.post('/api/decisions/evaluate', async (req, res) => {
  try {
    const { title, problem, budget, timeframe, category, options } = req.body;
    if (!title || !problem) {
      return res.status(400).json({ error: 'Title and problem description are required' });
    }

    const evaluationResult = await evaluateScenario({
      title,
      problem,
      budget,
      timeframe,
      category,
      options
    });

    res.json(evaluationResult);
  } catch (err) {
    console.error('Error running evaluation:', err);
    res.status(500).json({ error: 'Failed to complete decision evaluation', details: err.message });
  }
});

// Save evaluated decision into history
app.post('/api/decisions/save', (req, res) => {
  try {
    const newDecision = req.body;
    if (!newDecision || !newDecision.title) {
      return res.status(400).json({ error: 'Invalid decision payload' });
    }

    const decisions = getDecisions();
    // Check if updating or creating
    const existingIndex = decisions.findIndex(d => d.id === newDecision.id);
    if (existingIndex >= 0) {
      decisions[existingIndex] = { ...newDecision, updatedAt: new Date().toISOString() };
    } else {
      decisions.unshift({
        ...newDecision,
        id: newDecision.id || `dec_${Date.now()}`,
        createdAt: new Date().toISOString()
      });
    }

    saveDecisions(decisions);
    res.status(201).json({ success: true, decision: newDecision });
  } catch (err) {
    console.error('Error saving decision:', err);
    res.status(500).json({ error: 'Failed to save decision record' });
  }
});

// Delete decision
app.delete('/api/decisions/:id', (req, res) => {
  try {
    const decisions = getDecisions();
    const filtered = decisions.filter(d => d.id !== req.params.id);
    saveDecisions(filtered);
    res.json({ success: true, remaining: filtered.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete decision record' });
  }
});

// Aggregated decision intelligence metrics
app.get('/api/metrics', (req, res) => {
  const decisions = getDecisions();
  const total = decisions.length;
  if (total === 0) {
    return res.json({
      totalDecisions: 0,
      avgConfidence: 0,
      riskDistribution: { low: 0, moderate: 0, high: 0 },
      velocityDays: 0
    });
  }

  const avgConfidence = Math.round(decisions.reduce((sum, d) => sum + (d.confidenceScore || 0), 0) / total);
  const riskDistribution = {
    low: decisions.filter(d => d.riskLevel?.toLowerCase().includes('low')).length,
    moderate: decisions.filter(d => d.riskLevel?.toLowerCase().includes('moderate')).length,
    high: decisions.filter(d => d.riskLevel?.toLowerCase().includes('high')).length
  };

  res.json({
    totalDecisions: total,
    avgConfidence,
    riskDistribution,
    velocityDays: 4.2, // average days to final consensus vs enterprise standard 28 days
    timeSavedHours: total * 48,
    capitalSavedEstimated: `$${(total * 0.42).toFixed(1)}M`
  });
});

app.listen(PORT, () => {
  console.log(`[DecisionMind AI Server] Running on http://localhost:${PORT}`);
});
