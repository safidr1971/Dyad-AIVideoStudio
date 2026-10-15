import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/DashboardLayout';
import { Settings, User, Globe, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [connectedPlatforms, setConnectedPlatforms] = useState({
    tiktok: true,
    instagram: true,
    youtube: false,
    facebook: false
  });

  const togglePlatform = (platform: keyof typeof connectedPlatforms) => {
    setConnectedPlatforms(prev => ({ ...prev, [platform]: !prev[platform] }));
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-zinc-400" />
            <span>Account Settings & Social Integrations</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Manage your creator profile and connected social media publishing accounts.</p>
        </div>
      </div>

      <div className="space-y-8 max-w-3xl">
        {/* Profile Card */}
        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" />
            <span>Creator Profile</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Display Name</label>
              <input 
                type="text" 
                disabled 
                value={userProfile?.displayName || 'Creator'} 
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none opacity-80"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Email Address (Firebase Auth)</label>
              <input 
                type="text" 
                disabled 
                value={user?.email || ''} 
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none opacity-80"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Firebase User UID</label>
              <input 
                type="text" 
                disabled 
                value={user?.uid || ''} 
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400 font-mono text-xs focus:outline-none opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Social Accounts */}
        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Globe className="w-5 h-5 text-pink-400" />
            <span>Connected Social Accounts</span>
          </h2>
          <p className="text-xs text-zinc-400 mb-6">Authorize accounts to enable automated 1-click publishing.</p>

          <div className="space-y-4">
            {[
              { id: 'tiktok', name: 'TikTok Creator Account', handle: '@reelaty_creator' },
              { id: 'instagram', name: 'Instagram Professional', handle: '@reelaty.ai' },
              { id: 'youtube', name: 'YouTube Shorts Channel', handle: 'Reelaty AI Studio' },
              { id: 'facebook', name: 'Facebook Reels Page', handle: 'Reelaty Official' }
            ].map((p) => {
              const isConnected = connectedPlatforms[p.id as keyof typeof connectedPlatforms];
              return (
                <div key={p.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{p.name}</h3>
                    <p className="text-xs text-zinc-400">{isConnected ? p.handle : 'Not connected'}</p>
                  </div>
                  <button 
                    onClick={() => togglePlatform(p.id as keyof typeof connectedPlatforms)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${isConnected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'}`}
                  >
                    {isConnected ? 'Connected ✓' : 'Connect Account'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Firebase Security & Project Info */}
        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Firebase Security & Configuration</span>
          </h2>
          <p className="text-xs text-zinc-400 mb-4">
            Project connected to official Firebase project <code className="text-purple-400 font-mono">ai-video-studio-fac95</code> with Cloud Firestore and Authentication enabled.
          </p>
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Database security rules active and enforcing user data scoping.</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
