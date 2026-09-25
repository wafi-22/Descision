import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const DEMO_PROFILES = [
  {
    id: 'usr_exec',
    name: 'Victoria Vance',
    role: 'Chief Executive Officer',
    email: 'v.vance@enterprise.io',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Executive Board',
    clearanceLevel: 'L5 - Strategic Authorization'
  },
  {
    id: 'usr_strat',
    name: 'Elena Rostova',
    role: 'VP of Corporate Strategy',
    email: 'elena.r@enterprise.io',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Global Growth & Alliances',
    clearanceLevel: 'L4 - Strategic Advisory'
  },
  {
    id: 'usr_eng',
    name: 'Marcus Chen',
    role: 'Principal Systems Architect',
    email: 'marcus.c@enterprise.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Platform Engineering',
    clearanceLevel: 'L4 - Technical Authorization'
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('decisionmind_user');
      return saved ? JSON.parse(saved) : DEMO_PROFILES[0];
    } catch {
      return DEMO_PROFILES[0];
    }
  });

  const loginAs = (profile) => {
    setUser(profile);
    localStorage.setItem('decisionmind_user', JSON.stringify(profile));
  };

  const logout = () => {
    const guestUser = {
      id: 'usr_guest',
      name: 'Guest Evaluator',
      role: 'Decision Analyst',
      email: 'guest@decisionmind.ai',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      department: 'Advisory Sandbox',
      clearanceLevel: 'L3 - Sandbox Access'
    };
    setUser(guestUser);
    localStorage.setItem('decisionmind_user', JSON.stringify(guestUser));
  };

  return (
    <AuthContext.Provider value={{ user, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
