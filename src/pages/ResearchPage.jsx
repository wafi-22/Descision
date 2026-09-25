import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Cpu, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  Save, 
  RotateCcw,
  Zap,
  Plus,
  Trash2,
  FileCheck,
  ChevronDown,
  Activity,
  Gauge
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

export const SAMPLE_PRESETS = {
  cloud: {
    title: "Cloud Migration: AWS Native vs Multi-Cloud Kubernetes",
    category: "Technology Infrastructure",
    problem: "Legacy monolithic infrastructure reaching end-of-life; annual maintenance surging 40% with recurring peak downtime.",
    budget: "$1.2M initial allocation, $45k/mo target run-rate",
    timeframe: "6 months to go-live",
    options: [
      {
        id: 'opt_1',
        name: "Option A: AWS Native Managed Stack",
        summary: "Full adoption of AWS Serverless and Managed Containers (ECS/Fargate, Aurora Serverless, DynamoDB).",
        pros: ["Zero cluster maintenance toil", "Immediate auto-scaling", "SOC2 out of the box"],
        cons: ["Proprietary vendor lock-in risk", "Egress cost volatility at high traffic"]
      },
      {
        id: 'opt_2',
        name: "Option B: Multi-Cloud Kubernetes (EKS + GKE)",
        summary: "Platform-agnostic Helm/Terraform architecture deployable identically across AWS and GCP to eliminate lock-in.",
        pros: ["Total multi-cloud portability", "Negotiating leverage with vendors", "Standard tooling"],
        cons: ["Requires 3 additional senior DevOps engineers ($540k/yr)", "Higher cross-cloud latency", "Longer onboarding"]
      }
    ]
  },
  expansion: {
    title: "Global Enterprise Expansion: Southeast Asia (APAC) vs LATAM",
    category: "Corporate Strategy & Growth",
    problem: "Domestic market growth slowing to 12% YoY; international expansion required to maintain growth milestones.",
    budget: "$3.5M expansion reserve",
    timeframe: "Q1 - Q4 2027",
    options: [
      {
        id: 'opt_1',
        name: "Option A: Southeast Asia Hub (Singapore / Jakarta)",
        summary: "Establish regional sales subsidiary in Singapore and distribute digitally into Indonesia and Vietnam.",
        pros: ["Rapid digital payment adoption", "English commercial fluency in Singapore hub", "High tech talent density"],
        cons: ["Higher initial corporate office lease costs", "Cross-border tax compliance across jurisdictions"]
      },
      {
        id: 'opt_2',
        name: "Option B: LATAM Expansion (Brazil / Mexico)",
        summary: "Enter through Sao Paulo with localized Portuguese/Spanish enterprise B2B sales teams.",
        pros: ["Timezone overlap with US headquarters", "Large unified population base"],
        cons: ["Complex Brazilian tax code (ICMS/PIS)", "Currency volatility hedges required", "Slower 9-month sales cycles"]
      }
    ]
  },
  ai: {
    title: "AI Infrastructure: On-Premise GPU Cluster vs Serverless Hyperscaler",
    category: "AI & Engineering Strategy",
    problem: "Foundation model fine-tuning and inference bills climbing to $180k/month; engineering facing compute shortages.",
    budget: "$2.0M CapEx or $200k/mo OpEx cap",
    timeframe: "Immediate deployment (30-60 days)",
    options: [
      {
        id: 'opt_1',
        name: "Option A: Hybrid Cloud GPU Clusters (Reserved + Spot)",
        summary: "1-year reserved instances on dedicated GPU clouds + automated fallback to AWS H100s for spike workloads.",
        pros: ["Zero physical data center overhead", "Flexible model architecture upgrades", "Immediate availability in 48 hours"],
        cons: ["Network latency for ultra-massive cluster interconnect", "Long-term commitment on specific GPU generations"]
      },
      {
        id: 'opt_2',
        name: "Option B: Dedicated On-Premises DGX Cluster (CapEx)",
        summary: "Procure 8x NVIDIA H200 server nodes housed in a tier-4 colocation facility.",
        pros: ["Lowest marginal cost per GPU hour at 100% utilization", "Maximum data privacy compliance"],
        cons: ["16-24 week supply chain lead time", "$1.8M upfront cash outlay", "Requires high-voltage power & liquid cooling contracts"]
      }
    ]
  },
  plg: {
    title: "Product GTM: Self-Serve PLG vs Direct Enterprise Sales Force",
    category: "Product & Commercial Strategy",
    problem: "Current sales-assisted pipeline has high CAC ($18k per deal); product usage metrics indicate high organic user viral signups.",
    budget: "$800,000 growth investment",
    timeframe: "4 months to rollout",
    options: [
      {
        id: 'opt_1',
        name: "Option A: Frictionless Product-Led Growth (PLG)",
        summary: "Self-serve credit-card checkout with in-app onboarding guides and reverse-trial product experience.",
        pros: ["Drastically cuts CAC by 65%", "Shortens sales cycle from 60 days to minutes", "High viral flywheel"],
        cons: ["Lower initial ACV (Annual Contract Value)", "Requires seamless product UX and automated billing"]
      },
      {
        id: 'opt_2',
        name: "Option B: Outbound Enterprise Field Sales",
        summary: "Hire 4 dedicated enterprise Account Executives targeting Fortune 500 procurement teams.",
        pros: ["High six-figure contract sizes ($120k+ ACV)", "Tailored custom SLAs and security audits"],
        cons: ["High burn rate and commission draw", "Vulnerable to macroeconomic budget freeze delays"]
      }
    ]
  }
};

