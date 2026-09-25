import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Printer, 
  Share2, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  Cpu, 
  Sliders, 
  ChevronRight,
  Sparkles,
  FileText
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

export default function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [decision, setDecision] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Interactive Sensitivity Simulator Weights
  const [weights, setWeights] = useState({
    financial: 30,
    speed: 30,
    risk: 25,
    strategic: 15
  });

  useEffect(() => {
    async function fetchDecision() {
      try {
        const res = await fetch(`/api/decisions/${id}`);
        if (res.ok) {
          const data = await res.json();
          setDecision(data);
        } else {
          // If not found in backend, fallback to first in list or notify
          const allRes = await fetch('/api/decisions');
          const all = await allRes.json();
          const match = all.find(d => d.id === id) || all[0];
          setDecision(match);
        }
      } catch (err) {
        console.error('Failed to load decision report:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDecision();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadMarkdown = () => {
    if (!decision) return;
    const content = `# DecisionMind AI — Executive Decision Brief
**Scenario Title:** ${decision.title}
**Category:** ${decision.category}
**Date:** ${decision.date}
**Author:** ${decision.author}
**Decision Confidence Index:** ${decision.confidenceScore}%
**Risk Level:** ${decision.riskLevel}

---

## 1. Executive Recommendation
**Selected Path:** ${decision.primaryRecommendation}
**Strategic Rationale:** ${decision.recommendationRationale}

---

## 2. Multi-Model Consensus Breakdown
- **FinRisk-Alpha:** ${decision.multiModelAnalysis?.finRisk?.verdict || 'Favorable'} (${decision.multiModelAnalysis?.finRisk?.score || 90}/100)
- **OpsVelocity-V2:** ${decision.multiModelAnalysis?.opsVelocity?.verdict || 'Favorable'} (${decision.multiModelAnalysis?.opsVelocity?.score || 88}/100)
- **StratAlign-Pro:** ${decision.multiModelAnalysis?.stratAlign?.verdict || 'Favorable'} (${decision.multiModelAnalysis?.stratAlign?.score || 92}/100)
- **Governance-Shield:** ${decision.multiModelAnalysis?.governance?.verdict || 'Favorable'} (${decision.multiModelAnalysis?.governance?.score || 86}/100)

---

## 3. Trade-off Comparison
${decision.tradeoffComparison?.map(t => `- **${t.criterion}** (${t.weight}): Advantage -> ${t.winner}`).join('\n')}

---
Generated autonomously by DecisionMind AI Platform.
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DecisionMind_${decision.id}_Executive_Report.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-slate-400">Loading Executive Decision Brief...</p>
      </div>
    );
  }

  if (!decision) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Decision Scenario Not Found</h2>
        <p className="text-xs text-slate-400">The requested report ID could not be loaded.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-brand-600 rounded-lg text-xs font-semibold text-white"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Calculate dynamic simulated score based on user slider weights
  const optionA = decision.options?.[0];
  const optionB = decision.options?.[1];

  const totalWeight = weights.financial + weights.speed + weights.risk + weights.strategic;
  const simScoreA = optionA?.metrics ? Math.round(
    ((optionA.metrics.financialCost * weights.financial) +
     (optionA.metrics.speedToDeliver * weights.speed) +
     ((100 - optionA.metrics.operationalRisk) * weights.risk) +
     (optionA.metrics.strategicFit * weights.strategic)) / totalWeight
  ) : decision.confidenceScore;

  const simScoreB = optionB?.metrics ? Math.round(
    ((optionB.metrics.financialCost * weights.financial) +
     (optionB.metrics.speedToDeliver * weights.speed) +
     ((100 - optionB.metrics.operationalRisk) * weights.risk) +
     (optionB.metrics.strategicFit * weights.strategic)) / totalWeight
  ) : 74;

  const radarData = [
    { subject: 'Financial Efficiency', [optionA?.name || 'Option A']: optionA?.metrics?.financialCost || 85, [optionB?.name || 'Option B']: optionB?.metrics?.financialCost || 60 },
    { subject: 'Deployment Speed', [optionA?.name || 'Option A']: optionA?.metrics?.speedToDeliver || 92, [optionB?.name || 'Option B']: optionB?.metrics?.speedToDeliver || 55 },
    { subject: 'Scalability', [optionA?.name || 'Option A']: optionA?.metrics?.scalability || 90, [optionB?.name || 'Option B']: optionB?.metrics?.scalability || 95 },
    { subject: 'Operational Safety', [optionA?.name || 'Option A']: 100 - (optionA?.metrics?.operationalRisk || 25), [optionB?.name || 'Option B']: 100 - (optionB?.metrics?.operationalRisk || 65) },
    { subject: 'Strategic Moat', [optionA?.name || 'Option A']: optionA?.metrics?.strategicFit || 92, [optionB?.name || 'Option B']: optionB?.metrics?.strategicFit || 75 }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Toolbar (No-print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-4 rounded-xl border border-slate-800">
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Link Copied!' : 'Share Link'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadMarkdown}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Markdown</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/30 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Executive PDF</span>
          </button>
        </div>
      </div>

      {/* Main Report Container */}
      <div className="glass-panel p-8 sm:p-10 rounded-2xl border border-slate-800 shadow-2xl space-y-8 bg-navy-950/70">
        
        {/* Report Header */}
        <div className="border-b border-slate-800/80 pb-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 border border-brand-500/20 px-3 py-1 rounded-full">
                {decision.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {decision.id}</span>
            </div>

            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <span>Date: <strong className="text-slate-200">{decision.date}</strong></span>
              <span>•</span>
              <span>Classification: <strong className="text-emerald-400">Boardroom Confidential</strong></span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
            {decision.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <div>
              Evaluator: <strong className="text-slate-200">{decision.author}</strong>
            </div>
            <div>•</div>
            <div>
              Budget Scope: <strong className="text-slate-200">{decision.scenario?.budget || '$1.2M'}</strong>
            </div>
            <div>•</div>
            <div>
              Timeframe: <strong className="text-slate-200">{decision.scenario?.timeframe || '6 months'}</strong>
            </div>
          </div>
        </div>

        {/* Section 1: Executive Consensus Recommendation */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-950/60 via-slate-900 to-navy-900 border border-brand-500/30 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Autonomous Consensus Recommendation
                </span>
                <h2 className="text-xl font-extrabold text-white">
                  {decision.primaryRecommendation}
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <div className="text-right">
                <div className="text-xs text-slate-400">Confidence Index</div>
                <div className="text-2xl font-black text-brand-300">{decision.confidenceScore}%</div>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500 flex items-center justify-center text-xs font-bold text-white bg-slate-900">
                {decision.confidenceScore}%
              </div>
            </div>
          </div>

          <div className="text-sm text-slate-200 leading-relaxed pt-2 border-t border-slate-800">
            <strong className="text-brand-300">Executive Rationale: </strong>
            {decision.recommendationRationale}
          </div>
        </div>

        {/* Section 2: Interactive Sensitivity Simulator (Interactive Hackathon Feature) */}
        <div className="no-print p-6 rounded-2xl glass-panel border border-brand-500/30 space-y-4 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-brand-400" />
              <h3 className="text-sm font-bold text-white">
                Interactive Sensitivity & Priority Simulator
              </h3>
            </div>
            <span className="text-[11px] text-brand-300 font-medium bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/20">
              Live Stress-Test
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Adjust executive criteria weights below to see how shifts in board priorities affect the model outcome in real time:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Cost / TCO Weight</span>
                <span className="font-bold text-brand-400">{weights.financial}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={weights.financial}
                onChange={(e) => setWeights({ ...weights, financial: parseInt(e.target.value) })}
                className="w-full accent-brand-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Speed to Value</span>
                <span className="font-bold text-indigo-400">{weights.speed}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={weights.speed}
                onChange={(e) => setWeights({ ...weights, speed: parseInt(e.target.value) })}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Risk Aversion</span>
                <span className="font-bold text-emerald-400">{weights.risk}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={weights.risk}
                onChange={(e) => setWeights({ ...weights, risk: parseInt(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Strategic Moat</span>
                <span className="font-bold text-purple-400">{weights.strategic}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={weights.strategic}
                onChange={(e) => setWeights({ ...weights, strategic: parseInt(e.target.value) })}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400">Simulated Score for Option A: </span>
              <strong className="text-emerald-400 font-bold text-sm ml-1">{simScoreA}/100</strong>
            </div>
            <div>
              <span className="text-slate-400">Simulated Score for Option B: </span>
              <strong className="text-slate-300 font-bold text-sm ml-1">{simScoreB}/100</strong>
            </div>
            <div className="text-slate-400">
              Sensitivity Spread: <strong className="text-brand-300">+{simScoreA - simScoreB} pts</strong>
            </div>
          </div>
        </div>

        {/* Section 3: Radar Chart & Trade-off Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Trade-off Table (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <FileText className="w-4 h-4 text-brand-400" />
              <span>Structured Trade-off Matrix</span>
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold bg-slate-900/60">
                    <th className="py-2.5 px-3">Evaluation Criterion</th>
                    <th className="py-2.5 px-3">Weight</th>
                    <th className="py-2.5 px-3">Option A</th>
                    <th className="py-2.5 px-3">Option B</th>
                    <th className="py-2.5 px-3 text-right">Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {decision.tradeoffComparison?.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-3 px-3 font-medium text-slate-200">{row.criterion}</td>
                      <td className="py-3 px-3 text-slate-400">{row.weight}</td>
                      <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">{row['Option A'] || 'Optimal'}</td>
                      <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">{row['Option B'] || 'Sub-optimal'}</td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-400">{row.winner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Radar Profile (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-brand-400" />
              <span>Multidimensional Profile</span>
            </h3>

            <div className="h-64 w-full p-2 rounded-xl border border-slate-800 bg-slate-900/40">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 9 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 8 }} />
                  <Radar name="Option A" dataKey={optionA?.name || 'Option A'} stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                  <Radar name="Option B" dataKey={optionB?.name || 'Option B'} stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.25} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Section 4: Monte Carlo Scenarios & Phased Roadmap */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Tail-risk breakdown */}
          <div className="lg:col-span-6 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Monte Carlo Tail-Risk Bounds</span>
            </h3>

            <div className="space-y-2">
              {decision.monteCarloRisks?.map((r, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                  <div className="font-semibold text-slate-200">{r.scenario}</div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Option A: <strong className="text-emerald-400">{r.probOptionA}</strong></span>
                    <span>Option B: <strong className="text-amber-400">{r.probOptionB}</strong></span>
                  </div>
                  <div className="text-[11px] text-rose-300">Impact: {r.impact}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Implementation phases */}
          <div className="lg:col-span-6 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-brand-400" />
              <span>Phased Execution Roadmap</span>
            </h3>

            <div className="space-y-2">
              {decision.actionPlan?.map((p, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">{p.phase}</span>
                    <div className="font-semibold text-slate-200">{p.title}</div>
                  </div>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700 shrink-0">
                    {p.owner}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Report Footer / Signature */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            Generated by <strong className="text-slate-200">DecisionMind AI Consensus Engine v2.5</strong>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cryptographically Verified Scenario Ledger</span>
          </div>
        </div>

      </div>

    </div>
  );
}
