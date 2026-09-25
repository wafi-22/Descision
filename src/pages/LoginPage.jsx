import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, DEMO_PROFILES } from '../context/AuthContext';
import { 
  BrainCircuit, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  TrendingUp, 
  CheckCircle2,
  Lock,
  UserCheck
} from 'lucide-react';

export default function LoginPage() {
  const { loginAs } = useAuth();
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState(DEMO_PROFILES[0]);
  const [customEmail, setCustomEmail] = useState(DEMO_PROFILES[0].email);
  const [customPassword, setCustomPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectRole = (profile) => {
    setSelectedProfile(profile);
    setCustomEmail(profile.email);
  };

  const handleLogin = (profileToUse) => {
    setIsLoading(true);
    setTimeout(() => {
      loginAs(profileToUse || selectedProfile);
      setIsLoading(false);
      navigate('/dashboard');
    }, 450);
  };

  const handleQuickGuest = () => {
    setIsLoading(true);
    setTimeout(() => {
      loginAs({
        id: 'usr_guest',
        name: 'Alex Mercer',
        role: 'Executive Decision Maker',
        email: 'alex.mercer@decisionmind.ai',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        department: 'Corporate Strategy & Governance',
        clearanceLevel: 'L5 - Master Authorization'
      });
      setIsLoading(false);
      navigate('/dashboard');
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto w-full relative z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 shadow-xl shadow-brand-500/25 mb-4 animate-bounce-subtle">
            <BrainCircuit className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            DecisionMind <span className="gradient-brand-text">AI</span>
          </h1>
          <p className="mt-2 text-base sm:text-lg text-slate-300 max-w-xl mx-auto">
            Autonomous Scenario-Based Decision Intelligence. Evaluate complex trade-offs, model risks, and achieve executive consensus.
          </p>
        </div>

        {/* Main Grid: Roles + Fast Sign-In */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: 1-Click Persona Quick Access */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <UserCheck className="w-5 h-5 text-brand-400" />
                  <span>Select Decision Maker Persona</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Click any profile below for instant 1-click access</p>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                Zero Setup
              </span>
            </div>

            <div className="space-y-3">
              {DEMO_PROFILES.map((profile) => {
                const isSelected = selectedProfile.id === profile.id;
                return (
                  <div
                    key={profile.id}
                    onClick={() => handleSelectRole(profile)}
                    className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all border ${
                      isSelected 
                        ? 'bg-brand-950/70 border-brand-500/80 shadow-md shadow-brand-500/15 ring-1 ring-brand-500/40' 
                        : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-500/30"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-bold text-white">{profile.name}</h3>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                            {profile.clearanceLevel.split(' - ')[0]}
                          </span>
                        </div>
                        <p className="text-xs text-brand-300 font-medium">{profile.role}</p>
                        <p className="text-[11px] text-slate-400">{profile.department}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLogin(profile);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center space-x-1 shadow-sm transition-all"
                    >
                      <span>Enter</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Quick Instant Demo Access CTA */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <button
                type="button"
                onClick={handleQuickGuest}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-brand-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
                <span>Instant 1-Click Guest Access (All Clearance)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Credentials Box & Platform Pillars */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Manual Form Box (prefilled) */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center space-x-2">
                <Lock className="w-4 h-4 text-brand-400" />
                <span>Enterprise SSO / Direct Access</span>
              </h3>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Corporate Email</label>
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700/80 rounded-lg text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Authorization Token / Passkey</label>
                  <input
                    type="password"
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700/80 rounded-lg text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-mono text-xs"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleLogin(selectedProfile)}
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors mt-2"
                >
                  {isLoading ? 'Authorizing Session...' : 'Authenticate Demo Credentials'}
                </button>
              </div>
            </div>

            {/* Architecture Highlights Pill Box */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Engine Capabilities</h4>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-start space-x-2.5">
                  <Cpu className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-200">Multi-Model Consensus:</strong> FinRisk, OpsVelocity, StratAlign & Governance models run in parallel.</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-200">Monte Carlo Bounds:</strong> Evaluates probability distributions across tail-risk scenarios.</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-200">Explainable Decisions:</strong> Delivers weighted score rationale and phased roadmap.</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
