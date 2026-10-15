import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, collection, query, where, getDocs, addDoc, Timestamp } from '../lib/firebase';
import { 
  LayoutDashboard, 
  Video, 
  Sparkles, 
  Layers, 
  Calendar, 
  CreditCard, 
  Settings, 
  LogOut, 
  Plus, 
  Play, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Share2, 
  ShieldAlert, 
  Zap, 
  Flame, 
  RefreshCw,
  Terminal,
  Database
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#0c0c10] flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-[1px] flex items-center justify-center">
              <div className="w-full h-full bg-[#09090b] rounded-[11px] flex items-center justify-center">
                <Play className="w-4 h-4 text-purple-400 fill-purple-400 ml-0.5" />
              </div>
            </div>
            <div>
              <span className="font-bold tracking-tight text-white">Reelaty<span className="text-purple-500">.ai</span></span>
              <div className="text-[10px] text-zinc-400 font-mono">ai-video-studio-fac95</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <Link 
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              <LayoutDashboard className="w-4 h-4 text-purple-400" />
              <span>Overview</span>
            </Link>
            <Link 
              to="/dashboard/wizard"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>AI Reel Wizard</span>
            </Link>
            <Link 
              to="/dashboard/videos"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              <Video className="w-4 h-4 text-blue-400" />
              <span>Video Projects</span>
            </Link>
            <Link 
              to="/dashboard/series"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Content Series</span>
            </Link>
            <Link 
              to="/dashboard/calendar"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Publish Calendar</span>
            </Link>
            <Link 
              to="/dashboard/credits"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              <CreditCard className="w-4 h-4 text-purple-400" />
              <span>Credits & Billing</span>
            </Link>
            <Link 
              to="/dashboard/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              <Settings className="w-4 h-4 text-zinc-400" />
              <span>Settings & Social</span>
            </Link>
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-400">Available Credits</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 flex items-center gap-1">
                <Zap className="w-3 h-3 text-purple-400" />
                {userProfile?.credits || 0}
              </span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full" 
                style={{ width: `${Math.min(100, ((userProfile?.credits || 0) / 500) * 100)}%` }} 
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-purple-600/30 border border-purple-500/50 flex items-center justify-center font-bold text-sm text-purple-300">
                {userProfile?.displayName?.[0] || user?.email?.[0] || 'C'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold truncate text-white">{userProfile?.displayName || 'Creator'}</div>
                <div className="text-[10px] text-zinc-400 truncate">{user?.email}</div>
              </div>
            </div>
            <button 
              onClick={() => logout()}
              className="p-2 text-zinc-400 hover:text-red-400 transition-colors rounded-xl hover:bg-white/5"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="h-16 border-b border-white/10 bg-[#09090b]/80 backdrop-blur-md px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <Database className="w-3.5 h-3.5 text-purple-400" />
              <span>Firebase: <strong className="text-white">ai-video-studio-fac95</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard/wizard"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 hover:opacity-90 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create New Reel</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
