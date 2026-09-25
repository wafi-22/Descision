import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  Clock, 
  Search, 
  Filter, 
  ArrowRight, 
  PlusCircle, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  BarChart3,
  Layers,
  Zap,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell 
} from 'recharts';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [decisions, setDecisions] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch decisions and metrics
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [resDecisions, resMetrics] = await Promise.all([
        fetch('/api/decisions'),
        fetch('/api/metrics')
      ]);

      if (resDecisions.ok) {
        const data = await resDecisions.json();
        setDecisions(data);
      }
      if (resMetrics.ok) {
        const m = await resMetrics.json();
        setMetrics(m);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteDecision = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to remove this evaluated scenario?')) return;
    try {
      const res = await fetch(`/api/decisions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDecisions(prev => prev.filter(d => d.id !== id));
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // Filtered decisions
  const filteredDecisions = decisions.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.primaryRecommendation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || d.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Unique categories
  const categories = ['All', ...new Set(decisions.map(d => d.category))];

  // Chart data: Confidence vs Risk
  const chartData = decisions.map(d => ({
    name: d.title.length > 22 ? d.title.substring(0, 20) + '...' : d.title,
    confidence: d.confidenceScore,
    riskLevel: d.riskLevel,
    id: d.id
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome & Top Action Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl glass-panel border border-brand-500/20 bg-gradient-to-r from-navy-900 via-brand-950/40 to-navy-900 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-brand-500/10 blur-3xl pointer-events-none"></div>

        <div className="space-y-1 relative z-10">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-brand-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Executive Strategic Dashboard</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Welcome, {user?.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Decision Intelligence Command Center
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Simulate high-stakes enterprise decisions through multi-model AI consensus. Eliminate blind spots, quantify tail-risk, and accelerate organizational alignment.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0 relative z-10">
          <button
            onClick={() => navigate('/research')}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-brand-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Evaluate New Scenario</span>
          </button>
        </div>
      </div>

      {/* Visual Indicator Cards (4 KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Decision Confidence Index */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 shadow-lg relative">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Confidence Index</span>
            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">
              {metrics?.avgConfidence || 91}%
            </span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              High Assurance
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-brand-500 to-emerald-400 h-1.5 rounded-full" 
              style={{ width: `${metrics?.avgConfidence || 91}%` }}
            ></div>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Cross-model statistical consensus</p>
        </div>

        {/* KPI 2: Decision Velocity */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Decision Velocity</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">
              {metrics?.velocityDays || 4.2} <span className="text-sm font-normal text-slate-400">days</span>
            </span>
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
              -85% vs Avg
            </span>
          </div>
          <p className="mt-4 text-[11px] text-slate-400">Average time to executive alignment</p>
        </div>

        {/* KPI 3: Risk Heatmap Breakdown */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Risk Heatmap</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-3">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-sm font-bold text-white">{decisions.filter(d => !d.riskLevel?.includes('High')).length}</span>
              <span className="text-xs text-slate-400">Low/Mod</span>
            </div>
            <div className="text-slate-600">|</div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
              <span className="text-sm font-bold text-white">{decisions.filter(d => d.riskLevel?.includes('High')).length}</span>
              <span className="text-xs text-slate-400">High</span>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-slate-400">Tail-risk scenarios mitigated</p>
        </div>

        {/* KPI 4: Capital & Time Preservation */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Preserved Capital</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">
              {metrics?.capitalSavedEstimated || '$1.8M'}
            </span>
            <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
              NPV Gain
            </span>
          </div>
          <p className="mt-4 text-[11px] text-slate-400">Overhead avoided via early triage</p>
        </div>

      </div>

      {/* Main Content: Decision Matrix & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Decision Frameworks List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-panel p-4 rounded-xl border border-slate-800">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scenarios, recommendations, categories..."
                className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-lg text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-900/80 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-brand-500"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <button
                onClick={fetchDashboardData}
                title="Refresh decisions"
                className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900/80 border border-slate-800 hover:bg-slate-800 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Decision Cards List */}
          {isLoading ? (
            <div className="glass-panel p-12 text-center rounded-xl border border-slate-800 text-slate-400 space-y-3">
              <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm">Synthesizing Decision Frameworks...</p>
            </div>
          ) : filteredDecisions.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-xl border border-slate-800 text-slate-400 space-y-4">
              <Layers className="w-10 h-10 text-slate-500 mx-auto" />
              <div>
                <h3 className="text-base font-bold text-white">No Decision Scenarios Found</h3>
                <p className="text-xs text-slate-400 mt-1">Try clearing your search query or evaluate a brand new scenario.</p>
              </div>
              <button
                onClick={() => navigate('/research')}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg inline-flex items-center space-x-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Evaluate New Scenario</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDecisions.map((dec) => (
                <div
                  key={dec.id}
                  onClick={() => navigate(`/report/${dec.id}`)}
                  className="glass-panel glass-panel-hover p-5 rounded-xl border border-slate-800/90 cursor-pointer group relative"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-semibold text-brand-300 bg-brand-500/10 border border-brand-500/20 px-2.5 py-0.5 rounded-full">
                        {dec.category}
                      </span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-400">{dec.date}</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 text-xs">
                        <span className="text-slate-400">Confidence:</span>
                        <span className="font-extrabold text-brand-300">{dec.confidenceScore}%</span>
                      </div>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                        dec.riskLevel?.includes('Low') 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {dec.riskLevel} Risk
                      </span>

                      <button
                        onClick={(e) => handleDeleteDecision(e, dec.id)}
                        title="Delete decision"
                        className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                    {dec.title}
                  </h3>

                  {/* Recommendation Callout */}
                  <div className="mt-3 p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-semibold text-slate-300">Selected Path: </span>
                      <span className="text-emerald-300 font-medium">{dec.primaryRecommendation}</span>
                      <p className="text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {dec.recommendationRationale}
                      </p>
                    </div>
                  </div>

                  {/* Footer tags */}
                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] text-slate-500">Evaluator:</span>
                      <span className="text-slate-300 font-medium">{dec.author?.split('(')[0] || 'AI Consensus'}</span>
                    </div>

                    <div className="flex items-center space-x-1 text-brand-400 font-semibold group-hover:translate-x-1 transition-transform">
                      <span>Inspect Report</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right Column: Visual Confidence Distribution & Presets (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Confidence Analytics Chart */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-brand-400" />
                <span>Consensus Scores</span>
              </h3>
              <span className="text-[11px] text-slate-400">Confidence %</span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#94a3b8', fontSize: 10 }} 
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis domain={[50, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#818cf8' }}
                  />
                  <Bar dataKey="confidence" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.confidence > 88 ? '#6366f1' : '#38bdf8'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick-Start Preset Box */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Instant Benchmark Scenarios</span>
            </h3>
            <p className="text-xs text-slate-400">
              Run simulated tests across typical high-stakes corporate dilemmas:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => navigate('/research?preset=cloud')}
                className="w-full text-left p-3 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 transition-all text-xs group"
              >
                <div className="font-semibold text-slate-200 group-hover:text-brand-300">
                  Cloud Infrastructure TCO
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  AWS Native Managed vs Multi-Cloud Kubernetes
                </div>
              </button>

              <button
                onClick={() => navigate('/research?preset=expansion')}
                className="w-full text-left p-3 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 transition-all text-xs group"
              >
                <div className="font-semibold text-slate-200 group-hover:text-brand-300">
                  Global Expansion Strategy
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  APAC High Growth vs LATAM Enterprise Penetration
                </div>
              </button>

              <button
                onClick={() => navigate('/research?preset=ai')}
                className="w-full text-left p-3 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 transition-all text-xs group"
              >
                <div className="font-semibold text-slate-200 group-hover:text-brand-300">
                  AI Compute Architecture
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Reserved Cloud Clusters vs Physical DGX CapEx
                </div>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