export default function ResearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Form State
  const [title, setTitle] = useState(SAMPLE_PRESETS.cloud.title);
  const [category, setCategory] = useState(SAMPLE_PRESETS.cloud.category);
  const [problem, setProblem] = useState(SAMPLE_PRESETS.cloud.problem);
  const [budget, setBudget] = useState(SAMPLE_PRESETS.cloud.budget);
  const [timeframe, setTimeframe] = useState(SAMPLE_PRESETS.cloud.timeframe);
  const [options, setOptions] = useState(SAMPLE_PRESETS.cloud.options);

  // Evaluation & Processing State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationStage, setEvaluationStage] = useState('');
  const [result, setResult] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load preset from query params if specified
  useEffect(() => {
    const presetKey = searchParams.get('preset');
    if (presetKey && SAMPLE_PRESETS[presetKey]) {
      loadPreset(SAMPLE_PRESETS[presetKey]);
    }
  }, [searchParams]);

  const loadPreset = (preset) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setProblem(preset.problem);
    setBudget(preset.budget);
    setTimeframe(preset.timeframe);
    setOptions(JSON.parse(JSON.stringify(preset.options)));
    setResult(null);
  };

  const handleAddOption = () => {
    const nextChar = String.fromCharCode(65 + options.length);
    setOptions([
      ...options,
      {
        id: `opt_${Date.now()}`,
        name: `Option ${nextChar}: Strategic Alternative`,
        summary: "Structured path focusing on targeted risk-benefit trade-offs.",
        pros: ["Defined execution scope"],
        cons: ["Resource dependency"]
      }
    ]);
  };

  const handleRemoveOption = (index) => {
    if (options.length <= 2) {
      alert("At least 2 options are required for comparative decision intelligence.");
      return;
    }
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index, field, value) => {
    const updated = [...options];
    updated[index][field] = value;
    setOptions(updated);
  };

  // Run AI Multi-Model Evaluation
  const handleRunEvaluation = async () => {
    setIsEvaluating(true);
    setResult(null);

    // Staged feedback for executive presentation
    setEvaluationStage("Initializing Multi-Model Consensus Architecture...");
    setTimeout(() => setEvaluationStage("FinRisk-Alpha: Modeling 3-Year TCO & Capital Efficiency..."), 400);
    setTimeout(() => setEvaluationStage("OpsVelocity-V2: Quantifying Deployment Friction & Tech Debt..."), 800);
    setTimeout(() => setEvaluationStage("StratAlign-Pro & Governance-Shield: Stress-testing Moat & Compliance..."), 1200);

    try {
      const response = await fetch('/api/decisions/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          problem,
          budget,
          timeframe,
          options
        })
      });

      if (!response.ok) {
        throw new Error('Evaluation request failed');
      }

      const evalData = await response.json();
      setTimeout(() => {
        setResult(evalData);
        setIsEvaluating(false);
        setEvaluationStage('');
        
        // Scroll down to results smoothly
        setTimeout(() => {
          document.getElementById('evaluation-results')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }, 1600);

    } catch (err) {
      console.error(err);
      setIsEvaluating(false);
      setEvaluationStage('');
      alert("Error generating evaluation. Ensure backend server is running.");
    }
  };

  // Save decision into history and redirect to executive report
  const handleSaveAndExport = async () => {
    if (!result) return;
    setIsSaving(true);
    try {
      const decisionToSave = {
        ...result,
        author: `${user?.name} (${user?.role})`
      };

      const res = await fetch('/api/decisions/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(decisionToSave)
      });

      if (res.ok) {
        navigate(`/report/${result.id}`);
      } else {
        alert('Failed to save decision scenario.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving decision.');
    } finally {
      setIsSaving(false);
    }
  };

  // Prepare radar chart data
  const radarData = result?.options ? [
    { subject: 'Financial Efficiency', [result.options[0]?.name || 'Option A']: result.options[0]?.metrics?.financialCost || 85, [result.options[1]?.name || 'Option B']: result.options[1]?.metrics?.financialCost || 60, fullMark: 100 },
    { subject: 'Deployment Speed', [result.options[0]?.name || 'Option A']: result.options[0]?.metrics?.speedToDeliver || 92, [result.options[1]?.name || 'Option B']: result.options[1]?.metrics?.speedToDeliver || 55, fullMark: 100 },
    { subject: 'Scalability & Elasticity', [result.options[0]?.name || 'Option A']: result.options[0]?.metrics?.scalability || 90, [result.options[1]?.name || 'Option B']: result.options[1]?.metrics?.scalability || 95, fullMark: 100 },
    { subject: 'Operational Safety (100 - Risk)', [result.options[0]?.name || 'Option A']: 100 - (result.options[0]?.metrics?.operationalRisk || 25), [result.options[1]?.name || 'Option B']: 100 - (result.options[1]?.metrics?.operationalRisk || 65), fullMark: 100 },
    { subject: 'Strategic Alignment', [result.options[0]?.name || 'Option A']: result.options[0]?.metrics?.strategicFit || 92, [result.options[1]?.name || 'Option B']: result.options[1]?.metrics?.strategicFit || 75, fullMark: 100 }
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Preset Switcher */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-brand-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Multi-Model Research Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Autonomous Scenario Evaluation Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Input competing alternatives, budget limits, and risk tolerances. The multi-model engine evaluates cross-domain trade-offs and generates board-level consensus.
            </p>
          </div>

          {/* Quick Preset Selector Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Presets:</span>
            <button
              type="button"
              onClick={() => loadPreset(SAMPLE_PRESETS.cloud)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
            >
              Cloud Native
            </button>
            <button
              type="button"
              onClick={() => loadPreset(SAMPLE_PRESETS.expansion)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
            >
              Global Expansion
            </button>
            <button
              type="button"
              onClick={() => loadPreset(SAMPLE_PRESETS.ai)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
            >
              AI Compute
            </button>
            <button
              type="button"
              onClick={() => loadPreset(SAMPLE_PRESETS.plg)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
            >
              PLG vs Enterprise
            </button>
          </div>
        </div>
      </div>

      {/* Scenario Input Configuration Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Scenario Details Form (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-7 rounded-2xl border border-slate-800 shadow-xl space-y-5">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Layers className="w-4 h-4 text-brand-400" />
            <span>1. Decision Scenario Parameters</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Scenario Title / Strategic Dilemma
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Migration from Monolith to Event-Driven Microservices"
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Domain Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="Technology Infrastructure">Technology Infrastructure</option>
                  <option value="Corporate Strategy & Growth">Corporate Strategy & Growth</option>
                  <option value="AI & Engineering Strategy">AI & Engineering Strategy</option>
                  <option value="Product & Commercial Strategy">Product & Commercial Strategy</option>
                  <option value="Security & Compliance">Security & Compliance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Budget Allocation</label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="$1.2M CapEx / $40k OpEx"
                  className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Timeframe</label>
                <input
                  type="text"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  placeholder="6 months to go-live"
                  className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Core Problem Statement & Strategic Constraints
              </label>
              <textarea
                rows={3}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Describe current bottleneck, financial exposure, risks, and hard constraints..."
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Options Comparison Builder */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Structured Options Under Evaluation</span>
                <span className="text-xs text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full">
                  {options.length} Alternatives
                </span>
              </h3>
              <button
                type="button"
                onClick={handleAddOption}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Option</span>
              </button>
            </div>

            <div className="space-y-3">
              {options.map((opt, idx) => (
                <div key={opt.id || idx} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={opt.name}
                      onChange={(e) => handleOptionChange(idx, 'name', e.target.value)}
                      className="text-xs sm:text-sm font-bold text-brand-300 bg-transparent border-b border-transparent hover:border-slate-700 focus:border-brand-500 focus:outline-none w-3/4"
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        title="Remove option"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={opt.summary}
                    onChange={(e) => handleOptionChange(idx, 'summary', e.target.value)}
                    placeholder="Brief description of this strategic approach..."
                    className="w-full px-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-brand-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Evaluate Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleRunEvaluation}
              disabled={isEvaluating}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-brand-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isEvaluating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{evaluationStage || "Simulating Multi-Model AI Consensus..."}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Run AI Multi-Model Evaluation</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Multi-Model Evaluation Architecture Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-brand-400" />
                <span>Multi-Model Consensus Lenses</span>
              </h2>
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                4 Specialized Agents
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Each scenario is evaluated through four distinct AI perspective models to synthesize unbiased, enterprise-grade recommendations:
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-200">FinRisk-Alpha</h3>
                  <p className="text-[11px] text-slate-400">Models 3-year TCO, CapEx vs OpEx velocity, payback period, and inflation sensitivity.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-200">OpsVelocity-V2</h3>
                  <p className="text-[11px] text-slate-400">Calculates technical debt accrual, team onboarding lead-time, and downtime risk.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400 shrink-0">
                  <Gauge className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-200">StratAlign-Pro</h3>
                  <p className="text-[11px] text-slate-400">Evaluates market timing advantage, competitive moat expansion, and agility.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-200">Governance-Shield</h3>
                  <p className="text-[11px] text-slate-400">Audits regulatory compliance, GDPR/SOC2 adherence, and vendor lock-in thresholds.</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-brand-950/40 border border-brand-500/20 text-xs text-brand-200 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-brand-400 shrink-0" />
              <span>Offline/Mock engine runs in &lt;1.5s. Seamless Gemini API fallback available.</span>
            </div>
          </div>
        </div>

      </div>

      {/* EVALUATION RESULTS & MULTI-MODEL INTELLIGENCE OUTPUT */}
      {result && (
        <div id="evaluation-results" className="space-y-8 pt-4">
          
          {/* Executive Recommendation Banner */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-950/50 via-slate-900/90 to-navy-900 shadow-2xl relative overflow-hidden space-y-4">
            <div className="absolute right-0 top-0 w-80 h-full bg-brand-500/10 blur-3xl pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    Primary AI Recommendation Consensus
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {result.primaryRecommendation}
                  </h2>
                </div>
              </div>

              {/* Confidence Score Pill */}
              <div className="flex items-center space-x-3 shrink-0">
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-medium">Consensus Confidence</div>
                  <div className="text-2xl font-black text-brand-300">{result.confidenceScore}%</div>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-brand-500 flex items-center justify-center bg-slate-900 text-xs font-bold text-white shadow-lg shadow-brand-500/30">
                  {result.confidenceScore}%
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-200 leading-relaxed relative z-10">
              <strong className="text-brand-300">Executive Rationale: </strong>
              {result.recommendationRationale}
            </div>

            {/* Quick Action: Save & Open Boardroom Report */}
            <div className="flex items-center justify-end space-x-3 pt-2 relative z-10">
              <button
                type="button"
                onClick={handleSaveAndExport}
                disabled={isSaving}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-brand-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving Scenario..." : "Save & Open Executive Report"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Multi-Model Breakdown Cards (4 Grid) */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-brand-400" />
              <span>Multi-Model Agent Evaluation Feed</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(result.multiModelAnalysis || {}).map(([key, model]) => (
                <div key={key} className="glass-panel p-4 rounded-xl border border-slate-800 shadow-md space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-300 truncate max-w-[140px]">
                      {model.modelName?.split(' ')[0]}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {model.score}/100
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-200">
                    {model.verdict}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {model.insights}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Comparison Matrix & Radar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Comparison Matrix Table (7 cols) */}
            <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-brand-400" />
                <span>Decision Comparison Matrix</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-2.5 px-3">Evaluation Criterion</th>
                      <th className="py-2.5 px-3">Weight</th>
                      <th className="py-2.5 px-3">{result.options[0]?.name?.split(':')[0] || 'Option A'}</th>
                      <th className="py-2.5 px-3">{result.options[1]?.name?.split(':')[0] || 'Option B'}</th>
                      <th className="py-2.5 px-3 text-right">Advantage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {result.tradeoffComparison?.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3 px-3 font-medium text-slate-200">{row.criterion}</td>
                        <td className="py-3 px-3 text-slate-400">{row.weight}</td>
                        <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">{row['Option A'] || row[result.options[0]?.name] || 'Optimal'}</td>
                        <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">{row['Option B'] || row[result.options[1]?.name] || 'Moderate'}</td>
                        <td className="py-3 px-3 text-right font-bold text-emerald-400">
                          {row.winner?.includes('A') ? 'Option A' : row.winner?.includes('B') ? 'Option B' : row.winner}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Radar Chart (5 cols) */}
            <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Gauge className="w-4 h-4 text-brand-400" />
                <span>Multidimensional Radar Profile</span>
              </h3>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 9 }} />
                    <Radar 
                      name={result.options[0]?.name || 'Option A'} 
                      dataKey={result.options[0]?.name || 'Option A'} 
                      stroke="#6366f1" 
                      fill="#6366f1" 
                      fillOpacity={0.4} 
                    />
                    <Radar 
                      name={result.options[1]?.name || 'Option B'} 
                      dataKey={result.options[1]?.name || 'Option B'} 
                      stroke="#38bdf8" 
                      fill="#38bdf8" 
                      fillOpacity={0.25} 
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Monte Carlo Risk Bounds & 4-Phase Roadmap */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Monte Carlo Scenarios (6 cols) */}
            <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Monte Carlo Tail-Risk Scenarios</span>
              </h3>

              <div className="space-y-2.5">
                {result.monteCarloRisks?.map((risk, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-1.5">
                    <div className="font-semibold text-slate-200">{risk.scenario}</div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <div>
                        Option A Probability: <span className="text-emerald-400 font-bold">{risk.probOptionA}</span>
                      </div>
                      <div>
                        Option B Probability: <span className="text-amber-400 font-bold">{risk.probOptionB}</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-rose-300 font-medium">
                      Impact: {risk.impact}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phased Action Roadmap (6 cols) */}
            <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-brand-400" />
                <span>Phased Execution Roadmap</span>
              </h3>

              <div className="space-y-2.5">
                {result.actionPlan?.map((step, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">{step.phase}</span>
                      <div className="font-semibold text-slate-200 mt-0.5">{step.title}</div>
                    </div>
                    <div className="text-[11px] font-medium text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 shrink-0">
                      {step.owner}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
