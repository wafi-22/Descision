import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BrainCircuit, 
  LayoutDashboard, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  LogOut, 
  PlusCircle,
  Cpu
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Research Workspace', path: '/research', icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-navy-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-8">
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-brand-300 transition-colors">
                  DecisionMind <span className="text-brand-400">AI</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  MVP 2.5
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Scenario-Based Autonomous Decision Intelligence</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 shadow-sm shadow-brand-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Status Indicator, Action CTA, User Profile */}
        <div className="flex items-center space-x-4">
          
          {/* AI Consensus Engine Status Indicator */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <Cpu className="w-3.5 h-3.5" />
            <span className="font-medium">4/4 Consensus Models Active</span>
          </div>

          {/* New Decision CTA */}
          <button
            onClick={() => navigate('/research')}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-brand-600/30 hover:shadow-brand-500/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Decision</span>
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.name}
              className="w-8 h-8 rounded-full ring-2 ring-brand-500/40 object-cover"
            />
            <div className="hidden xl:block text-left text-xs">
              <div className="font-semibold text-slate-200">{user?.name}</div>
              <div className="text-[10px] text-slate-400 truncate max-w-[130px]">{user?.role}</div>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Switch user or logout"
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
